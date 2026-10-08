'use client'

import { useState } from 'react'

import { Button, Card, CardContent, CardHeader, Stack, TextField } from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'

import axiosInstance from '@/utils/axiosInstance'
import { environment } from '@/environments/environment'

/**
 * Minimal login page — hits the backend's `/auth/login` endpoint and
 * stashes the token in localStorage. The axios instance's request
 * interceptor picks it up on subsequent calls (see
 * `src/utils/axiosInstance.ts`); the 401 response interceptor is what
 * ultimately bounces the user back here if the token expires.
 */
export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async () => {
    setSubmitting(true)
    try {
      const res = await axiosInstance.post<{ data: { token: string } }>(environment.login, {
        username: email,
        password,
      })
      localStorage.setItem('token', res.data.data.token)
      const redirectTo = searchParams.get('redirectTo')
      router.push(redirectTo ?? '/en/dashboards/overview')
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '100vh', p: 2 }}>
      <Card sx={{ width: 360 }}>
        <CardHeader title="Admin sign in" />
        <CardContent>
          <Stack spacing={2}>
            <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
            />
            <Button variant="contained" onClick={onSubmit} disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
