import axiosInstance from '@/utils/axiosInstance'
import { environment } from '@/environments/environment'
import type { ApiEnvelope } from '@/types/api'

import type { Conversation, ConversationDetails } from '@/views/chat/types'

export async function fetchConversations(): Promise<Conversation[]> {
  const res = await axiosInstance.get<ApiEnvelope<Conversation[]>>(environment.conversations)
  return res.data.data
}

export async function fetchConversation(participantId: number): Promise<ConversationDetails> {
  const res = await axiosInstance.get<ApiEnvelope<ConversationDetails>>(
    `${environment.conversations}/${participantId}`,
  )
  return res.data.data
}

export async function uploadChatFile(file: File): Promise<{ path: string }> {
  const formData = new FormData()
  formData.append('chat_file', file)
  const res = await axiosInstance.post<ApiEnvelope<{ path: string }>>(
    environment.chatUpload,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return res.data.data
}
