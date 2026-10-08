'use client'

import { type ReactNode } from 'react'

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import classnames from 'classnames'
import { CircularProgress, TablePagination } from '@mui/material'

/**
 * Reusable generic DataGrid wrapper.
 *
 * Everywhere a feature wants a sortable paginated table, we hand this
 * component the typed rows plus a column definition and get the full
 * table shell for free — header, loading state, empty state,
 * server-side pagination controls. Keeping the signature strictly
 * generic over `T` (not `any`) means consumers get a compile error if
 * their column accessor references a key that doesn't exist on the row
 * type.
 *
 * Server-side pagination: this component is purely presentational —
 * callers hold the page state and refetch on change. We don't lift the
 * table state inside here because every dashboard page lifts additional
 * filter state alongside it and would otherwise need to proxy events
 * back out.
 */
export type DataGridProps<T> = {
  rows: T[]
  columns: ColumnDef<T, unknown>[]
  totalRows: number
  pageIndex: number // 1-based
  pageSize: number
  pageSizeOptions?: number[]
  loading?: boolean
  onPageChange: (nextPageIndex: number) => void
  onPageSizeChange: (nextPageSize: number) => void
  emptyState?: ReactNode
}

export default function DataGrid<T>({
  rows,
  columns,
  totalRows,
  pageIndex,
  pageSize,
  pageSizeOptions = [25, 50, 100, 200],
  loading = false,
  onPageChange,
  onPageSizeChange,
  emptyState,
}: DataGridProps<T>) {
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
          <CircularProgress size={40} />
        </div>
      )}
      <div className="overflow-x-auto">
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    style={{
                      textAlign: 'left',
                      padding: '0.75rem 1rem',
                      position: 'sticky',
                      top: 0,
                      background: 'var(--mui-palette-grey-100, #f5f5f5)',
                      boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.08)',
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={classnames({
                          'cursor-pointer select-none': header.column.getCanSort(),
                        })}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === 'asc' ? ' ↑' : null}
                        {header.column.getIsSorted() === 'desc' ? ' ↓' : null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.length === 0 && !loading ? (
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} style={{ textAlign: 'center', padding: '2rem' }}>
                  {emptyState ?? 'No data available'}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} style={{ padding: '0.75rem 1rem' }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <TablePagination
        component="div"
        rowsPerPageOptions={pageSizeOptions}
        count={totalRows}
        rowsPerPage={pageSize}
        page={Math.max(0, pageIndex - 1)}
        onPageChange={(_, next) => onPageChange(next + 1)}
        onRowsPerPageChange={e => onPageSizeChange(Number(e.target.value))}
      />
    </div>
  )
}
