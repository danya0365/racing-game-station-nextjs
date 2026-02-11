/**
 * ChatWidget
 * 
 * Floating chat bubble + expandable chat panel
 * Bottom-right corner, visible only to admin users
 * 
 * Features:
 * - Floating bubble with animation
 * - Expandable panel with glassmorphism
 * - Full-screen on mobile, panel on desktop
 * - Chat header with gradient
 * - Auto-scroll to latest message
 * - Input bar with send button
 */

'use client';

import { useAuthStore } from '@/src/presentation/stores/auth-store';
import { useChatStore } from '@/src/presentation/stores/useChatStore';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { ChatMessageBubble } from './ChatMessageBubble';

export function ChatWidget() {
  const {
    messages,
    isOpen,
    isLoading,
    toggleChat,
    closeChat,
    sendMessage,
  } = useChatStore();

  const { isAuthenticated } = useAuthStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');
    sendMessage(text);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Only show for authenticated users (API routes enforce admin-only access)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Chat Panel */}
      <div
        className={`
          fixed z-50 transition-all duration-300 ease-out
          ${isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
          }
          /* Mobile: full screen */
          bottom-0 left-0 right-0 top-0
          /* Desktop: panel */
          md:top-auto md:left-auto
          md:bottom-24 md:right-6
          md:w-[400px] md:h-[560px]
          md:rounded-2xl md:overflow-hidden
          md:shadow-2xl md:shadow-black/30
        `}
      >
        <div className="flex flex-col h-full backdrop-blur-xl bg-gray-900/95 md:rounded-2xl border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg">
                🎮
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Racing Game Station</div>
                <div className="text-white/60 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
                  ออนไลน์
                </div>
              </div>
            </div>
            <button
              onClick={closeChat}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white cursor-pointer"
              aria-label="ปิดแชท"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {messages.map(msg => (
              <ChatMessageBubble key={msg.id} message={msg} />
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="px-4 py-3 border-t border-white/10 bg-gray-900/50 shrink-0">
            <div className="flex items-center gap-2">
              {/* Menu Button */}
              <button
                onClick={() => sendMessage('เมนู')}
                disabled={isLoading}
                className="
                  w-10 h-10 flex items-center justify-center
                  bg-white/5 border border-white/10
                  hover:bg-indigo-500/20 hover:border-indigo-500/40
                  rounded-xl text-gray-300 hover:text-indigo-400
                  disabled:opacity-30 disabled:cursor-not-allowed
                  active:scale-95 transition-all duration-200
                  shrink-0 cursor-pointer
                "
                aria-label="เมนู"
                title="เมนู"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              </button>

              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="พิมพ์ข้อความ..."
                maxLength={500}
                disabled={isLoading}
                className="
                  flex-1 bg-white/5 border border-white/10
                  text-white text-sm placeholder-gray-500
                  px-4 py-2.5 rounded-xl
                  focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30
                  disabled:opacity-50
                  transition-colors
                "
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="
                  w-10 h-10 flex items-center justify-center
                  bg-indigo-600 hover:bg-indigo-500
                  rounded-xl text-white
                  disabled:opacity-30 disabled:cursor-not-allowed
                  active:scale-95 transition-all duration-200
                  shrink-0 cursor-pointer
                "
                aria-label="ส่งข้อความ"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bubble */}
      <button
        onClick={toggleChat}
        className={`
          fixed bottom-6 right-6 z-50
          w-14 h-14 rounded-full
          bg-gradient-to-br from-indigo-600 to-purple-600
          shadow-lg shadow-indigo-500/30
          flex items-center justify-center
          hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105
          active:scale-95
          transition-all duration-300
          cursor-pointer
          ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}
        `}
        aria-label="เปิดแชท"
      >
        <span className="text-2xl">💬</span>
      </button>
    </>
  );
}
