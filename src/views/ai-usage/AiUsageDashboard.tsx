'use client'

import { useEffect, useMemo, useState } from 'react'

import { Card, CardContent, CardHeader, Grid, Stack, TextField, Typography } from '@mui/material'
import ReactECharts from 'echarts-for-react'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

import DataGrid from '@/components/DataGrid'
import { fetchAiUsageByFeature, fetchAiUsageDaily } from '@/services/aiUsage'
import { centsToDollars, errorRatePct, formatLatency, localDateToUtcDate } from '@/utils/formatters'
import { useAppDispatch, useAppSelector } from '@/redux-store'
import { setDaily, setLoading, setRollup } from '@/redux-store/slices/aiUsage'

import type { AiUsageRollupRow } from './types'

/**
 * AI spend dashboard — pairs with `app/models/ai_usage.py` on the
 * backend. Shows a daily spend line chart alongside the per-feature /
 * per-model rollup table so finance can watch the cost shape without
 * digging into provider dashboards.
 */
const rollupColumnHelper = createColumnHelper<AiUsageRollupRow>()

export default function AiUsageDashboard() {
  const dispatch = useAppDispatch()
  const { daily, rollup, loading } = useAppSelector(s => s.aiUsage)

  const [fromDate, setFromDate] = useState(() => dayjs().subtract(14, 'day').format('YYYY-MM-DD'))
  const [toDate, setToDate] = useState(() => dayjs().format('YYYY-MM-DD'))

  useEffect(() => {
    let cancelled = false
    const from_date = localDateToUtcDate(fromDate)
    const to_date = localDateToUtcDate(toDate)
    dispatch(setLoading(true))
    Promise.all([fetchAiUsageDaily({ from_date, to_date }), fetchAiUsageByFeature({ from_date, to_date })])
      .then(([dailyData, rollupData]) => {
        if (cancelled) return
        dispatch(setDaily(dailyData))
        dispatch(setRollup(rollupData))
      })
      .catch(err => {
        if (!cancelled) toast.error(err?.response?.data?.message ?? 'Failed to load AI usage')
      })
      .finally(() => {
        if (!cancelled) dispatch(setLoading(false))
      })
    return () => {
      cancelled = true
    }
  }, [fromDate, toDate, dispatch])

  const chartOption = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        formatter: (params: any[]) => {
          const [spend] = params
          const row = daily.find(d => d.day === spend.axisValue)
          return `${spend.axisValue}<br/>Spend: ${centsToDollars(row?.spend_cents)}<br/>Requests: ${row?.request_count ?? 0}`
        },
      },
      grid: { left: 50, right: 20, bottom: 30, top: 20 },
      xAxis: { type: 'category', data: daily.map(d => d.day) },
      yAxis: { type: 'value', axisLabel: { formatter: (v: number) => centsToDollars(v) } },
      series: [
        {
          name: 'Daily spend',
          type: 'line',
          smooth: true,
          areaStyle: { opacity: 0.15 },
          data: daily.map(d => d.spend_cents),
          itemStyle: { color: '#4f46e5' },
        },
      ],
    }),
    [daily],
  )

  const columns = useMemo<ColumnDef<AiUsageRollupRow, unknown>[]>(
    () => [
      rollupColumnHelper.accessor('feature', { header: 'Feature' }),
      rollupColumnHelper.accessor('model', {
        header: 'Model',
        cell: info => (
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            {info.getValue()}
          </Typography>
        ),
      }),
      rollupColumnHelper.accessor('request_count', { header: 'Requests' }),
      rollupColumnHelper.accessor('error_count', {
        header: 'Error rate',
        cell: ({ row }) => errorRatePct(row.original.request_count, row.original.error_count),
      }),
      rollupColumnHelper.accessor('avg_latency_ms', {
        header: 'Avg latency',
        cell: info => formatLatency(info.getValue()),
      }),
      rollupColumnHelper.accessor('spend_cents', {
        header: 'Spend',
        cell: info => <strong>{centsToDollars(info.getValue())}</strong>,
      }),
    ],
    [],
  )

  return (
    <Stack spacing={3}>
      <Card>
        <CardHeader
          title="AI spend"
          action={
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                size="small"
                type="date"
                label="From"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                size="small"
                type="date"
                label="To"
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          }
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ReactECharts option={chartOption} notMerge style={{ height: 260 }} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="By feature / model" subheader="Per-row cost calibrated from app/services/ai_client/pricing.py" />
        <DataGrid
          rows={rollup}
          columns={columns}
          totalRows={rollup.length}
          pageIndex={1}
          pageSize={25}
          loading={loading}
          onPageChange={() => undefined}
          onPageSizeChange={() => undefined}
        />
      </Card>
    </Stack>
  )
}
