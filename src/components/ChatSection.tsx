import { useState, useRef, useEffect, FormEvent } from "react";
import { motion } from "motion/react";
import { Send, Bot, User, Sparkles, MessageSquare } from "lucide-react";
import { Message } from "../hooks/useNeuralNetwork";
import Badge from "./ui/Badge";
import EmptyState from "./ui/EmptyState";

interface ChatSectionProps {
  onSendMessage: (text: string) => Promise<void>;
  messages: Message[];
  isModelTrained: boolean;
  isTyping?: boolean;
  onSelectSampleText: (text: string) => void;
}

const SAMPLE_INPUTS = [
  { text: "مرحبا، كيف حالك؟", label: "ترحيب" },
  { text: "احكي لي نكتة مضحكة", label: "نكتة" },
  { text: "ما هو اسمك؟", label: "من أنت" },
  { text: "شكرا جزيلا لك", label: "شكر" },
  { text: "مع السلامة", label: "وداع" },
];

export default function ChatSection({
  onSendMessage,
  messages,
  isModelTrained,
  isTyping = false,
  onSelectSampleText,
}: ChatSectionProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    setInput("");
    onSelectSampleText(text);
    await onSendMessage(text);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-surface-1)] border border-[var(--color-border-subtle)] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="border-b border-[var(--color-border-subtle)] px-4 py-3 bg-[var(--color-surface-2)]/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[var(--color-success)] border-2 border-[var(--color-surface-1)] rounded-full z-20" />
            <div className="w-9 h-9 bg-[var(--color-accent-glow)] border border-[var(--color-accent-border)] rounded-xl flex items-center justify-center text-[var(--color-accent)]">
              <Bot className="w-4.5 h-4.5" />
            </div>
          </div>
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
            المساعد الذكي
          </h2>
        </div>
        <Badge variant="accent" size="sm">
          {isModelTrained ? "نشط" : "ي chờ التدريب"}
        </Badge>
      </div>

      {/* Warning */}
      {!isModelTrained && (
        <div className="bg-amber-500/5 border-b border-amber-500/10 px-4 py-2 flex items-center gap-2 text-amber-400/90 text-xs">
          <span>يرجى تدريب النموذج أولاً</span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-3 min-h-[350px]" role="log" aria-live="polite" aria-label="رسائل المحادثة">
        {messages.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="w-6 h-6" />}
            title="ابدأ المحادثة"
            description="اكتب رسالة أو جرب الاستعلامات المقترحة"
          />
        ) : (
          messages.map((msg) => {
            const isBot = msg.role === "assistant";
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-2.5 max-w-[85%] ${
                  isBot ? "self-start" : "self-end flex-row-reverse"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isBot
                      ? "bg-[var(--color-accent-glow)] border border-[var(--color-accent-border)] text-[var(--color-accent)]"
                      : "bg-[var(--color-surface-3)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)]"
                  }`}
                >
                  {isBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>

                <div className="flex flex-col gap-1">
                  <div
                    className={`rounded-2xl px-3.5 py-2 text-xs leading-relaxed break-words ${
                      isBot
                        ? "bg-[var(--color-surface-3)] text-[var(--color-text-primary)] rounded-tl-md border border-[var(--color-border-subtle)]"
                        : "bg-[var(--color-accent)] text-[var(--color-surface-0)] rounded-tr-md"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {isBot && msg.tag && (
                    <div className="flex items-center gap-1.5 px-0.5 text-[9px] text-[var(--color-text-muted)]">
                      <Sparkles className="w-3 h-3 text-[var(--color-accent)]" />
                      <Badge variant="default" size="sm">
                        {msg.tag}
                      </Badge>
                      {msg.confidence !== undefined && (
                        <Badge
                          variant={
                            msg.confidence > 0.8
                              ? "success"
                              : msg.confidence > 0.5
                              ? "warning"
                              : "error"
                          }
                          size="sm"
                        >
                          {Math.round(msg.confidence * 100)}%
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}

        {isTyping && (
          <div className="flex gap-2.5 self-start">
            <div className="w-7 h-7 rounded-lg bg-[var(--color-accent-glow)] border border-[var(--color-accent-border)] text-[var(--color-accent)] flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="bg-[var(--color-surface-3)] border border-[var(--color-border-subtle)] rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2.5 border-t border-[var(--color-border-subtle)]">
        <div className="flex flex-wrap gap-1.5 justify-end">
          {SAMPLE_INPUTS.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setInput(sample.text)}
              className="text-[10px] bg-[var(--color-surface-3)] hover:bg-[var(--color-surface-4)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] px-2 py-1 rounded-lg transition-colors"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-[var(--color-border-subtle)] p-3 bg-[var(--color-surface-1)] flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
          className="flex-grow bg-[var(--color-surface-2)] text-[var(--color-text-primary)] text-sm border border-[var(--color-border-default)] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[var(--color-accent)]/50 focus:ring-1 focus:ring-[var(--color-accent)]/20 transition-all placeholder:text-[var(--color-text-muted)]"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          aria-label="إرسال الرسالة"
          className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
            input.trim()
              ? "bg-[var(--color-accent)] text-[var(--color-surface-0)] hover:bg-[var(--color-accent-dim)]"
              : "bg-[var(--color-surface-3)] text-[var(--color-text-muted)] cursor-not-allowed"
          }`}
        >
          <Send className="w-4 h-4 rotate-180" />
        </button>
      </form>
    </div>
  );
}
