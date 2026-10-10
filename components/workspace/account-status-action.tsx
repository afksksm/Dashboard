'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { updateAccountStatusAction } from '@/lib/auth/team-actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import type { AccountStatus } from '@/lib/supabase/domain'

export function AccountStatusAction({
  profileId,
  fullName,
  status,
}: {
  profileId: string
  fullName: string
  status: AccountStatus
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const nextStatus: AccountStatus = status === 'active' ? 'disabled' : 'active'
  const willDisable = nextStatus === 'disabled'

  const confirmChange = () => {
    setError(null)
    startTransition(async () => {
      try {
        const result = await updateAccountStatusAction({ profileId, status: nextStatus })
        if (!result.ok) {
          setError(result.message)
          return
        }

        toast.success(result.message)
        setOpen(false)
        router.refresh()
      } catch {
        setError('We could not update this account. Please try again.')
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            size="sm"
            variant={willDisable ? 'outline' : 'secondary'}
            aria-label={`${willDisable ? 'Disable' : 'Enable'} ${fullName}`}
          />
        }
      >
        {willDisable ? 'Disable' : 'Enable'}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {willDisable ? 'Disable this account?' : 'Restore this account?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {willDisable
              ? `${fullName} will be blocked from signing in, and database access will be denied immediately.`
              : `${fullName} will be able to sign in and access the workspace again.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Account not updated</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            type="button"
            variant={willDisable ? 'destructive' : 'default'}
            disabled={isPending}
            onClick={confirmChange}
          >
            {isPending && <Spinner data-icon="inline-start" />}
            {willDisable ? 'Disable account' : 'Restore account'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

