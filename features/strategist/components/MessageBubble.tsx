import React, { useRef, useEffect } from 'react';
import { Bot, User } from 'lucide-react';
import { MessageRole } from '../../../types';
import { useTechMotion } from '../../../components/animations/useTechMotion';
import { MarkdownRenderer } from '../../../components/ui/MarkdownRenderer';

interface MessageBubbleProps {
  message: { role: MessageRole; content: string };
  index: number;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const isStrategist = message.role === 'strategist';
  const { strategistEntry } = useTechMotion();

  useEffect(() => {
    if (bubbleRef.current) {
      strategistEntry(bubbleRef.current);
    }
  }, [strategistEntry]);

  return (
    <article 
      ref={bubbleRef}
      className={`flex w-full ${isStrategist ? 'justify-start' : 'justify-end'} opacity-0`}
      aria-label={isStrategist ? "Strategist Message" : "Your Message"}
    >
      <div className={`flex max-w-[90%] md:max-w-[85%] gap-3 ${isStrategist ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div 
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
            isStrategist 
              ? 'bg-accent/10 dark:bg-accent-light/10' 
              : 'bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border'
          }`}
          aria-hidden="true"
        >
          {isStrategist ? (
            <Bot className="w-5 h-5 text-accent dark:text-accent-light" />
          ) : (
            <User className="w-5 h-5 text-light-muted dark:text-dark-muted" />
          )}
        </div>

        {/* Bubble */}
        <div className={`
          relative px-5 py-4 text-sm leading-relaxed shadow-sm
          ${isStrategist 
            ? 'bg-accent dark:bg-accent-light text-white dark:text-black rounded-lg rounded-bl-none prose prose-invert prose-p:text-white dark:prose-p:text-black prose-headings:text-white dark:prose-headings:text-black prose-strong:text-white dark:prose-strong:text-black prose-code:text-white dark:prose-code:text-black' 
            : 'bg-white dark:bg-dark-card text-light-text dark:text-dark-text border border-light-border dark:border-dark-border rounded-lg rounded-br-none'}
        `}>
          {isStrategist ? (
            <MarkdownRenderer content={message.content} />
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
      </div>
    </article>
  );
};