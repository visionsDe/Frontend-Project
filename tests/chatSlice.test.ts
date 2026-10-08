import { describe, expect, it } from 'vitest'

import reducer, {
  appendMessage,
  clearDetails,
  setActiveConversation,
  setDetails,
} from '@/redux-store/slices/chatModule'
import type { ChatMessage, ConversationDetails } from '@/views/chat/types'

const stubDetails = (): ConversationDetails => ({
  conversation_id: 42,
  conversation_status: 'active',
  user_name: 'Alice',
  user_company_name: 'Acme',
  user_profile_image: null,
  booking_id: null,
  sender_id: 1,
  participants: [1, 2],
  messages: [],
})

const stubMessage = (overrides: Partial<ChatMessage> = {}): ChatMessage => ({
  id: 100,
  conversation_id: 42,
  sender_id: 2,
  sender_name: 'Alice',
  body: 'hi',
  attach_doc: null,
  created_at: '2026-10-08T00:00:00',
  ...overrides,
})

describe('chatModule slice', () => {
  it('setDetails replaces details and clears loading', () => {
    const state = reducer(undefined, setDetails(stubDetails()))
    expect(state.details?.conversation_id).toBe(42)
    expect(state.loading).toBe(false)
  })

  it('appendMessage adds to the active conversation', () => {
    const seed = reducer(undefined, setDetails(stubDetails()))
    const next = reducer(seed, appendMessage(stubMessage()))
    expect(next.details?.messages).toHaveLength(1)
  })

  it('appendMessage ignores events for other conversations', () => {
    const seed = reducer(undefined, setDetails(stubDetails()))
    const next = reducer(seed, appendMessage(stubMessage({ conversation_id: 99 })))
    expect(next.details?.messages).toHaveLength(0)
  })

  it('clearDetails drops the detail payload', () => {
    const seed = reducer(undefined, setDetails(stubDetails()))
    const next = reducer(seed, clearDetails())
    expect(next.details).toBeNull()
  })

  it('setActiveConversation tracks the id separately from details', () => {
    const next = reducer(undefined, setActiveConversation(7))
    expect(next.activeConversationId).toBe(7)
    expect(next.details).toBeNull()
  })
})
