'use client'

import { useEffect, useMemo, useState } from 'react'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import classnames from 'classnames'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { toast } from 'react-toastify'

import axiosInstance from '@/utils/axiosInstance'
import { environment } from '@/environments/environment'
import { formatServerDate } from '@/utils/datetime'

import tableStyles from '@core/styles/table.module.css'

type AppleOfferCodeRow = {
  id: number
  product_id: string
  plan_tier: string
  plan_period: string
  trial_label: string
  campaign_id: string
  custom_code_id: string
  duration_days: number
  code: string
  total_codes: number
  served_count: number
  confirmed_count: number
  codes_left: number
  expiration_date: string | null
  active: boolean
  created_at: string | null
  deactivated_at: string | null
}

const TIER_CHIP_COLOR: Record<string, 'default' | 'primary' | 'info' | 'warning'> = {
  Standard: 'default',
  Silver: 'info',
  Gold: 'warning',
  Diamond: 'primary'
}

const columnHelper = createColumnHelper<AppleOfferCodeRow>()

const AppleOfferCodesTable = () => {
  const [rows, setRows] = useState<AppleOfferCodeRow[]>([])
  const [loading, setLoading] = useState(false)
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25, totalRows: 0 })
  const [activeOnly, setActiveOnly] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')

  const [confirmTarget, setConfirmTarget] = useState<AppleOfferCodeRow | null>(null)
  const [deactivating, setDeactivating] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim())
      setPagination(p => ({ ...p, pageIndex: 0 }))
    }, 400)
    return () => clearTimeout(timeout)
  }, [searchInput])

  const fetchCodes = async () => {
    setLoading(true)
    const params: Record<string, string> = {
      page: String(pagination.pageIndex),
      limit: String(pagination.pageSize),
      active_only: String(activeOnly)
    }
    if (search) params.search = search

    try {
      const res = await axiosInstance.get(`${environment.appleOfferCodes}?${new URLSearchParams(params).toString()}`)
      const payload = res.data?.data
      setRows(payload?.data ?? [])
      setPagination(prev => ({
        pageIndex: payload?.page ?? prev.pageIndex,
        pageSize: payload?.per_page ?? prev.pageSize,
        totalRows: payload?.total ?? 0
      }))
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load Apple offer codes', { position: 'bottom-right' })
    } finally {
      setLoading(false)
      setHasFetchedOnce(true)
    }
  }

  useEffect(() => {
    fetchCodes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex, pagination.pageSize, activeOnly, search])

  const handleDeactivate = async () => {
    if (!confirmTarget) return
    setDeactivating(true)
    try {
      const res = await axiosInstance.post(`${environment.appleOfferCodes}/${confirmTarget.id}/deactivate`)
      if (res.data?.status) {
        toast.success(res.data?.message || 'Offer code deactivated', { position: 'bottom-right' })
        setConfirmTarget(null)
        fetchCodes()
      } else {
        toast.error(res.data?.message || 'Failed to deactivate', { position: 'bottom-right' })
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to deactivate', { position: 'bottom-right' })
    } finally {
      setDeactivating(false)
    }
  }

  const columns = useMemo<ColumnDef<AppleOfferCodeRow, any>[]>(
    () => [
      columnHelper.accessor('plan_tier', {
        header: 'Plan',
        cell: ({ row }) => (
          <Chip
            label={row.original.plan_tier}
            color={TIER_CHIP_COLOR[row.original.plan_tier] || 'default'}
            size='small'
            variant='tonal'
          />
        )
      }),
      columnHelper.accessor('plan_period', {
        header: 'Period',
        cell: ({ row }) => <Typography>{row.original.plan_period}</Typography>
      }),
      columnHelper.accessor('trial_label', {
        header: 'Trial',
        cell: ({ row }) => <Typography>{row.original.trial_label}</Typography>
      }),
      columnHelper.accessor('product_id', {
        header: 'Product ID',
        cell: ({ row }) => (
          <Typography variant='caption' color='text.secondary' sx={{ fontFamily: 'monospace' }}>
            {row.original.product_id}
          </Typography>
        )
      }),
      columnHelper.accessor('code', {
        header: 'Code',
        cell: ({ row }) => (
          <Typography sx={{ fontFamily: 'monospace' }}>{row.original.code}</Typography>
        )
      }),
      columnHelper.accessor('total_codes', {
        header: 'Total',
        cell: ({ row }) => <Typography>{row.original.total_codes}</Typography>
      }),
      columnHelper.accessor('served_count', {
        header: 'Served',
        cell: ({ row }) => <Typography>{row.original.served_count}</Typography>
      }),
      columnHelper.accessor('confirmed_count', {
        header: 'Confirmed',
        cell: ({ row }) => <Typography>{row.original.confirmed_count}</Typography>
      }),
      columnHelper.accessor('codes_left', {
        header: 'Codes Left',
        cell: ({ row }) => <Typography>{row.original.codes_left}</Typography>
      }),
      columnHelper.accessor('expiration_date', {
        header: 'Expires',
        cell: ({ row }) =>
          row.original.expiration_date ? (
            <Typography variant='body2'>{row.original.expiration_date}</Typography>
          ) : (
            <Typography variant='body2' color='text.secondary'>—</Typography>
          )
      }),
      columnHelper.accessor('active', {
        header: 'Status',
        cell: ({ row }) =>
          row.original.active ? (
            <Chip label='Active' color='success' size='small' variant='tonal' />
          ) : (
            <Chip label='Inactive' color='error' size='small' variant='tonal' />
          )
      }),
      columnHelper.accessor('created_at', {
        header: 'Created',
        cell: ({ row }) =>
          row.original.created_at ? (
            <Typography variant='body2'>{formatServerDate(row.original.created_at)}</Typography>
          ) : (
            <Typography variant='body2' color='text.secondary'>—</Typography>
          )
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) =>
          row.original.active ? (
            <Button
              size='small'
              variant='outlined'
              color='error'
              onClick={() => setConfirmTarget(row.original)}
            >
              Deactivate
            </Button>
          ) : row.original.deactivated_at ? (
            <Typography variant='caption' color='text.secondary'>
              {`Deactivated ${formatServerDate(row.original.deactivated_at)}`}
            </Typography>
          ) : (
            <Typography variant='caption' color='text.secondary'>—</Typography>
          )
      })
    ],
    []
  )

  const table = useReactTable({
    data: rows,
    columns,
    filterFns: { fuzzy: () => true },
    getCoreRowModel: getCoreRowModel()
  })

  if (loading && !hasFetchedOnce) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={50} color='inherit' />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader
        className='flex flex-wrap gap-y-2'
        title='Apple Offer Codes'
        action={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems='center'>
            <TextField
              size='small'
              placeholder='Search by code or product id'
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <FormControlLabel
              control={
                <Switch
                  size='small'
                  checked={activeOnly}
                  onChange={e => {
                    setActiveOnly(e.target.checked)
                    setPagination(p => ({ ...p, pageIndex: 0 }))
                  }}
                />
              }
              label='Active only'
            />
          </Stack>
        }
      />
      <div className='overflow-x-auto'>
        <table className={tableStyles.table} style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    style={{
                      paddingInline: '1.25rem 1rem',
                      position: 'sticky',
                      top: 0,
                      zIndex: 2,
                      backgroundColor: 'var(--mui-palette-customColors-tableHeaderBg)',
                      boxShadow: 'inset 0 -1px 0 var(--border-color, rgba(0,0,0,0.12))'
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {rows.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                  No data available
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className={classnames({ 'opacity-60': !row.original.active })}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} style={{ paddingInline: '1.25rem 1rem' }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component='div'
        className='border-bs'
        count={pagination.totalRows}
        rowsPerPage={pagination.pageSize}
        page={pagination.pageIndex}
        onPageChange={(_, page) => setPagination(p => ({ ...p, pageIndex: page }))}
        onRowsPerPageChange={e =>
          setPagination(p => ({ ...p, pageSize: Number(e.target.value), pageIndex: 0 }))
        }
      />

      <Dialog open={Boolean(confirmTarget)} onClose={() => !deactivating && setConfirmTarget(null)}>
        <DialogTitle>Deactivate offer code?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmTarget && (
              <>
                This will deactivate <b>{confirmTarget.code}</b> offer code.
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmTarget(null)} disabled={deactivating}>
            Cancel
          </Button>
          <Button onClick={handleDeactivate} color='error' variant='contained' disabled={deactivating}>
            {deactivating ? <CircularProgress size={20} color='inherit' /> : 'Deactivate'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default AppleOfferCodesTable
