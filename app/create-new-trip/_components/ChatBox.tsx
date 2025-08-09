"use client";
import React, { useState } from "react";
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

  const handleSend = () => {
    if (input.trim() === '') return;
    
    // Add user message
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user'
    };
    
    setMessages([...messages, newUserMessage]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: "I'm working on finding the best travel options for you. Could you tell me your destination and travel dates?",
        sender: 'ai'
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-200 bg-white">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <FiArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="ml-4 text-lg font-semibold">AI Travel Assistant</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl p-4 ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-white border border-gray-200 rounded-bl-none'
              }`}
            >
              {message.sender === 'ai' && (
                <div className="flex items-center mb-1">
                  <AiOutlineRobot className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="text-xs font-medium text-gray-500">AI Assistant</span>
                </div>
              )}
              <p className="whitespace-pre-wrap">{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <FiSmile className="w-5 h-5" />
          </button>
          <div className="relative flex-1 mx-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2 text-blue-500 hover:text-blue-600 disabled:text-gray-400"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
        <button className="w-full mt-2 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Generate with AI
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
