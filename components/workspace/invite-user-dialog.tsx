'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { UserPlusIcon } from 'lucide-react'

import { inviteUserAction } from '@/lib/auth/team-actions'
import { inviteUserSchema, type InviteUserInput } from '@/lib/auth/schemas'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function InviteUserDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const form = useForm<InviteUserInput>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: { email: '', fullName: '', role: 'salesperson' },
  })

  const onOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) setActionError(null)
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setActionError(null)
    const result = await inviteUserAction(values)

    if (!result.ok) {
      setActionError(result.message)
      return
    }

    toast.success(result.message)
    form.reset()
    setOpen(false)
    router.refresh()
  })

  const roleError = form.formState.errors.role?.message

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger
        render={
          <Button>
            <UserPlusIcon data-icon="inline-start" />
            Invite teammate
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Invite a teammate</DialogTitle>
          <DialogDescription>
            They will receive a secure link to set their password and join the workspace.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          {actionError && (
            <Alert variant="destructive">
              <AlertTitle>Invitation not sent</AlertTitle>
              <AlertDescription>{actionError}</AlertDescription>
            </Alert>
          )}
          <FieldGroup className="flex flex-col gap-4">
            <Field data-invalid={Boolean(form.formState.errors.fullName)}>
              <FieldLabel htmlFor="invite-full-name">Full name</FieldLabel>
              <Input
                id="invite-full-name"
                autoComplete="name"
                aria-invalid={Boolean(form.formState.errors.fullName)}
                {...form.register('fullName')}
              />
              <FieldError>{form.formState.errors.fullName?.message}</FieldError>
            </Field>
            <Field data-invalid={Boolean(form.formState.errors.email)}>
              <FieldLabel htmlFor="invite-email">Work email</FieldLabel>
              <Input
                id="invite-email"
                type="email"
                autoComplete="email"
                autoCapitalize="none"
                aria-invalid={Boolean(form.formState.errors.email)}
                {...form.register('email')}
              />
              <FieldError>{form.formState.errors.email?.message}</FieldError>
            </Field>
            <Field data-invalid={Boolean(roleError)}>
              <FieldLabel htmlFor="invite-role">Role</FieldLabel>
              <Controller
                control={form.control}
                name="role"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value ?? 'salesperson')}
                  >
                    <SelectTrigger
                      id="invite-role"
                      aria-invalid={Boolean(roleError)}
                      onBlur={field.onBlur}
                    >
                      <SelectValue placeholder="Choose a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="salesperson">Salesperson</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldDescription>
                Administrators can invite teammates and manage account access.
              </FieldDescription>
              <FieldError>{roleError}</FieldError>
            </Field>
          </FieldGroup>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Spinner data-icon="inline-start" />}
              Send invitation
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

