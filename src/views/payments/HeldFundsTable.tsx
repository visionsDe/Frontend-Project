'use client'

import { useEffect, useMemo, useState } from 'react'

import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Stack from '@mui/material/Stack'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import classnames from 'classnames'
import { useRouter, useParams } from 'next/navigation'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type FilterFn
} from '@tanstack/react-table'
import { toast } from 'react-toastify'

import ChevronRight from '@menu/svg/ChevronRight'
import axiosInstance from '@/utils/axiosInstance'
import { environment } from '@/environments/environment'
import { formatServerDate } from '@/utils/datetime'
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@/configs/i18n'
import type { HeldFundRow, TransferStatus } from '@/types/apps/heldFundsTypes'
import { displayNameWithCompany } from '@/utils/string'

import tableStyles from '@core/styles/table.module.css'

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const STATUS_META: Record<TransferStatus, { label: string; color: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error' | 'secondary' }> = {
  pending: { label: 'Pending', color: 'secondary' },
  held: { label: 'Held', color: 'warning' },
  released: { label: 'Released', color: 'success' },
  blocked: { label: 'Blocked', color: 'error' },
  refunded: { label: 'Refunded', color: 'info' },
  failed: { label: 'Failed', color: 'error' }
}

const columnHelper = createColumnHelper<HeldFundRow>()

const HeldFundsTable = () => {
  const router = useRouter()
  const { lang: locale } = useParams()

  const [rows, setRows] = useState<HeldFundRow[]>([])
  const [loading, setLoading] = useState(false)
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false)
  const [pagination, setPagination] = useState({ pageIndex: 1, pageSize: 25, totalRows: 0 })
  const [includeBlocked, setIncludeBlocked] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim())
      setPagination(p => ({ ...p, pageIndex: 1 }))
    }, 400)
    return () => clearTimeout(timeout)
  }, [searchInput])

  const fetchHeldFunds = async () => {
    setLoading(true)
    const params: Record<string, string> = {
      page: String(pagination.pageIndex),
      limit: String(pagination.pageSize),
      include_blocked: String(includeBlocked)
    }
    if (search) params.search = search

    try {
      const res = await axiosInstance.get(`${environment.heldFunds}?${new URLSearchParams(params).toString()}`)
      const payload = res.data?.data

      setRows(payload?.data ?? [])
      setPagination(prev => ({
        pageIndex: payload?.page ?? prev.pageIndex,
        pageSize: payload?.per_page ?? prev.pageSize,
        totalRows: payload?.total ?? 0
      }))
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to load held funds', { position: 'bottom-right' })
    } finally {
      setLoading(false)
      setHasFetchedOnce(true)
    }
  }

  useEffect(() => {
    fetchHeldFunds()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex, pagination.pageSize, includeBlocked, search])

  const columns = useMemo<ColumnDef<HeldFundRow, any>[]>(
    () => [
      columnHelper.accessor('order_number', {
        header: 'Order #',
        cell: ({ row }) => (
          <Button
            variant='text'
            className='font-medium'
            onClick={() => router.push(getLocalizedUrl(`/apps/bookings/details/${row.original.booking_id}`, locale as Locale))}
          >
            {row.original.order_number}
          </Button>
        )
      }),
      columnHelper.accessor('customer_name', {
        header: 'Customer',
        cell: ({ row }) => <Typography>{displayNameWithCompany(row.original.customer_name, (row.original as any).customer_company_name) || '—'}</Typography>
      }),
      columnHelper.accessor('supplier_name', {
        header: 'Supplier',
        cell: ({ row }) => <Typography>{displayNameWithCompany(row.original.supplier_name, (row.original as any).supplier_company_name) || '—'}</Typography>
      }),
      columnHelper.accessor('amount', {
        header: 'Amount',
        cell: ({ row }) => (
          <Stack>
            <Typography>{`${row.original.currency_code || ''} ${row.original.amount}`}</Typography>
            {Number(row.original.refunded_amount) > 0 && (
              <Typography variant='caption' color='text.secondary'>
                {`Refunded: ${row.original.currency_code || ''} ${row.original.refunded_amount}`}
              </Typography>
            )}
          </Stack>
        )
      }),
      columnHelper.accessor('transfer_status', {
        header: 'Transfer Status',
        cell: ({ row }) => {
          const meta = STATUS_META[row.original.transfer_status] || STATUS_META.pending

          return <Chip label={meta.label} color={meta.color} size='small' variant='tonal' />
        }
      }),
      columnHelper.accessor('review_window_ends_at', {
        header: 'Review Window Ends',
        cell: ({ row }) =>
          row.original.review_window_ends_at ? (
            <Typography variant='body2'>{formatServerDate(row.original.review_window_ends_at)}</Typography>
          ) : (
            <Typography variant='body2' color='text.secondary'>—</Typography>
          )
      }),
      columnHelper.accessor('captured_at', {
        header: 'Captured At',
        cell: ({ row }) =>
          row.original.captured_at ? (
            <Typography variant='body2'>{formatServerDate(row.original.captured_at)}</Typography>
          ) : (
            <Typography variant='body2' color='text.secondary'>—</Typography>
          )
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale]
  )

  const table = useReactTable({
    data: rows,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel()
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
        title='Held Funds'
        subheader='SCT orders captured but not yet released to the supplier'
        action={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems='center'>
            <TextField
              size='small'
              placeholder='Search by order #'
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <FormControlLabel
              control={
                <Switch
                  size='small'
                  checked={includeBlocked}
                  onChange={e => {
                    setIncludeBlocked(e.target.checked)
                    setPagination(p => ({ ...p, pageIndex: 1 }))
                  }}
                />
              }
              label='Include blocked'
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
                    {header.isPlaceholder ? null : (
                      <div
                        className={classnames({
                          'flex items-center': header.column.getIsSorted(),
                          'cursor-pointer select-none': header.column.getCanSort()
                        })}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <ChevronRight fontSize='1.25rem' className='-rotate-90' />,
                          desc: <ChevronRight fontSize='1.25rem' className='rotate-90' />
                        }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                      </div>
                    )}
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
                <tr key={row.id}>
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
        rowsPerPageOptions={[25, 50, 100, 200]}
        component='div'
        className='border-bs'
        count={pagination.totalRows}
        rowsPerPage={pagination.pageSize}
        page={Math.max(0, pagination.pageIndex - 1)}
        onPageChange={(_, page) => setPagination(p => ({ ...p, pageIndex: page + 1 }))}
        onRowsPerPageChange={e =>
          setPagination(p => ({ ...p, pageSize: Number(e.target.value), pageIndex: 1 }))
        }
      />
    </Card>
  )
}

export default HeldFundsTable
