import ChatPanel from '@/views/chat/ChatPanel'

/**
 * In the production dashboard the chat page accepts a participant id
 * through a sidebar selection; for the sample we hard-wire a demo id so
 * the panel can be viewed standalone.
 */
export default function ChatPage() {
  return <ChatPanel participantId={1} />
}
