'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { updateProfileAction } from '@/lib/auth/account-actions'
import { profileUpdateSchema, type ProfileUpdateInput } from '@/lib/auth/schemas'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import type { UserProfile } from '@/lib/supabase/domain'

export function ProfileSettingsForm({ profile }: { profile: UserProfile }) {
  const router = useRouter()
  const [actionError, setActionError] = useState<string | null>(null)
  const form = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: profile.full_name,
      phone: profile.phone ?? '',
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    setActionError(null)
    const result = await updateProfileAction(values)

    if (!result.ok) {
      setActionError(result.message)
      return
    }

    toast.success(result.message)
    router.refresh()
  })

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>Profile details</CardTitle>
        <CardDescription>
          Update the name and contact number shown to your team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          {actionError && (
            <Alert variant="destructive">
              <AlertTitle>Profile not saved</AlertTitle>
              <AlertDescription>{actionError}</AlertDescription>
            </Alert>
          )}
          <FieldGroup className="flex flex-col gap-4 sm:grid sm:grid-cols-2">
            <Field className="sm:col-span-2" data-invalid={Boolean(form.formState.errors.fullName)}>
              <FieldLabel htmlFor="profile-full-name">Full name</FieldLabel>
              <Input
                id="profile-full-name"
                autoComplete="name"
                aria-invalid={Boolean(form.formState.errors.fullName)}
                {...form.register('fullName')}
              />
              <FieldError>{form.formState.errors.fullName?.message}</FieldError>
            </Field>
            <Field data-invalid={Boolean(form.formState.errors.phone)}>
              <FieldLabel htmlFor="profile-phone">Phone number</FieldLabel>
              <Input
                id="profile-phone"
                type="tel"
                autoComplete="tel"
                aria-invalid={Boolean(form.formState.errors.phone)}
                {...form.register('phone')}
              />
              <FieldError>{form.formState.errors.phone?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="profile-email">Email</FieldLabel>
              <Input id="profile-email" value={profile.email} readOnly aria-readonly="true" />
            </Field>
          </FieldGroup>
          <div className="flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Spinner data-icon="inline-start" />}
              Save profile
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

