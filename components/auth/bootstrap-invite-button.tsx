'use client'

import { useActionState } from 'react'
import { KeyRoundIcon } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

import {
  requestInitialAdminInviteAction,
  type BootstrapActionState,
} from '@/lib/auth/bootstrap-actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

const initialState: BootstrapActionState = { status: 'idle', message: '' }

export function BootstrapInviteButton() {
  const [state, formAction, isPending] = useActionState(
    requestInitialAdminInviteAction,
    initialState,
  )

  return (
    <div className="flex flex-col gap-3">
      <form action={formAction}>
        <Button type="submit" variant="outline" className="w-full" disabled={isPending}>
          {isPending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <KeyRoundIcon data-icon="inline-start" />
          )}
          {isPending ? 'Preparing invitation…' : 'Send owner setup invitation'}
        </Button>
      </form>
      {state.message && (
        <Alert variant={state.status === 'error' ? 'destructive' : 'default'}>
          <AlertTitle>
            {state.status === 'error' ? 'Setup not completed' : 'Owner setup'}
          </AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

