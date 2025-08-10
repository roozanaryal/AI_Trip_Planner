"use client";
import React, { useEffect, useRef, useState } from "react";
import { FiArrowLeft, FiSend, FiSmile } from "react-icons/fi";
import { AiOutlineRobot } from "react-icons/ai";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI travel assistant. How can I help you plan your trip?",
      sender: 'ai'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const listEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("/api/aimodel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: data.text || "Sorry, I couldn't process that request.",
          sender: 'ai',
        },
      ]);
      // Optionally: use data.ui to control UI state if needed
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: e?.message || 'An error occurred while contacting the AI.',
          sender: 'ai',
        },
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background max-w-full">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-border bg-card">
        <button className="p-2 rounded-full hover:bg-accent transition-colors">
          <FiArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="ml-3">
          <h2 className="text-lg font-semibold text-foreground">AI Trip Planner</h2>
          <p className="text-sm text-muted-foreground">Ask me anything about travel</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 overflow-x-hidden">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} w-full max-w-full animate-in slide-in-from-bottom-1 duration-200`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl p-4 ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-none'
                  : 'bg-card border border-border rounded-bl-none shadow-sm'
              }`}
            >
              {message.sender === 'ai' && (
                <div className="flex items-center mb-1">
                  <AiOutlineRobot className="w-4 h-4 text-primary mr-1" />
                  <span className="text-xs font-medium text-muted-foreground">AI Assistant</span>
                </div>
              )}
              <p className="whitespace-pre-wrap break-words">{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={listEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card p-4">
        <div className="flex items-end gap-2">
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <FiSmile className="w-5 h-5" />
          </button>
          <div className="relative flex-1 mx-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full p-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none overflow-hidden bg-background text-foreground"
              rows={1}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2">
          AI Trip Planner may produce inaccurate information about places, dates, and facts
        </p>
      </div>
    </div>
  );
}

export default ChatBox;
