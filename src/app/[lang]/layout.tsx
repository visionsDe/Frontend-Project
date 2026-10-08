import type { ReactNode } from 'react'

import { i18n, type Locale } from '@/config/i18n'
import Providers from '@/components/Providers'

import '@/app/globals.css'

export const metadata = {
  title: 'Sample Marketplace Dashboard',
  description: 'Admin dashboard — curated showcase',
}

type Params = { lang: Locale }

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<Params>
}) {
  const { lang } = await params
  const direction = i18n.langDirection[lang] ?? 'ltr'

  return (
    <html id="__next" lang={lang} dir={direction}>
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
