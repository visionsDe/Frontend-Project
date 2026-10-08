'use client'

import { useEffect, useState } from 'react'

import { Card, CardContent, CardHeader, Grid, Stack, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { fetchTransactionsSummary } from '@/services/payments'
import type { CurrencyRollup } from './types'

/**
 * Finance rollup pulled from `/admin/transactions/summary`.
 *
 * Backend does the SCT vs legacy destination-charge accounting in SQL
 * (see `app/routes/admin.py`), so the UI just has to render the
 * per-currency rows and feed them to a chart.
 */
export default function TransactionsSummary() {
  const [rows, setRows] = useState<CurrencyRollup[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchTransactionsSummary()
      .then(data => {
        if (!cancelled) setRows(data)
      })
      .catch(err => {
        if (!cancelled) toast.error(err?.response?.data?.message ?? 'Failed to load summary')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const chartData = rows.map(r => ({
    currency: r.currency_code,
    gross: Number(r.gross_payments ?? 0),
    fees: Number(r.stripe_fees ?? 0) + Number(r.participation_fees ?? 0),
    net: Number(r.net_to_suppliers ?? 0),
    refunded: Number(r.refunded_amount ?? 0),
  }))

  return (
    <Card>
      <CardHeader title="Transactions summary" subheader="Gross / fees / refunds / net to suppliers, per currency" />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Stack spacing={1.5}>
              {loading && <Typography variant="body2">Loading…</Typography>}
              {!loading && rows.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No transactions yet.
                </Typography>
              )}
              {rows.map(row => (
                <Card key={row.currency_code} variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {row.currency_symbol ?? ''} {row.currency_code} · {row.transactions_count} txns
                    </Typography>
                    <Stack direction="row" spacing={2} mt={1} flexWrap="wrap">
                      <Metric label="Gross" value={row.gross_payments} />
                      <Metric label="Refunded" value={row.refunded_amount} />
                      <Metric label="Stripe fees" value={row.stripe_fees} />
                      <Metric label="Participation fees" value={row.participation_fees} />
                      <Metric label="Net to suppliers" value={row.net_to_suppliers} highlight />
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12} md={7}>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="currency" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="gross" fill="#4f46e5" />
                  <Bar dataKey="net" fill="#22c55e" />
                  <Bar dataKey="refunded" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

function Metric({ label, value, highlight }: { label: string; value: string | null; highlight?: boolean }) {
  return (
    <Stack>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={highlight ? 700 : 500} color={highlight ? 'success.main' : 'text.primary'}>
        {value ?? '—'}
      </Typography>
    </Stack>
  )
}
