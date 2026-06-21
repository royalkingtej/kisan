import React, { useState, useRef, useEffect } from "react";

interface ScanResult {
  diseaseName: string;
  confidence: number;
  severity: string;
  affectedCrop: string;
  symptoms: string;
  treatment: string;
  prevention: string;
  scanId: number;
  conversationId: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SEV_COLOR: Record<string, string> = {
  Mild: "#4caf50",
  Moderate: "#ff9800",
  Severe: "#f44336",
  Critical: "#9c27b0",
};

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

export default function DiseaseDetectionPage({ user }: { user: any }) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [tab, setTab] = useState<"detect" | "chat">("detect");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamText]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setImagePreview(dataUrl);
      setImageBase64(dataUrl.split(",")[1]);
      setResult(null);
      setMessages([]);
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setImagePreview(dataUrl);
      setImageBase64(dataUrl.split(",")[1]);
      setResult(null);
      setMessages([]);
    };
    reader.readAsDataURL(file);
  }

  async function detectDisease() {
    if (!imageBase64) return;
    setDetecting(true);
    setResult(null);
    try {
      const res = await fetch("/api/disease/detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, userId: user?.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      setMessages([{
        role: "assistant",
        content: `I've analyzed your crop image and detected **${data.diseaseName}** on **${data.affectedCrop}** with **${data.confidence}% confidence**.\n\n**Severity:** ${data.severity}\n\n**Symptoms:** ${data.symptoms}\n\n**Treatment:**\n${data.treatment}\n\n**Prevention:**\n${data.prevention}\n\nFeel free to ask me any questions about this disease!`,
      }]);
      setTab("chat");
    } catch (err: any) {
      alert("Detection failed: " + err.message);
    } finally {
      setDetecting(false);
    }
  }

  async function sendChat(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim() || streaming || !result) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setStreaming(true);
    setStreamText("");

    const scanContext = `Disease: ${result.diseaseName}, Crop: ${result.affectedCrop}, Severity: ${result.severity}`;
    const res = await fetch(`/api/disease/chat/${result.conversationId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: userMsg, scanContext }),
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let acc = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const lines = decoder.decode(value).split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const d = JSON.parse(line.slice(6));
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

  const sevColor = result ? SEV_COLOR[result.severity] || "#888" : "#888";

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", borderBottom: "1px solid #e0e0e0", background: "white", flexShrink: 0 }}>
        {[{ id: "detect", label: "🔬 Detect Disease" }, { id: "chat", label: "💬 Treatment Chat" }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id as any)} style={{
            flex: 1, padding: "14px", border: "none", background: "none", cursor: "pointer",
            fontWeight: tab === t.id ? 700 : 400,
            color: tab === t.id ? "#1a4d2e" : "#888",
            borderBottom: tab === t.id ? "3px solid #1a4d2e" : "3px solid transparent",
            fontSize: 14, transition: "all 0.2s",
          }}>{t.label}</button>
        ))}
      </div>

      {tab === "detect" && (
        <div style={{ padding: 20, overflowY: "auto", flex: 1 }}>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: "2px dashed #a5d6a7", borderRadius: 16, padding: 30, textAlign: "center",
              cursor: "pointer", background: imagePreview ? "none" : "#f0faf4",
              position: "relative", marginBottom: 20, minHeight: 180,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            }}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="crop" style={{ maxWidth: "100%", maxHeight: 240, borderRadius: 12, objectFit: "cover" }} />
            ) : (
              <>
                <div style={{ fontSize: 40, marginBottom: 10 }}>📸</div>
                <div style={{ fontWeight: 700, color: "#1a4d2e", fontSize: 15 }}>Upload Crop Photo</div>
                <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>Tap or drag & drop an image</div>
                <div style={{ color: "#aaa", fontSize: 12, marginTop: 6 }}>JPG, PNG supported</div>
              </>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleImageChange} />
          </div>

          {imagePreview && (
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <button onClick={() => fileInputRef.current?.click()} style={{
                flex: 1, padding: "12px", borderRadius: 12, border: "1.5px solid #ccc",
                background: "white", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#333",
              }}>🔄 Change Photo</button>
              <button onClick={detectDisease} disabled={detecting} style={{
                flex: 2, padding: "12px", borderRadius: 12, border: "none",
                background: detecting ? "#ccc" : "#1a4d2e", color: "white",
                cursor: detecting ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 700,
              }}>
                {detecting ? "🔍 Analyzing..." : "🔬 Detect Disease"}
              </button>
            </div>
          )}

          {detecting && (
            <div style={{ textAlign: "center", padding: 30 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🧬</div>
              <div style={{ fontWeight: 700, color: "#333", fontSize: 15 }}>Analyzing your crop...</div>
              <div style={{ color: "#888", fontSize: 13, marginTop: 6 }}>AI is examining the image for diseases</div>
              <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 6 }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: 10, height: 10, borderRadius: "50%", background: "#1a4d2e",
                    animation: `bounce 1s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
              <style>{`@keyframes bounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }`}</style>
            </div>
          )}

          {result && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "white", borderRadius: 16, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#888", marginBottom: 2 }}>Detected Disease</div>
                    <div style={{ fontWeight: 800, fontSize: 17, color: "#1a1a1a" }}>{result.diseaseName}</div>
                    <div style={{ fontSize: 13, color: "#555", marginTop: 2 }}>on {result.affectedCrop}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ background: sevColor, color: "white", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>
                      {result.severity}
                    </div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 6 }}>{result.confidence}% confidence</div>
                  </div>
                </div>
                <div style={{ background: "#f5f5f5", borderRadius: 10, height: 8, overflow: "hidden" }}>
                  <div style={{ width: `${result.confidence}%`, height: "100%", background: sevColor, borderRadius: 10, transition: "width 1s" }} />
                </div>
              </div>

              {[
                { label: "🔍 Symptoms", text: result.symptoms, bg: "#fff8e1", border: "#ffe082" },
                { label: "💊 Treatment", text: result.treatment, bg: "#e8f5e9", border: "#a5d6a7" },
                { label: "🛡️ Prevention", text: result.prevention, bg: "#e3f2fd", border: "#90caf9" },
              ].map(({ label, text, bg, border }) => (
                <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#333", marginBottom: 8 }}>{label}</div>
                  <div style={{ fontSize: 13, color: "#444", lineHeight: 1.7, whiteSpace: "pre-line" }}>{text}</div>
                </div>
              ))}

              <button onClick={() => setTab("chat")} style={{
                width: "100%", padding: "14px", borderRadius: 14, border: "none",
                background: "#1a4d2e", color: "white", fontWeight: 700, fontSize: 15, cursor: "pointer",
              }}>
                💬 Ask About Treatment →
              </button>
            </div>
          )}

          {!imagePreview && !detecting && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#333", marginBottom: 12 }}>Common Diseases We Detect</div>
              {[
                { icon: "🍅", name: "Tomato Blight", desc: "Early/Late blight, leaf spots" },
                { icon: "🌾", name: "Wheat Rust", desc: "Stem, leaf & stripe rust" },
                { icon: "🌽", name: "Corn Smut", desc: "Fungal disease causing galls" },
                { icon: "🥔", name: "Potato Scab", desc: "Bacterial & common scab" },
              ].map((d) => (
                <div key={d.name} style={{
                  background: "white", borderRadius: 12, padding: "12px 14px", marginBottom: 8,
                  display: "flex", alignItems: "center", gap: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}>
                  <span style={{ fontSize: 24 }}>{d.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "#222" }}>{d.name}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{d.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "chat" && (
        <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
          {!result && (
            <div style={{ padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🔬</div>
              <div style={{ fontWeight: 700, color: "#333", fontSize: 15 }}>Detect a disease first</div>
              <div style={{ color: "#888", fontSize: 13, marginTop: 6 }}>Upload a crop photo and run detection to start chatting</div>
              <button onClick={() => setTab("detect")} style={{
                marginTop: 16, padding: "12px 24px", borderRadius: 12, border: "none",
                background: "#1a4d2e", color: "white", fontWeight: 700, cursor: "pointer",
              }}>Go to Detection →</button>
            </div>
          )}
          {result && (
            <>
              <div style={{ padding: "10px 16px", background: "#f0faf4", borderBottom: "1px solid #c8e6c9", flexShrink: 0 }}>
                <span style={{ fontSize: 13, color: "#1a4d2e" }}>
                  🌿 <strong>{result.diseaseName}</strong> on {result.affectedCrop} — {result.confidence}% confidence
                </span>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                    <div style={{
                      maxWidth: "85%", padding: "12px 16px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
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
                {streaming && streamText && (
                  <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <div style={{
                      maxWidth: "85%", padding: "12px 16px", borderRadius: "18px 18px 18px 4px",
                      background: "white", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                    }}>
                      {streamText.split("\n").map((line, li) => <div key={li}><MarkdownText text={line} /></div>)}
                      <span style={{ opacity: 0.4 }}>▌</span>
                    </div>
                  </div>
                )}
                {streaming && !streamText && (
                  <div style={{ display: "flex" }}>
                    <div style={{ padding: "12px 16px", background: "white", borderRadius: "18px 18px 18px 4px", color: "#888", fontSize: 13 }}>
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={sendChat} style={{ padding: 12, borderTop: "1px solid #eee", background: "white", display: "flex", gap: 10 }}>
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about treatment, prevention, dosage..."
                  disabled={streaming}
                  style={{
                    flex: 1, padding: "12px 16px", borderRadius: 24, border: "1.5px solid #ddd",
                    fontSize: 14, outline: "none", background: "#fafafa",
                  }}
                />
                <button type="submit" disabled={!chatInput.trim() || streaming} style={{
                  padding: "12px 18px", borderRadius: 24, border: "none",
                  background: chatInput.trim() && !streaming ? "#1a4d2e" : "#ddd",
                  color: chatInput.trim() && !streaming ? "white" : "#aaa",
                  fontWeight: 700, cursor: chatInput.trim() && !streaming ? "pointer" : "not-allowed",
                }}>➤</button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
