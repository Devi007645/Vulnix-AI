import { createActor } from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUIStore } from "@/store/ui";
import { useActor } from "@/hooks/useActor";
import { useNavigate } from "@tanstack/react-router";
import { Bot, Send, Settings, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const GREETING: Message = {
  id: "greeting",
  role: "assistant",
  content:
    "Hello! I'm Vulnix AI, your cybersecurity assistant. I can help you understand vulnerabilities, analyze threats, generate remediation plans, and answer any security questions. How can I help you today?",
  timestamp: new Date(),
};

const SUGGESTED_PROMPTS = [
  "Explain this vulnerability type",
  "Generate a remediation plan",
  "What is the OWASP Top 10?",
  "Help me understand XSS attacks",
];

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function AIAssistant() {
  const { isChatOpen, toggleChat } = useUIStore();
  const { actor, isFetching } = useActor(createActor);
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [keyConfigured, setKeyConfigured] = useState<boolean | null>(null);
  const [keyChecked, setKeyChecked] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check API key configuration
  useEffect(() => {
    if (!actor || isFetching || keyChecked) return;
    (actor as any).isGeminiKeyConfigured().then((configured: boolean) => {
      setKeyConfigured(configured);
      setKeyChecked(true);
    });
  }, [actor, isFetching, keyChecked]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isChatOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isChatOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isChatOpen]);

  // Mark messages as read when chat opens
  useEffect(() => {
    if (isChatOpen) setHasUnread(false);
  }, [isChatOpen]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping || !actor) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await actor.chat(text);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      if (!isChatOpen) setHasUnread(true);
    } catch {
      const errMsg: Message = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content:
          "I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, actor, isChatOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClearChat = async () => {
    if (!actor) return;
    await actor.clearChatHistory();
    setMessages([GREETING]);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const showSuggestions =
    messages.length === 1 && messages[0].id === "greeting";

  return (
    <>
      {/* Floating button */}
      <div
        className="fixed bottom-6 right-6 z-50"
        data-ocid="ai_assistant.toggle_button"
      >
        {/* Pulse ring */}
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{
            background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
            animationDuration: "2s",
          }}
        />
        <button
          type="button"
          onClick={toggleChat}
          aria-label={isChatOpen ? "Close AI Assistant" : "Open AI Assistant"}
          className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-smooth hover:scale-110 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
            boxShadow:
              "0 0 24px rgba(6,182,212,0.5), 0 4px 16px rgba(0,0,0,0.4)",
          }}
        >
          <Bot className="w-6 h-6 text-white" />
          {hasUnread && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-background" />
          )}
        </button>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            data-ocid="ai_assistant.dialog"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", damping: 26, stiffness: 380 }}
            className="fixed bottom-24 right-6 z-50 flex flex-col rounded-2xl overflow-hidden"
            style={{
              width: 380,
              height: 520,
              background: "rgba(12, 12, 12, 0.92)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderTop: "2px solid #06b6d4",
              boxShadow:
                "0 0 40px rgba(6,182,212,0.15), 0 24px 48px rgba(0,0,0,0.6)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-2.5 px-4 py-3 shrink-0 border-b"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                }}
              >
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  Vulnix AI Assistant
                </p>
                <span
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
                  style={{
                    background: "rgba(139,92,246,0.2)",
                    border: "1px solid rgba(139,92,246,0.35)",
                    color: "#a78bfa",
                  }}
                >
                  Powered by Gemini
                </span>
              </div>
              <button
                type="button"
                onClick={handleClearChat}
                data-ocid="ai_assistant.clear_button"
                className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth"
                aria-label="Clear chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={toggleChat}
                data-ocid="ai_assistant.close_button"
                className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth"
                aria-label="Close assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Key not configured */}
            {keyChecked && keyConfigured === false ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(6,182,212,0.1)",
                    border: "1px solid rgba(6,182,212,0.25)",
                  }}
                >
                  <Settings className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    Gemini API Key Required
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Set your Gemini API key in Settings to activate the AI
                    assistant
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  data-ocid="ai_assistant.go_to_settings_button"
                  onClick={() => {
                    toggleChat();
                    navigate({ to: "/app/settings" });
                  }}
                  className="bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 text-xs"
                  variant="outline"
                >
                  Go to Settings
                </Button>
              </div>
            ) : (
              <>
                {/* Messages area */}
                <div
                  className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-cyber"
                  data-ocid="ai_assistant.messages_list"
                >
                  {/* Suggested prompts */}
                  {showSuggestions && (
                    <div className="grid grid-cols-2 gap-1.5 mt-1 mb-2">
                      {SUGGESTED_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => handleSuggestedPrompt(prompt)}
                          data-ocid="ai_assistant.suggested_prompt"
                          className="text-left px-2.5 py-2 rounded-lg text-[11px] text-muted-foreground transition-smooth hover:text-foreground"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.07)",
                          }}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}

                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2 ${
                        msg.role === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                      data-ocid={`ai_assistant.message.${msg.role}`}
                    >
                      {msg.role === "assistant" && (
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{
                            background:
                              "linear-gradient(135deg, #06b6d4, #3b82f6)",
                          }}
                        >
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div
                        className={`flex flex-col gap-0.5 ${
                          msg.role === "user" ? "items-end" : "items-start"
                        } max-w-[80%]`}
                      >
                        <div
                          className={`px-3 py-2 text-[13px] leading-relaxed ${
                            msg.role === "user"
                              ? "rounded-2xl rounded-br-sm text-white"
                              : "rounded-2xl rounded-bl-sm text-gray-100"
                          }`}
                          style={
                            msg.role === "user"
                              ? {
                                  background:
                                    "linear-gradient(135deg, #06b6d4, #3b82f6)",
                                }
                              : {
                                  background: "rgba(255,255,255,0.06)",
                                  border: "1px solid rgba(255,255,255,0.08)",
                                }
                          }
                        >
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-muted-foreground px-1">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <div
                      className="flex gap-2 flex-row"
                      data-ocid="ai_assistant.loading_state"
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, #06b6d4, #3b82f6)",
                        }}
                      >
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                      <div
                        className="flex items-center gap-1 px-3 py-2.5 rounded-2xl rounded-bl-sm"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-primary/70"
                            animate={{ y: [0, -4, 0] }}
                            transition={{
                              duration: 0.8,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: i * 0.15,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <div
                  className="px-3 py-3 shrink-0 border-t"
                  style={{ borderColor: "rgba(255,255,255,0.08)" }}
                >
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      data-ocid="ai_assistant.input"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isTyping || !actor}
                      placeholder="Ask about any security topic..."
                      className="flex-1 h-9 bg-muted/30 border-border/40 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-primary/50"
                    />
                    <Button
                      type="button"
                      size="icon"
                      data-ocid="ai_assistant.send_button"
                      onClick={sendMessage}
                      disabled={isTyping || !input.trim() || !actor}
                      aria-label="Send message"
                      className="w-9 h-9 shrink-0 bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 disabled:opacity-40"
                      variant="outline"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
