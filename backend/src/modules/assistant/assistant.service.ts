import { generateAssistantReply } from '../../lib/gemini';
import { recordAudit } from '../audit/audit.service';

export async function chat(messages: { role: 'system' | 'user' | 'assistant'; content: string }[], actorId: string | null) {
  const reply = await generateAssistantReply(messages);

  // Record that an assistant call occurred for auditing.
  await recordAudit({
    actorId,
    action: 'assistant.chat',
    entityType: 'AssistantSession',
    entityId: 'chat',
    metadata: { messageCount: messages.length },
  });

  return reply;
}
