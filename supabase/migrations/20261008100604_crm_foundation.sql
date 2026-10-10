create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

grant usage on schema public to authenticated, service_role;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null check (email = lower(btrim(email))),
  full_name text not null default '',
  phone text,
  avatar_url text,
  role text not null default 'salesperson' check (role in ('admin', 'salesperson')),
  status text not null default 'active' check (status in ('active', 'disabled')),
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index profiles_email_lower_unique
  on public.profiles (lower(email));

create table public.user_invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null check (email = lower(btrim(email))),
  role text not null check (role in ('admin', 'salesperson')),
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'revoked', 'failed', 'expired')),
  invited_by uuid references public.profiles (id) on delete set null,
  auth_user_id uuid unique references auth.users (id) on delete set null,
  is_bootstrap boolean not null default false,
  sent_at timestamptz,
  accepted_at timestamptz,
  revoked_at timestamptz,
  expires_at timestamptz not null default (now() + interval '1 hour'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bootstrap_invitation_is_admin check (not is_bootstrap or role = 'admin'),
  constraint bootstrap_invitation_has_no_inviter check (not is_bootstrap or invited_by is null),
  constraint regular_invitation_has_inviter check (is_bootstrap or invited_by is not null)
);

create unique index user_invitations_one_pending_per_email
  on public.user_invitations (lower(email))
  where status = 'pending';

create index user_invitations_created_at_idx
  on public.user_invitations (created_at desc);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null check (length(btrim(action)) between 1 and 120),
  entity_type text not null check (length(btrim(entity_type)) between 1 and 80),
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now()
);

create index activity_logs_created_at_idx
  on public.activity_logs (created_at desc);

create index activity_logs_actor_created_at_idx
  on public.activity_logs (actor_id, created_at desc);

create or replace function private.touch_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace function private.is_active_user()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.status = 'active'
  );
$$;

create or replace function private.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'
      and p.status = 'active'
  );
$$;

create or replace function private.expire_previous_invitation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.user_invitations
  set status = 'expired'
  where lower(email) = lower(new.email)
    and status = 'pending'
    and expires_at <= statement_timestamp();

  return new;
end;
$$;

create or replace function private.require_matching_invitation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email is null or new.invited_at is null then
    raise exception using
      errcode = '42501',
      message = 'CRM accounts must be created through an invitation';
  end if;

  if not exists (
    select 1
    from public.user_invitations i
    where lower(i.email) = lower(new.email)
      and i.status = 'pending'
      and i.expires_at > statement_timestamp()
  ) then
    raise exception using
      errcode = '42501',
      message = 'CRM accounts must be created through an invitation';
  end if;

  return new;
end;
$$;

create or replace function private.handle_invited_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_invitation public.user_invitations%rowtype;
  v_role text;
  v_name text;
begin
  select i.*
  into v_invitation
  from public.user_invitations i
  where lower(i.email) = lower(new.email)
    and i.status = 'pending'
    and i.expires_at > statement_timestamp()
  order by i.created_at desc
  limit 1
  for update;

  if not found then
    raise exception using
      errcode = '42501',
      message = 'CRM accounts must be created through an invitation';
  end if;

  if v_invitation.is_bootstrap then
    perform pg_advisory_xact_lock(640281, 1);

    if exists (select 1 from public.profiles) then
      raise exception using
        errcode = '42501',
        message = 'Initial administrator setup is already complete';
    end if;

    v_role := 'admin';
  else
    v_role := v_invitation.role;
  end if;

  v_name := coalesce(
    nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''),
    split_part(new.email, '@', 1)
  );

  insert into public.profiles (id, email, full_name, role, status)
  values (new.id, lower(new.email), v_name, v_role, 'active');

  update public.user_invitations
  set auth_user_id = new.id
  where id = v_invitation.id;

  return new;
end;
$$;

create or replace function private.record_auth_email_confirmation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.email_confirmed_at is null and new.email_confirmed_at is not null then
    update public.user_invitations
    set status = 'accepted',
        accepted_at = now()
    where auth_user_id = new.id
      and status = 'pending';
  end if;

  return new;
end;
$$;

create or replace function private.record_user_invitation_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_action text;
  v_actor_id uuid;
begin
  if tg_op = 'INSERT' then
    v_action := case when new.is_bootstrap then 'user.bootstrap_requested' else 'user.invite_requested' end;
    v_actor_id := new.invited_by;
  elsif new.status is distinct from old.status then
    v_action := case new.status
      when 'accepted' then 'user.invitation_accepted'
      when 'failed' then 'user.invitation_failed'
      when 'expired' then 'user.invitation_expired'
      when 'revoked' then 'user.invitation_revoked'
      else 'user.invitation_updated'
    end;
    v_actor_id := case when new.status = 'accepted' then new.auth_user_id else new.invited_by end;
  elsif old.sent_at is null and new.sent_at is not null then
    v_action := 'user.invited';
    v_actor_id := new.invited_by;
  else
    return new;
  end if;

  insert into public.activity_logs (actor_id, action, entity_type, entity_id, metadata)
  values (
    v_actor_id,
    v_action,
    'user_invitation',
    new.id,
    jsonb_build_object('role', new.role, 'bootstrap', new.is_bootstrap)
  );

  return new;
