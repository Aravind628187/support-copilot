import { useState, useRef } from 'react';
import { Seo } from '../../components/Seo';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { Copy, RefreshCcw } from 'lucide-react';

type Message = { id: string; role: 'user' | 'assistant' | 'system'; content: string };

export function AssistantChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastAssistantId, setLastAssistantId] = useState<string | null>(null);
  const { showToast } = useToast();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  async function sendPrompt(regenerate = false) {
    if (!input && !regenerate) return;

    const userMessage: Message = regenerate
      ? messages.find((m) => m.id === lastAssistantId)?.role === 'assistant'
        ? { id: crypto.randomUUID(), role: 'user', content: input }
        : { id: crypto.randomUUID(), role: 'user', content: input }
      : { id: crypto.randomUUID(), role: 'user', content: input };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const resp = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ messages: newMessages.map((m) => ({ role: m.role, content: m.content })) }),
      });

      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        throw new Error(body?.error?.message ?? 'AI request failed');
      }

      const data = await resp.json();
      const assistant: Message = { id: crypto.randomUUID(), role: 'assistant', content: data.reply };
      setMessages((prev) => [...prev, assistant]);
      setLastAssistantId(assistant.id);
      setInput('');
      inputRef.current?.focus();
    } catch (err) {
      showToast({ message: (err as Error).message || 'AI request failed', variant: 'error', });
    } finally {
      setIsLoading(false);
    }
  }

  function clearChat() {
    setMessages([]);
    setInput('');
    setLastAssistantId(null);
  }

  function copyResponse(text: string) {
    navigator.clipboard.writeText(text).then(() => showToast({ message: 'Copied response', variant: 'success' }));
  }

  return (
    <div className="flex flex-col gap-6">
      <Seo title="AI Assistant — Chat" description="Interactive AI assistant chat for support drafting" />

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div>
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">AI Assistant</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-3">
                {messages.length === 0 && (
                  <p className="text-sm text-ink-600 dark:text-ink-400">Start a conversation with the assistant. It can draft replies, summarize, and suggest KB articles.</p>
                )}

                <div className="space-y-3">
                  {messages.map((m) => (
                    <div key={m.id} className={m.role === 'assistant' ? 'rounded-lg bg-ink-50 p-3 dark:bg-ink-800' : 'rounded-lg bg-white p-3 dark:bg-ink-900'}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-sm text-ink-700 dark:text-ink-200">{m.role === 'assistant' ? 'Assistant' : m.role === 'user' ? 'You' : 'System'}</div>
                        {m.role === 'assistant' && (
                          <div className="flex items-center gap-2">
                            <button onClick={() => copyResponse(m.content)} className="text-ink-400 hover:text-ink-600">
                              <Copy className="h-4 w-4" />
                            </button>
                            <button onClick={() => { setInput(m.content); }} title="Use as prompt" className="text-ink-400 hover:text-ink-600">Use</button>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 whitespace-pre-wrap text-sm text-ink-800 dark:text-ink-100">{m.content}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask the assistant to draft a reply or summarize a thread..." />
                <div className="mt-3 flex items-center gap-2">
                  <Button isLoading={isLoading} onClick={() => sendPrompt(false)}>
                    {isLoading ? 'Generating...' : 'Send'}
                  </Button>
                  <Button variant="secondary" onClick={() => sendPrompt(true)} disabled={!lastAssistantId || isLoading}>
                    <RefreshCcw className="mr-2 h-4 w-4" /> Regenerate
                  </Button>
                  <Button variant="ghost" onClick={clearChat}>Clear</Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <h3 className="text-sm font-semibold">Suggested prompts</h3>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="flex flex-col gap-2">
                {[
                  'Draft a concise reply apologizing and requesting logs.',
                  'Summarize this conversation in 2 sentences.',
                  'List KB articles relevant to this issue.'
                ].map((s) => (
                  <button key={s} onClick={() => { setInput(s); inputRef.current?.focus(); }} className="text-left rounded-md p-2 hover:bg-ink-50 dark:hover:bg-ink-800">{s}</button>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AssistantChatPage;
