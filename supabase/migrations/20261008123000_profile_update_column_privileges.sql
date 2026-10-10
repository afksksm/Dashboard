revoke update on table public.profiles from public, anon, authenticated;

grant update (full_name, phone, status)
on table public.profiles
to authenticated;

create or replace function private.prevent_last_admin_disable()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.role = 'admin'
    and old.status = 'active'
    and new.status = 'disabled'
  then
    perform pg_catalog.pg_advisory_xact_lock(640281, 2);

    if not exists (
      select 1
      from public.profiles p
      where p.id <> old.id
        and p.role = 'admin'
        and p.status = 'active'
    ) then
      raise exception using
        errcode = '23514',
        message = 'The last active administrator cannot be disabled';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_prevent_last_admin_disable on public.profiles;

create trigger profiles_prevent_last_admin_disable
before update of status on public.profiles
for each row execute function private.prevent_last_admin_disable();
