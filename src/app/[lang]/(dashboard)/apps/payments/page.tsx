import { Stack } from '@mui/material'

import HeldFundsTable from '@/views/payments/HeldFundsTable'
import TransactionsSummary from '@/views/payments/TransactionsSummary'

export default function PaymentsPage() {
  return (
    <Stack spacing={3}>
      <TransactionsSummary />
      <HeldFundsTable />
    </Stack>
  )
}
