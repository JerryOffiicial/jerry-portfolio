"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm Jerry's AI assistant. Ask me anything about Jerry's skills, projects, or experience!",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputText.trim(),
          history: messages.slice(-10), // Send last 10 messages for context
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", response.status, errorData);
        throw new Error(errorData.error || `Failed to get response (${response.status})`);
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble responding right now. Please try again later.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-4 sm:right-6 z-50 flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
          "backdrop-blur-xl border border-white/20 dark:border-white/10 hover:border-white/40 dark:hover:border-white/20",
          isOpen
            ? "bg-white/80 dark:bg-[#0A0A0A]/80 w-14 h-14 rounded-full rotate-90 text-[#0D1B2A] dark:text-white"
            : "bg-white/80 dark:bg-[#0A0A0A]/80 px-5 py-3.5 rounded-full text-[#0D1B2A] dark:text-white hover:-translate-y-1"
        )}
      >
        {isOpen ? (
          <X size={24} className="transition-transform duration-300 -rotate-90" />
        ) : (
          <>
            <MessageCircle size={24} className="text-[#1A73E8]" />
            <span className="font-secondary text-sm font-medium whitespace-nowrap block">Talk with AI</span>
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[600px] max-h-[calc(100vh-8rem)] rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.4)] border border-white/20 dark:border-white/10 bg-white/70 dark:bg-[#0A0A0A]/70 backdrop-blur-2xl overflow-hidden flex flex-col transition-all duration-500 origin-bottom-right">
          {/* Header */}
          <div className="bg-white/40 dark:bg-black/40 backdrop-blur-md border-b border-white/20 dark:border-white/10 p-5 flex items-center gap-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A73E8]/10 to-transparent" />
            <div className="w-10 h-10 rounded-full bg-[#1A73E8] flex items-center justify-center text-white shrink-0 relative z-10 shadow-lg">
              <Bot size={20} />
            </div>
            <div className="relative z-10">
              <h3 className="font-primary font-bold text-[#0D1B2A] dark:text-white text-lg tracking-tight">Jerry's AI</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-xs font-secondary text-[#0D1B2A]/60 dark:text-white/60">Online & ready to help</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 font-secondary scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2 max-w-[85%]",
                  message.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto flex-row"
                )}
              >
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm",
                  message.sender === "user"
                    ? "bg-[#1A73E8] text-white"
                    : "bg-white dark:bg-black/50 border border-white/20 dark:border-white/10 text-[#0D1B2A]/70 dark:text-white/70"
                )}>
                  {message.sender === "user" ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={cn(
                  "rounded-2xl px-4 py-3 text-[14px] leading-relaxed shadow-sm backdrop-blur-sm",
                  message.sender === "user"
                    ? "bg-[#1A73E8] text-white rounded-tr-sm"
                    : "bg-white/80 dark:bg-white/5 border border-white/20 dark:border-white/10 text-[#0D1B2A]/90 dark:text-white/90 rounded-tl-sm"
                )}>
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 mr-auto max-w-[85%]">
                <div className="w-7 h-7 rounded-full bg-white dark:bg-black/50 border border-white/20 dark:border-white/10 flex items-center justify-center shadow-sm mt-1">
                  <Bot size={14} className="text-[#0D1B2A]/70 dark:text-white/70" />
                </div>
                <div className="bg-white/80 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 text-sm shadow-sm backdrop-blur-sm">
                  <div className="flex gap-1.5 mt-1.5 mb-1.5 w-8">
                    <div className="w-1.5 h-1.5 bg-[#0D1B2A]/40 dark:bg-white/40 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-[#0D1B2A]/40 dark:bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <div className="w-1.5 h-1.5 bg-[#0D1B2A]/40 dark:bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-2" />
          </div>

          {/* Input */}
          <div className="bg-white/40 dark:bg-black/40 backdrop-blur-md border-t border-white/20 dark:border-white/10 p-4">
            <div className="flex gap-2 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about Jerry's skills, projects..."
                className="flex-1 pl-5 pr-12 py-3.5 rounded-2xl border border-white/40 dark:border-white/10 bg-white/50 dark:bg-black/50 text-[#0D1B2A] dark:text-white font-secondary text-sm focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/30 focus:border-[#1A73E8]/50 transition-all placeholder:text-[#0D1B2A]/40 dark:placeholder:text-white/40 shadow-inner"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className={cn(
                  "absolute right-1.5 top-1.5 bottom-1.5 aspect-square rounded-xl flex items-center justify-center transition-all duration-300",
                  inputText.trim() && !isLoading
                    ? "bg-[#1A73E8] hover:bg-[#1557B0] text-white shadow-md hover:scale-105"
                    : "bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                )}
              >
                <Send size={18} className={cn(inputText.trim() && !isLoading ? "ml-0.5" : "")} />
              </button>
            </div>
            <div className="text-center mt-3">
               <p className="text-[10px] text-[#0D1B2A]/40 dark:text-white/40 font-secondary uppercase tracking-wider">AI can make mistakes. Verify important info.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
