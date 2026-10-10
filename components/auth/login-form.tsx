'use client'

import { useState } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { LockKeyholeIcon } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

import { signInAction } from '@/lib/auth/actions'
import { signInSchema, type SignInInput } from '@/lib/auth/schemas'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null)
    const result = await signInAction(values)

    if (!result.ok) {
      setServerError(result.message)
    }
  })

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      {serverError && (
        <Alert variant="destructive">
          <AlertTitle>Sign-in could not be completed</AlertTitle>
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <FieldGroup className="flex flex-col gap-4">
        <Field data-invalid={Boolean(form.formState.errors.email)}>
          <FieldLabel htmlFor="login-email">Work email</FieldLabel>
          <Input
            id="login-email"
            type="email"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            aria-invalid={Boolean(form.formState.errors.email)}
            {...form.register('email')}
          />
          <FieldError>{form.formState.errors.email?.message}</FieldError>
        </Field>

        <Field data-invalid={Boolean(form.formState.errors.password)}>
          <div className="flex items-center justify-between gap-4">
            <FieldLabel htmlFor="login-password">Password</FieldLabel>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            aria-invalid={Boolean(form.formState.errors.password)}
            {...form.register('password')}
          />
          <FieldError>{form.formState.errors.password?.message}</FieldError>
        </Field>
      </FieldGroup>

      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? (
          <Spinner data-icon="inline-start" />
        ) : (
          <LockKeyholeIcon data-icon="inline-start" />
        )}
        {form.formState.isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}

