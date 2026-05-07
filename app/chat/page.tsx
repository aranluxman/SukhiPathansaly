'use client';

import { FormEvent, useMemo, useState } from 'react';
import { MessageIcon, SendIcon } from '@/components/Icons';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const starters = [
  'Give me a healthy breakfast idea 🥗',
  'Help me plan a 20-minute workout 💪',
  'What are some tips for better sleep? 😴'
];

function makeStaticReply(prompt: string) {
  const normalized = prompt.toLowerCase();
  const setupNote =
    'Live Claude replies are ready for a Cloudflare Functions or Worker setup with ANTHROPIC_API_KEY. This static version keeps the key safe and never exposes it in the browser.';

  if (normalized.includes('breakfast')) {
    return `Sukhi, a lovely breakfast idea: Greek yogurt with berries, chopped nuts, and a little cinnamon, plus warm tea or water. ${setupNote}`;
  }

  if (normalized.includes('workout') || normalized.includes('20-minute')) {
    return `Here is a gentle 20-minute plan: 5 minutes easy walking, 8 minutes bodyweight squats and wall pushups, 5 minutes stretching, and 2 minutes slow breathing. ${setupNote}`;
  }

  if (normalized.includes('sleep')) {
    return `For better sleep tonight: dim lights an hour before bed, keep the room cool, avoid late caffeine, and try three slow breathing rounds. ${setupNote}`;
  }

  return `I am here as Sukhi's wellness companion. ${setupNote}`;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-luxury-line bg-luxury-card px-4 py-3 text-luxury-gold-light shadow-gold">
      <span className="text-lg">✨</span>
      <span className="flex gap-1">
        <span className="typing-dot h-2 w-2 rounded-full bg-luxury-gold" />
        <span className="typing-dot h-2 w-2 rounded-full bg-luxury-gold" />
        <span className="typing-dot h-2 w-2 rounded-full bg-luxury-gold" />
      </span>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const showStarters = messages.length === 0;
  const intro = useMemo(
    () =>
      "Ask for meal ideas, workout plans, sleep support, or a tiny bit of encouragement. This page is static-safe, so it will not expose Alux's API key.",
    []
  );

  function sendMessage(value: string) {
    const text = value.trim();
    if (!text || typing) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: text
    };

    setMessages((current) => [...current, userMessage]);
    setInput('');
    setTyping(true);

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content: makeStaticReply(text)
        }
      ]);
      setTyping(false);
    }, 700);
  }

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="page-shell">
      <section className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-4xl flex-col">
        <div className="mb-6">
          <p className="soft-label text-luxury-gold-light">AI wellness chatbot</p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-luxury-text">Sukhi&apos;s wellness assistant</h1>
          <p className="mt-3 max-w-2xl text-luxury-muted">{intro}</p>
        </div>

        <div className="section-card flex min-h-[560px] flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {showStarters ? (
              <div className="grid h-full content-center gap-5 py-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-luxury-line bg-luxury-gold/10 text-luxury-gold-light shadow-gold">
                  <MessageIcon className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-luxury-text">A warm place to ask</h2>
                  <p className="mx-auto mt-2 max-w-xl text-luxury-muted">
                    Live Claude chat requires a server-side Cloudflare Functions or Worker deployment. For now, these starter prompts show the full chat experience safely.
                  </p>
                </div>
                <div className="mx-auto grid w-full max-w-xl gap-3">
                  {starters.map((starter) => (
                    <button
                      className="secondary-button justify-start text-left"
                      key={starter}
                      onClick={() => sendMessage(starter)}
                      type="button"
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  key={message.id}
                >
                  <div
                    className={`max-w-[82%] rounded-lg px-4 py-3 text-sm leading-6 shadow-card ${
                      message.role === 'user'
                        ? 'bg-black/40 text-luxury-text'
                        : 'border border-luxury-line bg-luxury-card text-luxury-text shadow-gold'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <span className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-luxury-gold/10 text-sm">
                        ✨
                      </span>
                    ) : null}
                    <p>{message.content}</p>
                  </div>
                </div>
              ))
            )}

            {typing ? (
              <div className="flex justify-start">
                <TypingIndicator />
              </div>
            ) : null}
          </div>

          <form className="mt-5 flex gap-3 border-t border-luxury-line pt-5" onSubmit={submitMessage}>
            <input
              className="form-field"
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask for a meal idea, workout, or wellness tip"
              value={input}
            />
            <button aria-label="Send message" className="primary-button shrink-0 px-4" disabled={typing} type="submit">
              <SendIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
