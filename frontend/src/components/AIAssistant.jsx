import { useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "/api/chat";

const suggestions = [
  "How can I prepare for a doctor visit?",
  "What type of doctor should I see for a skin concern?"
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isSending]);

  async function sendMessage(event) {
    event.preventDefault();
    const text = draft.trim();

    if (!text || isSending) return;

    const conversation = [
      ...messages.slice(-10),
      { role: "user", content: text }
    ];

    setMessages(current => [...current, { role: "user", content: text }]);
    setDraft("");
    setError("");
    setIsSending(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversation })
      });
      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error("The assistant returned an invalid response. Check that the backend is running.");
      }

      if (!response.ok) {
        throw new Error(result.error || "The assistant could not respond.");
      }

      if (typeof result.reply !== "string" || !result.reply.trim()) {
        throw new Error("The assistant returned an empty response. Please try again.");
      }

      setMessages(current => [
        ...current,
        { role: "assistant", content: result.reply.trim() }
      ]);
    } catch (requestError) {
      setMessages(current => current.slice(0, -1));
      setDraft(text);
      setError(
        requestError instanceof TypeError
          ? "Couldn't reach the assistant. Check that the backend is running, then try again."
          : requestError.message
      );
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  }

  function handleSuggestion(text) {
    setDraft(text);
    inputRef.current?.focus();
  }

  return (
    <aside className="ai-assistant">
      {isOpen && (
        <section
          className="ai-chat-panel"
          id="ai-chat-panel"
          role="dialog"
          aria-label="MediBook AI health assistant"
          aria-modal="false"
        >
          <header className="ai-chat-header">
            <div className="ai-avatar" aria-hidden="true">M</div>
            <div className="ai-chat-heading">
              <strong>MediBook Assistant</strong>
              <span><i /> Here to help</span>
            </div>
            <button
              className="ai-close-button"
              type="button"
              aria-label="Close assistant"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>
          </header>

          <div className="ai-chat-messages" aria-live="polite">
            <p className="ai-message ai-message-assistant">
              Hi! I can help with general health questions and finding care.
              I can&apos;t diagnose conditions or prescribe medication.
            </p>
            {messages.map((message, index) => (
              <p
                className={`ai-message ai-message-${message.role}`}
                key={`${message.role}-${index}`}
              >
                {message.content}
              </p>
            ))}
            {isSending && (
              <p className="ai-message ai-message-assistant" role="status">
                Thinking…
              </p>
            )}
            {error && <p className="ai-chat-error" role="alert">{error}</p>}
            {messages.length === 0 && !isSending && (
              <div className="ai-suggestions">
                {suggestions.map(suggestion => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestion(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <p className="ai-disclaimer">
            Not for emergencies. If you may be in immediate danger, contact your
            local emergency service. Avoid sharing personal or sensitive details.
          </p>

          <form className="ai-chat-form" onSubmit={sendMessage}>
            <label className="sr-only" htmlFor="ai-chat-input">Your message</label>
            <textarea
              id="ai-chat-input"
              ref={inputRef}
              rows="1"
              maxLength="2000"
              placeholder="Ask a general health question…"
              value={draft}
              onChange={event => setDraft(event.target.value)}
              onKeyDown={event => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
            />
            <button
              className="ai-send-button"
              type="submit"
              aria-label="Send message"
              disabled={!draft.trim() || isSending}
            >
              {isSending ? "…" : "↑"}
            </button>
          </form>
        </section>
      )}

      <button
        className="ai-launcher"
        type="button"
        aria-expanded={isOpen}
        aria-controls="ai-chat-panel"
        onClick={() => setIsOpen(open => !open)}
      >
        <span aria-hidden="true">{isOpen ? "×" : "✦"}</span>
        {isOpen ? "Close assistant" : "AI Assistant"}
      </button>
    </aside>
  );
}
