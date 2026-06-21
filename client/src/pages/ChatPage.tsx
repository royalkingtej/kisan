import React, { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_QUESTIONS = [
  "Best fertilizer for wheat crop?",
  "How to control aphids organically?",
  "When to sow rice in Maharashtra?",
  "PM-KISAN scheme eligibility?",
];

function MarkdownText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**")
          ? <strong key={i}>{p.slice(2, -2)}</strong>
          : <span key={i}>{p}</span>
      )}
    </span>
  );
}

export default function ChatPage({ user }: { user: any }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Jai Kisan! 🌾 I'm your AI farming assistant.\n\nI can help you with:\n• **Crop diseases** and treatment\n• **Fertilizer** recommendations\n• **Weather-based** farming advice\n• **Government schemes** for farmers\n• **Pest management** and organic solutions\n\nWhat would you like to know today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [conversationId, setConversationId] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamText]);

  async function sendMessage(content: string) {
    if (!content.trim() || streaming) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content }]);
    setStreaming(true);
    setStreamText("");

    const res = await fetch("/api/chat/general", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, conversationId }),
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let acc = "";
    let newConvId = conversationId;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const lines = decoder.decode(value).split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const d = JSON.parse(line.slice(6));
            if (d.conversationId && !newConvId) {
              newConvId = d.conversationId;
              setConversationId(d.conversationId);
            }
            if (d.content) { acc += d.content; setStreamText(acc); }
            if (d.done) {
              setMessages((prev) => [...prev, { role: "assistant", content: acc }]);
              setStreamText("");
              setStreaming(false);
            }
          } catch {}
        }
      }
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f5f7f5" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-end" }}>
            {m.role === "assistant" && (
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1a4d2e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                🌾
              </div>
            )}
            <div style={{
              maxWidth: "80%", padding: "12px 16px",
              borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: m.role === "user" ? "#1a4d2e" : "white",
              color: m.role === "user" ? "white" : "#222",
              fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}>
              {m.content.split("\n").map((line, li) => (
                <div key={li}><MarkdownText text={line} /></div>
              ))}
            </div>
          </div>
        ))}

        {streaming && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1a4d2e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌾</div>
            <div style={{ maxWidth: "80%", padding: "12px 16px", borderRadius: "18px 18px 18px 4px", background: "white", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
              {streamText ? (
                <>
                  {streamText.split("\n").map((line, li) => <div key={li}><MarkdownText text={line} /></div>)}
                  <span style={{ opacity: 0.4 }}>▌</span>
                </>
              ) : (
                <span style={{ color: "#aaa" }}>Thinking...</span>
              )}
            </div>
          </div>
        )}

        {messages.length === 1 && !streaming && (
          <div style={{ padding: "10px 0" }}>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 10, textAlign: "center" }}>Quick questions:</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {QUICK_QUESTIONS.map((q) => (
                <button key={q} onClick={() => sendMessage(q)} style={{
                  padding: "10px 12px", borderRadius: 12, border: "1.5px solid #c8e6c9",
                  background: "#f0faf4", color: "#1a4d2e", fontSize: 12, fontWeight: 600,
                  cursor: "pointer", textAlign: "left", lineHeight: 1.4,
                }}>{q}</button>
              ))}
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div style={{ padding: "8px 12px 12px", background: "white", borderTop: "1px solid #eee" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about farming..."
            disabled={streaming}
            style={{
              flex: 1, padding: "13px 16px", borderRadius: 24, border: "1.5px solid #ddd",
              fontSize: 14, outline: "none", background: "#fafafa", fontFamily: "inherit",
            }}
          />
          <button type="submit" disabled={!input.trim() || streaming} style={{
            width: 46, height: 46, borderRadius: "50%", border: "none",
            background: input.trim() && !streaming ? "#1a4d2e" : "#ddd",
            color: "white", fontSize: 18, cursor: input.trim() && !streaming ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>➤</button>
        </form>
      </div>
    </div>
  );
}
