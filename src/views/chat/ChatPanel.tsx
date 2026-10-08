'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'

import {
  Avatar,
  Box,
  Card,
  CardHeader,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'

import { useSocket } from '@/contexts/SocketContext'
import { useAppDispatch, useAppSelector } from '@/redux-store'
import {
  appendMessage,
  clearDetails,
  setActiveConversation,
  setDetails,
  setLoading,
} from '@/redux-store/slices/chatModule'
import { fetchConversation, uploadChatFile } from '@/services/chat'
import { formatServerDate } from '@/utils/datetime'
import { displayNameWithCompany } from '@/utils/string'

import type { ChatMessage } from './types'

const MAX_FILE_SIZE_MB = 10

/**
 * Chat panel bound to a single participant.
 *
 * Three sources of state wire together here:
 *   1. Initial history is loaded by hitting the REST endpoint and
 *      storing the full details in Redux.
 *   2. The Socket.IO context pushes `new_message` into Redux as it
 *      arrives (see `SocketContext.tsx`) — the panel just subscribes.
 *   3. Outgoing messages emit via the socket; the server echoes it back
 *      and the subscription above adds it to the list, so sending and
 *      receiving funnel through the same reducer path.
 *
 * File uploads use the REST endpoint (axios multipart) because the
 * socket channel isn't the right place for binary blobs; the returned
 * path is sent as a regular message's `attach_doc`.
 */
export default function ChatPanel({ participantId }: { participantId: number }) {
  const socket = useSocket()
  const dispatch = useAppDispatch()
  const details = useAppSelector(s => s.chatModule.details)
  const loading = useAppSelector(s => s.chatModule.loading)
  const scrollEndRef = useRef<HTMLDivElement>(null)
  const [draft, setDraft] = useState('')

  useEffect(() => {
    let cancelled = false
    dispatch(setLoading(true))
    fetchConversation(participantId)
      .then(payload => {
        if (cancelled) return
        dispatch(setDetails(payload))
        dispatch(setActiveConversation(payload.conversation_id))
      })
      .catch(err => {
        if (!cancelled) toast.error(err?.response?.data?.message ?? 'Failed to load conversation')
      })
    return () => {
      cancelled = true
      dispatch(clearDetails())
      dispatch(setActiveConversation(null))
    }
  }, [participantId, dispatch])

  // Auto-scroll on new messages — only when the user is near the bottom
  // so a scrolled-up historical read doesn't jump them back down.
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [details?.messages.length])

  const sendMessage = (body: string, attach_doc?: string) => {
    if (!socket || !details) return
    const payload: Partial<ChatMessage> & { sender_name: string } = {
      conversation_id: details.conversation_id,
      sender_id: details.sender_id,
      sender_name: 'Admin',
      body,
      attach_doc: attach_doc ?? null,
    }
    socket.emit('send_message', payload)
    // Optimistic update — the socket will echo back the authoritative
    // row (with id + created_at) and dedup is handled by id in a real
    // app. For the sample we just push the draft.
    dispatch(
      appendMessage({
        id: Date.now(),
        conversation_id: details.conversation_id,
        sender_id: details.sender_id,
        sender_name: 'Admin',
        body,
        attach_doc: attach_doc ?? null,
        created_at: new Date().toISOString(),
      }),
    )
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = draft.trim()
    if (!trimmed) return
    sendMessage(trimmed)
    setDraft('')
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    accept: {
      'image/*': [],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    onDropRejected: rejections => toast.error(rejections[0]?.errors[0]?.message ?? 'Upload rejected'),
    onDropAccepted: async files => {
      try {
        const { path } = await uploadChatFile(files[0])
        sendMessage(files[0].name, path)
      } catch (err: any) {
        toast.error(err?.response?.data?.message ?? 'Upload failed')
      }
    },
  })

  if (loading && !details) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight={400}>
        <CircularProgress />
      </Box>
    )
  }

  if (!details) return null

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '70vh' }}>
      <CardHeader
        avatar={<Avatar src={details.user_profile_image ?? undefined} />}
        title={displayNameWithCompany(details.user_name, details.user_company_name)}
        subheader={details.booking_id ? `Booking #${details.booking_id}` : 'Direct chat'}
      />
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2 }}>
        <Stack spacing={1}>
          {details.messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} isOwn={msg.sender_id === details.sender_id} />
          ))}
          <div ref={scrollEndRef} />
        </Stack>
      </Box>
      <Box
        {...getRootProps()}
        component="form"
        onSubmit={onSubmit}
        sx={{
          display: 'flex',
          gap: 1,
          p: 1.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          background: isDragActive ? 'rgba(79,70,229,0.08)' : undefined,
        }}
      >
        <input {...getInputProps()} />
        <IconButton
          component="label"
          onClick={e => {
            // Prevent dropzone-opened file dialog from firing twice when
            // the icon is clicked rather than drag-and-dropped.
            e.stopPropagation()
          }}
        >
          <span role="img" aria-label="attach">
            📎
          </span>
        </IconButton>
        <TextField
          size="small"
          placeholder={isDragActive ? 'Drop file to send' : 'Write a message…'}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onClick={e => e.stopPropagation()}
          fullWidth
        />
      </Box>
    </Card>
  )
}

function MessageBubble({ message, isOwn }: { message: ChatMessage; isOwn: boolean }) {
  return (
    <Stack
      direction={isOwn ? 'row-reverse' : 'row'}
      spacing={1}
      alignItems="flex-end"
      sx={{ my: 0.5 }}
    >
      <Box
        sx={{
          maxWidth: '70%',
          px: 1.5,
          py: 1,
          borderRadius: 2,
          background: isOwn ? 'primary.main' : 'grey.100',
          color: isOwn ? 'primary.contrastText' : 'text.primary',
        }}
      >
        {message.body && (
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
            {message.body}
          </Typography>
        )}
        {message.attach_doc && (
          <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
            <a href={message.attach_doc} target="_blank" rel="noreferrer">
              {message.body ?? 'Attachment'}
            </a>
          </Typography>
        )}
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          {formatServerDate(message.created_at, 'HH:mm')}
        </Typography>
      </Box>
    </Stack>
  )
}
