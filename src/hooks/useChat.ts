import { useState, useCallback } from "react";
import { Message } from "./useNeuralNetwork";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const sendMessage = useCallback(
    async (
      text: string,
      predictFn: (text: string) => {
        reply: string;
        tag: string | null;
        confidence: number;
      }
    ) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMsg: Message = { role: "user", content: trimmed, id: Date.now() };
      addMessage(userMsg);
      setIsTyping(true);

      await new Promise((r) => setTimeout(r, 500));

      try {
        const result = predictFn(trimmed);
        const botMsg: Message = {
          role: "assistant",
          content: result.reply,
          tag: result.tag || undefined,
          confidence: result.confidence,
          id: Date.now() + 1,
        };
        addMessage(botMsg);
        return result;
      } catch {
        addMessage({ role: "assistant", content: "حدث خطأ في المعالجة.", id: Date.now() + 1 });
        return null;
      } finally {
        setIsTyping(false);
      }
    },
    [addMessage]
  );

  return { messages, isTyping, sendMessage, addMessage, clearMessages };
}
