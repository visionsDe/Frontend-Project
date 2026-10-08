import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { AppleOfferCodeRow, WebhookEventRow } from '@/views/webhooks/types'

type WebhookEventsState = {
  rows: WebhookEventRow[]
  total: number
  offerCodes: AppleOfferCodeRow[]
  loading: boolean
}

const initialState: WebhookEventsState = {
  rows: [],
  total: 0,
  offerCodes: [],
  loading: false,
}

const webhookEventsSlice = createSlice({
  name: 'webhookEvents',
  initialState,
  reducers: {
    setEvents(state, action: PayloadAction<{ rows: WebhookEventRow[]; total: number }>) {
      state.rows = action.payload.rows
      state.total = action.payload.total
      state.loading = false
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    setOfferCodes(state, action: PayloadAction<AppleOfferCodeRow[]>) {
      state.offerCodes = action.payload
    },
    prependOfferCode(state, action: PayloadAction<AppleOfferCodeRow>) {
      state.offerCodes.unshift(action.payload)
    },
  },
})

export const { setEvents, setLoading, setOfferCodes, prependOfferCode } = webhookEventsSlice.actions
export default webhookEventsSlice.reducer
