'use client'

import type { ReactNode } from 'react'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import ReduxProvider from '@/redux-store/ReduxProvider'
import { SocketProvider } from '@/contexts/SocketContext'

const theme = createTheme({
  cssVariables: true,
  palette: { mode: 'light', primary: { main: '#4f46e5' } },
  shape: { borderRadius: 10 },
})

/**
 * Top-level client-side providers.
 *
 * Order matters: `AppRouterCacheProvider` must wrap `ThemeProvider` so
 * Emotion's cache is shared between the App Router's RSC/CSR boundary
 * and the MUI theme. Redux and the socket context go innermost so any
 * component below can dispatch or subscribe without re-mounting.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ReduxProvider>
          <SocketProvider>{children}</SocketProvider>
        </ReduxProvider>
        <ToastContainer position="bottom-right" autoClose={4000} />
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}
