import { GoogleGenAI } from "@google/genai";
import { env, isAiConfigured } from "../config/env";
import { logger } from "./logger";

const client = isAiConfigured
  ? new GoogleGenAI({ apiKey: env.GEMINI_API_KEY! })
  : null;

export class AiNotConfiguredError extends Error {
  constructor() {
    super("AI draft replies are not configured. Set GEMINI_API_KEY in the backend .env file.");
    this.name = "AiNotConfiguredError";
  }
}

interface ConversationTurn {
  author: "Customer" | "Agent";
  body: string;
}

interface KbContext {
  title: string;
  content: string;
}

export async function draftSupportReply(params: {
  ticketSubject: string;
  ticketDescription: string;
  conversation: ConversationTurn[];
  kbArticles: KbContext[];
}): Promise<{ draft: string; groundedOn: string[] }> {
  if (!client) {
    throw new AiNotConfiguredError();
  }

  const kbContext = params.kbArticles.length
    ? params.kbArticles
        .map(
          (article, i) =>
            `[KB ${i + 1}] ${article.title}\n${article.content}`
        )
        .join("\n\n")
    : "No matching knowledge base articles were found.";

  const conversationText = params.conversation.length
    ? params.conversation
        .map((turn) => `${turn.author}: ${turn.body}`)
        .join("\n")
    : "(No messages yet — this is the first reply.)";

  const prompt = `
You are a professional customer support assistant.

Rules:
- Answer ONLY using the knowledge base.
- Never invent information.
- Be polite and concise.
- If information is missing, tell the customer you'll investigate.

Ticket Subject:
${params.ticketSubject}

Ticket Description:
${params.ticketDescription}

Conversation:
${conversationText}

Knowledge Base:
${kbContext}

Write the next support reply only.
`;

  try {
    const response = await client.models.generateContent({
      model: env.GEMINI_MODEL,
      contents: prompt,
    });

    return {
      draft: response.text?.trim() ?? "",
      groundedOn: params.kbArticles.map((a) => a.title),
    };
  } catch (err) {
    logger.error("Gemini draft-reply call failed", {
      error: (err as Error).message,
    });
    throw err;
  }
}