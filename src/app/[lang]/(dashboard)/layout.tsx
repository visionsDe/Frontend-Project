import type { ReactNode } from 'react'

import Link from 'next/link'

import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'

type Params = { lang: string }

const NAV = [
  { href: 'dashboards/overview', label: 'Overview' },
  { href: 'apps/payments', label: 'Payments' },
  { href: 'apps/webhooks', label: 'Webhooks' },
  { href: 'apps/chat', label: 'Chat' },
  { href: 'apps/ai-usage', label: 'AI usage' },
]

/**
 * Thin dashboard shell — the production app has a full sidebar + nav
 * stack; here we keep the file so the route structure parallels the
 * real codebase and so each module page lands under
 * `[lang]/(dashboard)/apps/...` the same way.
 */
export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<Params>
}) {
  const { lang } = await params

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" elevation={1} color="default">
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 0, mr: 4 }}>
            Sample Dashboard
          </Typography>
          {NAV.map(item => (
            <Button key={item.href} component={Link} href={`/${lang}/${item.href}`} size="small">
              {item.label}
            </Button>
          ))}
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flex: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  )
}
