import React, { useRef, useEffect } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface ChatInputProps {
  inputValue: string;
  setInputValue: (val: string) => void;
  onSend: () => void;
  isLoading: boolean;
  isSyncing: boolean;
  qualificationScore: number;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  setInputValue,
  onSend,
  isLoading,
  isSyncing,
  qualificationScore
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputBorderRef = useRef<HTMLDivElement>(null);

  // Pulse Animation Effect when Qualification Score >= 7
  useEffect(() => {
    if (qualificationScore >= 7 && inputBorderRef.current) {
      const element = inputBorderRef.current;
      const animation = element.animate(
        [
          { transform: 'scale(1)', borderColor: 'rgba(53, 0, 211, 0.3)' },
          { transform: 'scale(1.02)', borderColor: '#3500D3' },
          { transform: 'scale(1)', borderColor: 'rgba(53, 0, 211, 0.3)' }
        ],
        {
          duration: 2000,
          iterations: Infinity,
          easing: 'ease-in-out'
        }
      );
      return () => animation.cancel();
    }
  }, [qualificationScore]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <section className="relative flex-shrink-0" aria-label="Message Input">
      <div 
        ref={inputBorderRef}
        className="relative flex items-center bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-lg transition-all duration-300 glass-panel"
      >
        <div className="pl-4" aria-hidden="true">
          <Sparkles className={`w-5 h-5 ${qualificationScore >= 7 ? 'text-accent' : 'text-light-muted dark:text-dark-muted'}`} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your current workflow challenge..."
          disabled={isLoading || isSyncing}
          className="w-full bg-transparent border-none focus:ring-0 px-4 py-4 text-light-text dark:text-dark-text placeholder-light-muted dark:placeholder-dark-muted font-medium disabled:opacity-50 text-base"
          aria-label="Type your message"
        />
        <div className="pr-2">
          <Button 
            size="sm" 
            onClick={onSend} 
            disabled={!inputValue.trim() || isLoading || isSyncing}
            className={!inputValue.trim() ? 'opacity-50' : ''}
            aria-label="Send Message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};