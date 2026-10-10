import { z } from 'zod'

const email = z.string().trim().toLowerCase().email().max(254)

export const signInSchema = z.object({
  email,
  password: z.string().min(1).max(72),
})

export const emailOnlySchema = z.object({ email })

export const newPasswordSchema = z
  .object({
    password: z.string().min(12).max(72),
    confirmPassword: z.string().min(1).max(72),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  })

export const inviteUserSchema = z.object({
  email,
  fullName: z.string().trim().min(1).max(100),
  role: z.enum(['admin', 'salesperson']),
})

export const profileUpdateSchema = z.object({
  fullName: z.string().trim().min(1).max(100),
  phone: z.string().trim().max(32),
})

export const accountStatusSchema = z.object({
  profileId: z.string().uuid(),
  status: z.enum(['active', 'disabled']),
})

export type SignInInput = z.infer<typeof signInSchema>
export type EmailOnlyInput = z.infer<typeof emailOnlySchema>
export type NewPasswordInput = z.infer<typeof newPasswordSchema>
export type InviteUserInput = z.infer<typeof inviteUserSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type AccountStatusInput = z.infer<typeof accountStatusSchema>

