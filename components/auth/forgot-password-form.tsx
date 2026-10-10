'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { MailIcon } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

import { requestPasswordResetAction } from '@/lib/auth/actions'
import { emailOnlySchema, type EmailOnlyInput } from '@/lib/auth/schemas'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export function ForgotPasswordForm() {
  const [resultMessage, setResultMessage] = useState<{
    ok: boolean
    message: string
  } | null>(null)
  const form = useForm<EmailOnlyInput>({
    resolver: zodResolver(emailOnlySchema),
    defaultValues: { email: '' },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    setResultMessage(null)
    setResultMessage(await requestPasswordResetAction(values))
  })

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      {resultMessage && (
        <Alert variant={resultMessage.ok ? 'default' : 'destructive'}>
          <AlertTitle>
            {resultMessage.ok ? 'Check your inbox' : 'Request not completed'}
          </AlertTitle>
          <AlertDescription>{resultMessage.message}</AlertDescription>
        </Alert>
      )}

      <FieldGroup className="flex flex-col gap-4">
        <Field data-invalid={Boolean(form.formState.errors.email)}>
          <FieldLabel htmlFor="reset-email">Work email</FieldLabel>
          <Input
            id="reset-email"
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            aria-invalid={Boolean(form.formState.errors.email)}
            {...form.register('email')}
          />
          <FieldError>{form.formState.errors.email?.message}</FieldError>
        </Field>
      </FieldGroup>

      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? (
          <Spinner data-icon="inline-start" />
        ) : (
          <MailIcon data-icon="inline-start" />
        )}
        {form.formState.isSubmitting ? 'Sending link…' : 'Send reset link'}
      </Button>
    </form>
  )
}

