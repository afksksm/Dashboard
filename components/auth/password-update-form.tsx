'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { KeyRoundIcon } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

import { updatePasswordAction } from '@/lib/auth/actions'
import { newPasswordSchema, type NewPasswordInput } from '@/lib/auth/schemas'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export function PasswordUpdateForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const form = useForm<NewPasswordInput>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null)
    const result = await updatePasswordAction(values)

    if (!result.ok) {
      setServerError(result.message)
    }
  })

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      {serverError && (
        <Alert variant="destructive">
          <AlertTitle>Password not updated</AlertTitle>
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <FieldGroup className="flex flex-col gap-4">
        <Field data-invalid={Boolean(form.formState.errors.password)}>
          <FieldLabel htmlFor="new-password">New password</FieldLabel>
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(form.formState.errors.password)}
            {...form.register('password')}
          />
          <FieldDescription>Use at least 12 characters.</FieldDescription>
          <FieldError>{form.formState.errors.password?.message}</FieldError>
        </Field>

        <Field data-invalid={Boolean(form.formState.errors.confirmPassword)}>
          <FieldLabel htmlFor="confirm-password">Confirm password</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(form.formState.errors.confirmPassword)}
            {...form.register('confirmPassword')}
          />
          <FieldError>{form.formState.errors.confirmPassword?.message}</FieldError>
        </Field>
      </FieldGroup>

      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? (
          <Spinner data-icon="inline-start" />
        ) : (
          <KeyRoundIcon data-icon="inline-start" />
        )}
        {form.formState.isSubmitting ? 'Saving password…' : 'Save password'}
      </Button>
    </form>
  )
}

