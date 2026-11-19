"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, ChevronDown } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const SHOW_AI_CHAT = false;

export function FloatingWidgets() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! Welcome to JANKS Tailoring. How can I help you today? Whether it's bespoke suits, shirts, or alterations — I'm happy to assist.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [exchangeCount, setExchangeCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chatOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chatOpen]);

  useEffect(() => {
    if (chatOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const newCount = exchangeCount + 1;
    setExchangeCount(newCount);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.filter((m) => m.role !== "assistant" || updatedMessages.indexOf(m) > 0),
        }),
      });

      const data = await res.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.message || "I'm sorry, I couldn't process that. Please contact us directly on WhatsApp.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong. Please reach us on WhatsApp at +44 7828 338172.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* WhatsApp Button */}
      <a
        href="https://wa.me/447828338172"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[45] w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#20bd5a] transition-all duration-300 hover:scale-110"
        aria-label="Chat on WhatsApp"
        style={{ bottom: SHOW_AI_CHAT && chatOpen ? "calc(420px + 1.5rem + 3.5rem + 0.75rem)" : "1.5rem" }}
      >
        <WhatsAppIcon />
      </a>

      {/* AI Chat Widget */}
      {SHOW_AI_CHAT && (
      <div
        className="fixed bottom-6 right-6 z-[45] flex flex-col"
        style={{ width: "360px" }}
      >
        {/* Chat Window */}
        {chatOpen && (
          <div
            className="mb-3 flex flex-col bg-white shadow-2xl border border-charcoal/10 overflow-hidden"
            style={{ height: "420px", borderRadius: "2px" }}
          >
            {/* Header */}
            <div className="bg-charcoal px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
                  <span className="text-gold text-xs font-cinzel font-semibold">J</span>
                </div>
                <div>
                  <p className="text-cream text-sm font-medium tracking-wide">JANKS Assistant</p>
                  <p className="text-cream/40 text-[10px] tracking-[0.1em] uppercase">Bespoke Tailoring</p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-cream/50 hover:text-cream transition-colors"
              >
                <ChevronDown size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#FAF9F7]">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] px-3 py-2 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-charcoal text-cream"
                        : "bg-white border border-charcoal/10 text-charcoal"
                    }`}
                    style={{ borderRadius: "2px" }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div
                    className="bg-white border border-charcoal/10 px-3 py-2"
                    style={{ borderRadius: "2px" }}
                  >
                    <div className="flex gap-1 items-center h-4">
                      <span className="w-1.5 h-1.5 bg-charcoal/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-charcoal/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-charcoal/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* WhatsApp nudge after 2 exchanges */}
            {exchangeCount >= 2 && (
              <div className="px-4 py-2 bg-[#f0fdf4] border-t border-[#25D366]/20 shrink-0">
                <a
                  href="https://wa.me/447828338172"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[11px] tracking-[0.1em] uppercase text-[#16a34a] hover:text-[#15803d] transition-colors"
                >
                  <WhatsAppIcon />
                  Continue on WhatsApp →
                </a>
              </div>
            )}

            {/* Input */}
            <div className="px-3 py-3 border-t border-charcoal/10 bg-white flex items-center gap-2 shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about our services..."
                className="flex-1 text-sm text-charcoal placeholder-charcoal/30 bg-transparent outline-none"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="w-8 h-8 bg-charcoal text-cream flex items-center justify-center disabled:opacity-40 hover:bg-charcoal/80 transition-colors shrink-0"
                style={{ borderRadius: "1px" }}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="self-end w-14 h-14 bg-charcoal text-cream rounded-full flex items-center justify-center shadow-lg hover:bg-charcoal/80 transition-all duration-300 hover:scale-110"
          aria-label={chatOpen ? "Close chat" : "Open chat"}
        >
          {chatOpen ? <X size={20} /> : <MessageCircle size={20} />}
        </button>
      </div>
      )}
    </>
  );
}
