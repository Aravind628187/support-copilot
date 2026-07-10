import { prisma } from '../../lib/prisma';
import { ApiError } from '../../utils/apiError';
import { draftSupportReply } from '../../lib/gemini';
import { findRelevantArticles } from '../kb/kb.service';

async function loadTicketOr404(ticketId: string) {
  const ticket = await prisma.ticket.findFirst({ where: { id: ticketId, deletedAt: null } });
  if (!ticket) throw ApiError.notFound('Ticket not found');
  return ticket;
}

export async function listMessages(ticketId: string) {
  await loadTicketOr404(ticketId);
  return prisma.ticketMessage.findMany({
    where: { ticketId },
    include: { author: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'asc' },
  });
}

export async function addAgentMessage(ticketId: string, authorId: string, body: string) {
  await loadTicketOr404(ticketId);
  return prisma.ticketMessage.create({
    data: { ticketId, authorType: 'AGENT', authorId, body, isAiDraft: false },
    include: { author: { select: { id: true, name: true } } },
  });
}

/**
 * Generates an AI draft and stores it as a message with isAiDraft=true. It is
 * never shown to the customer and never auto-sent — an agent must open it,
 * edit if needed, and explicitly send it via updateMessage/send below.
 */
export async function generateDraftReply(ticketId: string) {
  const ticket = await loadTicketOr404(ticketId);
  const thread = await prisma.ticketMessage.findMany({
    where: { ticketId, isAiDraft: false },
    orderBy: { createdAt: 'asc' },
  });

  const relevantArticles = await findRelevantArticles(`${ticket.subject} ${ticket.description}`);

  const { draft, groundedOn } = await draftSupportReply({
    ticketSubject: ticket.subject,
    ticketDescription: ticket.description,
    conversation: thread.map((m) => ({
      author: m.authorType === 'CUSTOMER' ? 'Customer' : 'Agent',
      body: m.body,
    })),
    kbArticles: relevantArticles.map((a) => ({ title: a.title, content: a.content })),
  });

  const message = await prisma.ticketMessage.create({
    data: { ticketId, authorType: 'AI_DRAFT', authorId: null, body: draft, isAiDraft: true },
  });

  return { message, groundedOn };
}

/** Converts a draft into a sent message, or edits an existing agent message. Always attributed to the agent who sent it, never to the AI. */
export async function sendOrEditMessage(
  ticketId: string,
  messageId: string,
  agentId: string,
  body: string,
) {
  const existing = await prisma.ticketMessage.findFirst({ where: { id: messageId, ticketId } });
  if (!existing) throw ApiError.notFound('Message not found');

  return prisma.ticketMessage.update({
    where: { id: messageId },
    data: { body, isAiDraft: false, authorType: 'AGENT', authorId: agentId },
    include: { author: { select: { id: true, name: true } } },
  });
}
