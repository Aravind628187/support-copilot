import { useState } from 'react';
import { Sparkles, Send, Pencil } from 'lucide-react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { formatDateTime } from '../../lib/utils';
import type { TicketMessage } from '../../types';

interface MessageThreadProps {
  messages: TicketMessage[];
  onSendDraft: (messageId: string, body: string) => void;
  isSending: boolean;
}

export function MessageThread({ messages, onSendDraft, isSending }: MessageThreadProps) {
  if (messages.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-ink-400">
        No messages yet — the first reply starts the conversation.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((message) =>
        message.isAiDraft ? (
          <AiDraftBubble key={message.id} message={message} onSend={onSendDraft} isSending={isSending} />
        ) : (
          <RegularBubble key={message.id} message={message} />
        ),
      )}
    </div>
  );
}

function RegularBubble({ message }: { message: TicketMessage }) {
  const isCustomer = message.authorType === 'CUSTOMER';
  return (
    <div className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
        isCustomer
          ? 'bg-ink-100 text-ink-950 dark:bg-ink-800 dark:text-ink-100'
          : 'bg-accent-500 text-white'
      }`}
      >
        <p className="whitespace-pre-wrap">{message.body}</p>
        <p
          className={`mt-1 text-[11px] ${isCustomer ? 'text-ink-400' : 'text-accent-100'}`}
        >
          {isCustomer ? 'Customer' : message.author?.name ?? 'Agent'} · {formatDateTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

function AiDraftBubble({
  message,
  onSend,
  isSending,
}: {
  message: TicketMessage;
  onSend: (messageId: string, body: string) => void;
  isSending: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(message.body);

  return (
    <div className="rounded-lg border border-dashed border-ai-400 bg-ai-50 p-3 dark:border-ai-500 dark:bg-ai-500/10">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-ai-600 dark:text-ai-400">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        AI DRAFT — review before sending
      </div>

      {editing ? (
        <Textarea
          id={`draft-${message.id}`}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="bg-white dark:bg-ink-900"
        />
      ) : (
        <p className="whitespace-pre-wrap text-sm text-ink-950 dark:text-ink-100">{message.body}</p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <p className="font-mono text-[11px] text-ai-600/80 dark:text-ai-400/80">
          {formatDateTime(message.createdAt)}
        </p>
        <div className="flex gap-2">
          {!editing && (
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          )}
          <Button
            size="sm"
            isLoading={isSending}
            onClick={() => onSend(message.id, body)}
          >
            <Send className="h-3.5 w-3.5" />
            {editing ? 'Send edited reply' : 'Send as-is'}
          </Button>
        </div>
      </div>
    </div>
  );
}
