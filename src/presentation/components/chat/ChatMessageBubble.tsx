/**
 * ChatMessageBubble
 * 
 * Renders a single chat message bubble
 * Supports: text, menu (with quick replies), and card (with rows)
 */

'use client';

import { ChatMessage } from '@/src/domain/types/chatTypes';
import { QuickReplyButtons } from './QuickReplyButtons';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end mb-3">
        <div className="max-w-[80%] bg-indigo-600 text-white px-4 py-2.5 rounded-2xl rounded-br-md shadow-lg text-sm">
          {message.content}
        </div>
      </div>
    );
  }

  const response = message.response;
  if (!response) {
    return (
      <div className="flex justify-start mb-3">
        <div className="max-w-[85%] bg-white/5 border border-white/10 text-gray-200 px-4 py-2.5 rounded-2xl rounded-bl-md shadow-lg text-sm">
          {message.content}
        </div>
      </div>
    );
  }

  // Text response
  if (response.type === 'text') {
    return (
      <div className="flex justify-start mb-3">
        <div className="max-w-[85%] bg-white/5 border border-white/10 text-gray-200 px-4 py-2.5 rounded-2xl rounded-bl-md shadow-lg text-sm whitespace-pre-line">
          {response.text}
        </div>
      </div>
    );
  }

  // Menu response
  if (response.type === 'menu') {
    return (
      <div className="flex justify-start mb-3">
        <div className="max-w-[85%]">
          <div className="bg-white/5 border border-white/10 text-gray-200 px-4 py-2.5 rounded-2xl rounded-bl-md shadow-lg text-sm whitespace-pre-line">
            {response.text}
          </div>
          {response.quickReplies && response.quickReplies.length > 0 && (
            <QuickReplyButtons replies={response.quickReplies} />
          )}
        </div>
      </div>
    );
  }

  // Card response
  if (response.type === 'card') {
    return (
      <div className="flex justify-start mb-3">
        <div className="max-w-[90%] w-full">
          <div className="overflow-hidden rounded-2xl rounded-bl-md shadow-lg border border-white/10">
            {/* Card Header */}
            <div
              className="px-4 py-3"
              style={{ backgroundColor: response.headerColor ?? '#6366F1' }}
            >
              <div className="text-white font-semibold text-sm">
                {response.title}
              </div>
              {response.subtitle && (
                <div className="text-white/70 text-xs mt-0.5">
                  {response.subtitle}
                </div>
              )}
            </div>

            {/* Card Body */}
            <div className="bg-white/5 px-4 py-3 space-y-1.5">
              {response.rows?.map((row, index) => {
                if (row.type === 'separator') {
                  return (
                    <div key={index} className="border-t border-white/10 my-2" />
                  );
                }

                if (row.bold && !row.value) {
                  // Section header
                  return (
                    <div key={index} className="text-gray-200 font-semibold text-xs pt-1">
                      {row.label}
                    </div>
                  );
                }

                return (
                  <div key={index} className="flex justify-between items-center text-xs gap-2">
                    <span className={`text-gray-400 ${row.bold ? 'font-semibold text-gray-200' : ''}`}>
                      {row.label}
                    </span>
                    {row.value && (
                      <span
                        className={`text-right ${row.bold ? 'font-semibold' : ''}`}
                        style={{ color: row.valueColor ?? '#d1d5db' }}
                      >
                        {row.value}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
