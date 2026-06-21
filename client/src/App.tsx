import React, { useState, useEffect, useRef } from "react";

interface Conversation {
  id: number;
  title: string;
  createdAt: string;
}

interface Message {
  id: number;
  conversationId: number;
  role: string;
  content: string;
  createdAt: string;
}

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  async function fetchConversations() {
    const res = await fetch("/api/conversations");
    const data = await res.json();
    setConversations(data);
  }

  async function createConversation() {
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New Chat" }),
    });
    const convo = await res.json();
    setConversations((prev) => [convo, ...prev]);
    setActiveConversationId(convo.id);
    setMessages([]);
  }

  async function selectConversation(id: number) {
    setActiveConversationId(id);
    const res = await fetch(`/api/conversations/${id}`);
    const data = await res.json();
    setMessages(data.messages || []);
  }

  async function deleteConversation(e: React.MouseEvent, id: number) {
    e.stopPropagation();
    await fetch(`/api/conversations/${id}`, { method: "DELETE" });
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
      setMessages([]);
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !activeConversationId || isStreaming) return;

    const userContent = input.trim();
    setInput("");
    setIsStreaming(true);
    setStreamingContent("");

    const tempMsg: Message = {
      id: Date.now(),
      conversationId: activeConversationId,
      role: "user",
      content: userContent,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    const res = await fetch(`/api/conversations/${activeConversationId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: userContent }),
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value);
      const lines = text.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.content) {
              accumulated += data.content;
              setStreamingContent(accumulated);
            }
            if (data.done) {
              setMessages((prev) => [
                ...prev,
                {
                  id: Date.now() + 1,
                  conversationId: activeConversationId,
                  role: "assistant",
                  content: accumulated,
                  createdAt: new Date().toISOString(),
                },
              ]);
              setStreamingContent("");
              setIsStreaming(false);

              if (messages.length === 0 || (messages.length === 1 && messages[0].role === "user")) {
                const shortTitle = userContent.slice(0, 40);
                await fetch(`/api/conversations/${activeConversationId}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ title: shortTitle }),
                }).catch(() => {});
                fetchConversations();
              }
            }
          } catch {}
        }
      }
    }
  }

  const activeConvo = conversations.find((c) => c.id === activeConversationId);

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      <aside style={{
        width: 260,
        background: "#1a1a1a",
        borderRight: "1px solid #2a2a2a",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}>
        <div style={{ padding: "16px" }}>
          <button
            onClick={createConversation}
            style={{
              width: "100%",
              padding: "10px 14px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            + New Chat
          </button>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => selectConversation(c.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 16px",
                cursor: "pointer",
                background: c.id === activeConversationId ? "#2a2a2a" : "transparent",
                borderLeft: c.id === activeConversationId ? "3px solid #2563eb" : "3px solid transparent",
              }}
            >
              <span style={{
                fontSize: 13,
                color: c.id === activeConversationId ? "#e5e5e5" : "#888",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
              }}>
                {c.title}
              </span>
              <button
                onClick={(e) => deleteConversation(e, c.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#555",
                  cursor: "pointer",
                  fontSize: 16,
                  lineHeight: 1,
                  padding: "0 2px",
                  marginLeft: 4,
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div style={{ padding: "16px", borderTop: "1px solid #2a2a2a" }}>
          <p style={{ fontSize: 12, color: "#555", textAlign: "center" }}>Kisan AI Chat</p>
        </div>
      </aside>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {activeConversationId ? (
          <>
            <div style={{
              padding: "16px 24px",
              borderBottom: "1px solid #2a2a2a",
              background: "#1a1a1a",
            }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: "#e5e5e5" }}>
                {activeConvo?.title || "Chat"}
              </h2>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                    marginBottom: 16,
                  }}
                >
                  <div style={{
                    maxWidth: "70%",
                    padding: "12px 16px",
                    borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: msg.role === "user" ? "#2563eb" : "#2a2a2a",
                    color: "#e5e5e5",
                    fontSize: 14,
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {isStreaming && streamingContent && (
                <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 16 }}>
                  <div style={{
                    maxWidth: "70%",
                    padding: "12px 16px",
                    borderRadius: "18px 18px 18px 4px",
                    background: "#2a2a2a",
                    color: "#e5e5e5",
                    fontSize: 14,
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}>
                    {streamingContent}
                    <span style={{ opacity: 0.5, animation: "blink 1s infinite" }}>▌</span>
                  </div>
                </div>
              )}

              {isStreaming && !streamingContent && (
                <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 16 }}>
                  <div style={{
                    padding: "12px 16px",
                    borderRadius: "18px 18px 18px 4px",
                    background: "#2a2a2a",
                    color: "#888",
                    fontSize: 14,
                  }}>
                    Thinking...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={sendMessage}
              style={{
                padding: "16px 24px",
                borderTop: "1px solid #2a2a2a",
                background: "#1a1a1a",
                display: "flex",
                gap: 12,
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                disabled={isStreaming}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid #2a2a2a",
                  background: "#0f0f0f",
                  color: "#e5e5e5",
                  fontSize: 14,
                  outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                style={{
                  padding: "12px 20px",
                  borderRadius: 12,
                  border: "none",
                  background: input.trim() && !isStreaming ? "#2563eb" : "#2a2a2a",
                  color: input.trim() && !isStreaming ? "white" : "#555",
                  cursor: input.trim() && !isStreaming ? "pointer" : "not-allowed",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}>
            <div style={{ fontSize: 48 }}>🌾</div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#e5e5e5" }}>Kisan AI</h1>
            <p style={{ color: "#888", fontSize: 15 }}>Start a new conversation to begin chatting</p>
            <button
              onClick={createConversation}
              style={{
                padding: "12px 24px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 15,
                marginTop: 8,
              }}
            >
              Start New Chat
            </button>
          </div>
        )}
      </main>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}
