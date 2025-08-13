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
      text: "Hello! I'm your AI travel assistant. I can help you plan your trip by asking questions about your destination, travel dates, budget, and interests. What would you like to do?",
      sender: 'ai'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const listEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (retryCount = 0) => {
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second
    
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
      console.log("Sending request to AI API with messages:", [...messages, userMessage]);
      
      const response = await fetch("/api/aimodel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      console.log("API Response status:", response.status);
      console.log("API Response headers:", [...response.headers.entries()]);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error response body:", errorText);
        
        // Check if we should retry on rate limit
        if (response.status === 429 && retryCount < maxRetries) {
          const retryAfter = response.headers.get('Retry-After');
          const delay = retryAfter ? parseInt(retryAfter) * 1000 : baseDelay * Math.pow(2, retryCount);
          
          console.log(`Rate limit detected. Retrying in ${delay}ms`);
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, delay));
          
          // Remove the user message we added since we're retrying
          setMessages(prev => prev.slice(0, -1));
          
          // Retry the request
          return handleSend(retryCount + 1);
        }
        
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log("API Response data:", data);

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: data.resp || "Sorry, I couldn't process that request. Please try again.",
          sender: 'ai',
        },
      ]);
      // Optionally: use data.ui to control UI state if needed
    } catch (e: any) {
      console.error("Client-side error:", e);
      let errorMessage = e?.message || 'An error occurred while contacting the AI.';
      
      // Handle rate limit errors specifically
      if ((e?.status === 429 || (e?.message && e.message.includes('rate limit'))) && retryCount < maxRetries) {
        const retryAfter = e?.retryAfter || 60;
        const delay = retryAfter * 1000;
        
        console.log(`Rate limit error detected. Retrying in ${delay}ms`);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Remove the user message we added since we're retrying
        setMessages(prev => prev.slice(0, -1));
        
        // Retry the request
        return handleSend(retryCount + 1);
      } else if (e?.status === 429 || (e?.message && e.message.includes('rate limit'))) {
        errorMessage = `Rate limit exceeded. Please wait a moment and try again.`;
      }
      
      console.error("Displaying error to user:", errorMessage);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: errorMessage,
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
    <div className="flex flex-col h-full bg-background max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-border bg-card flex-shrink-0">
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
      <div className="border-t border-border bg-card p-4 flex-shrink-0">
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
            onClick={() => handleSend()}
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
