import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Mittal Communication CRM',
    template: '%s | Mittal Communication CRM',
  },
  description:
    'A secure, invitation-only workspace for Mittal Communication staff.',
  applicationName: 'Mittal Communication CRM',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#EEF1EA' }],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className={`min-h-dvh antialiased font-[var(--font-plus-jakarta,sans-serif)]`}>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: 'var(--ink)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '14px',
              fontSize: '14px',
              fontWeight: '500',
            },
          }}
        />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