end;
$$;

create or replace function private.record_profile_status_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_action text;
begin
  if old.status is distinct from new.status then
    v_action := case new.status
      when 'disabled' then 'user.disabled'
      else 'user.reenabled'
    end;

    insert into public.activity_logs (actor_id, action, entity_type, entity_id)
    values ((select auth.uid()), v_action, 'profile', new.id);
  end if;

  return new;
end;
$$;

create or replace function private.prevent_activity_log_mutation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  raise exception using
    errcode = '55000',
    message = 'Activity logs are append-only';
end;
$$;

create or replace function private.record_login()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Authentication required';
  end if;

  update public.profiles
  set last_login_at = now()
  where id = v_user_id
    and status = 'active';

  if not found then
    raise exception using errcode = '42501', message = 'Active account required';
  end if;

  insert into public.activity_logs (actor_id, action, entity_type, entity_id)
  values (v_user_id, 'auth.login', 'profile', v_user_id);
end;
$$;

create or replace function public.record_login()
returns void
language sql
security invoker
set search_path = ''
as $$
  select private.record_login();
$$;

create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function private.touch_updated_at();

create trigger user_invitations_touch_updated_at
before update on public.user_invitations
for each row execute function private.touch_updated_at();

create trigger user_invitations_expire_previous
before insert on public.user_invitations
for each row execute function private.expire_previous_invitation();

create trigger user_invitations_log_insert
  after insert on public.user_invitations
  for each row execute function private.record_user_invitation_event();

create trigger user_invitations_log_update
  after update on public.user_invitations
  for each row execute function private.record_user_invitation_event();

create trigger profiles_log_status_change
  after update of status on public.profiles
  for each row execute function private.record_profile_status_event();

create trigger activity_logs_immutable
before update or delete on public.activity_logs
for each row execute function private.prevent_activity_log_mutation();

create trigger crm_require_auth_invitation
before insert on auth.users
for each row execute function private.require_matching_invitation();

create trigger crm_create_invited_profile
after insert on auth.users
for each row execute function private.handle_invited_auth_user();

create trigger crm_record_auth_email_confirmation
after update of email_confirmed_at on auth.users
for each row execute function private.record_auth_email_confirmation();

alter table public.profiles enable row level security;
alter table public.user_invitations enable row level security;
alter table public.activity_logs enable row level security;

create policy profiles_select_active_self_or_admin
on public.profiles
for select
to authenticated
using (
  private.is_active_user()
  and (id = (select auth.uid()) or private.is_active_admin())
);

create policy profiles_update_self
on public.profiles
for update
to authenticated
using (id = (select auth.uid()) and status = 'active')
with check (id = (select auth.uid()) and status = 'active');

create policy profiles_admin_update_other_status
on public.profiles
for update
to authenticated
using (private.is_active_admin() and id <> (select auth.uid()))
with check (private.is_active_admin() and id <> (select auth.uid()));

create policy user_invitations_select_admin
on public.user_invitations
for select
to authenticated
using (private.is_active_admin());

create policy user_invitations_insert_admin
on public.user_invitations
for insert
to authenticated
with check (
  private.is_active_admin()
  and invited_by = (select auth.uid())
  and not is_bootstrap
  and status = 'pending'
);

create policy activity_logs_select_admin
on public.activity_logs
for select
to authenticated
using (private.is_active_admin());

revoke all on public.profiles, public.user_invitations, public.activity_logs from anon, authenticated, service_role;
grant select on public.profiles to authenticated;
grant update (full_name, phone, avatar_url, status) on public.profiles to authenticated;
grant select, insert on public.user_invitations to authenticated;
grant select on public.activity_logs to authenticated;

grant select on public.profiles to service_role;
grant select, insert, update on public.user_invitations to service_role;
grant select, insert on public.activity_logs to service_role;

revoke all on function private.touch_updated_at() from public, anon, authenticated;
revoke all on function private.is_active_user() from public, anon;
revoke all on function private.is_active_admin() from public, anon;
grant execute on function private.is_active_user() to authenticated;
grant execute on function private.is_active_admin() to authenticated;
revoke all on function private.expire_previous_invitation() from public, anon, authenticated;
revoke all on function private.require_matching_invitation() from public, anon, authenticated;
revoke all on function private.handle_invited_auth_user() from public, anon, authenticated;
revoke all on function private.record_auth_email_confirmation() from public, anon, authenticated;
revoke all on function private.record_user_invitation_event() from public, anon, authenticated;
revoke all on function private.record_profile_status_event() from public, anon, authenticated;
revoke all on function private.prevent_activity_log_mutation() from public, anon, authenticated;
revoke all on function private.record_login() from public, anon, authenticated;
grant execute on function private.record_login() to authenticated;
revoke all on function public.record_login() from public, anon, authenticated;
grant execute on function public.record_login() to authenticated;

notify pgrst, 'reload schema';
