'use client'

import { useState } from 'react'

import { Button, Stack } from '@mui/material'

import GenerateOfferCodeDialog from '@/views/webhooks/GenerateOfferCodeDialog'
import WebhookEventsTable from '@/views/webhooks/WebhookEventsTable'

export default function WebhooksPage() {
  const [open, setOpen] = useState(false)

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" onClick={() => setOpen(true)}>
          Generate Apple offer code
        </Button>
      </Stack>
      <WebhookEventsTable />
      <GenerateOfferCodeDialog open={open} onClose={() => setOpen(false)} />
    </Stack>
  )
}
