export type ChatMessage = {
  id: number
  conversation_id: number
  sender_id: number
  sender_name: string | null
  sender_company_name?: string | null
  body: string | null
  attach_doc: string | null
  created_at: string
  message_status?: string
}

export type Conversation = {
  conversation_id: number
  status: string
  user_name: string
  user_company_name: string | null
  profile_img: string | null
  user_id: number
  last_message: ChatMessage | null
  unread_count?: number
}

export type ConversationDetails = {
  conversation_id: number
  conversation_status: string
  user_name: string
  user_company_name: string | null
  user_profile_image: string | null
  booking_id: number | null
  sender_id: number
  participants: number[]
  messages: ChatMessage[]
}
