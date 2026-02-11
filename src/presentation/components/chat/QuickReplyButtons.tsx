/**
 * QuickReplyButtons
 * 
 * Horizontal scrollable quick reply buttons
 * Used in ChatMessageBubble for menu-type responses
 */

'use client';

import { useChatStore } from '@/src/presentation/stores/useChatStore';

interface QuickReplyItem {
  label: string;
  action?: string;
  data?: Record<string, string>;
}

interface QuickReplyButtonsProps {
  replies: (string | QuickReplyItem)[];
}

export function QuickReplyButtons({ replies }: QuickReplyButtonsProps) {
  const { sendMessage, sendAction, isLoading } = useChatStore();

  const handleClick = (reply: string | QuickReplyItem) => {
    if (isLoading) return;

    if (typeof reply === 'string') {
      sendMessage(reply);
    } else if (reply.action) {
      sendAction(reply.action, reply.data);
    } else {
      sendMessage(reply.label);
    }
  };

  return (
    <div className="flex gap-2 flex-wrap pt-2">
      {replies.map((reply, index) => {
        const label = typeof reply === 'string' ? reply : reply.label;
        return (
          <button
            key={index}
            onClick={() => handleClick(reply)}
            disabled={isLoading}
            className="
              text-xs px-3 py-1.5 rounded-full
              bg-indigo-500/10 text-indigo-400
              border border-indigo-500/20
              hover:bg-indigo-500/20 hover:border-indigo-500/40
              active:scale-95
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              whitespace-nowrap cursor-pointer
            "
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
