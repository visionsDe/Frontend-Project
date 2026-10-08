import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { AiUsageDailyPoint, AiUsageRollupRow } from '@/views/ai-usage/types'

type AiUsageState = {
  daily: AiUsageDailyPoint[]
  rollup: AiUsageRollupRow[]
  loading: boolean
}

const initialState: AiUsageState = {
  daily: [],
  rollup: [],
  loading: false,
}

const aiUsageSlice = createSlice({
  name: 'aiUsage',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    setDaily(state, action: PayloadAction<AiUsageDailyPoint[]>) {
      state.daily = action.payload
    },
    setRollup(state, action: PayloadAction<AiUsageRollupRow[]>) {
      state.rollup = action.payload
    },
  },
})

export const { setLoading, setDaily, setRollup } = aiUsageSlice.actions
export default aiUsageSlice.reducer
