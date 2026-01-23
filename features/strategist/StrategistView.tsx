import React, { useRef, useEffect, useState } from 'react';
import { useTerminalReveal } from '../../components/animations/useTerminalReveal';
import { useStrategist } from '../../hooks/useStrategist';
import { StrategicBriefForm } from '../assessment/StrategicBriefForm';
import { useInteractionStore } from '../../store/interactionStore';
// Added missing import for UI state management
import { useUIStore } from '../../store/uiStore';
import { TerminalLoader } from '../../components/ui/TerminalLoader';
import { ChatHeader } from './components/ChatHeader';
import { MessageBubble } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';

export const StrategistView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [inputValue, setInputValue] = useState('');
  
  const { 
    sendMessage, 
    isLoading, 
    isSyncing,
    messages, 
    qualificationScore 
  } = useStrategist();
  
  const { isTyping } = useInteractionStore();
  // Added setView from UI store to handle view transitions
  const { setView } = useUIStore();
  const showForm = qualificationScore >= 7;

  // Initial container reveal
  useTerminalReveal(containerRef, { delay: 100 });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isSyncing]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const text = inputValue;
    setInputValue('');
    await sendMessage(text);
  };

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto h-full flex gap-6 opacity-0 transition-all duration-500 relative py-4">
      
      {/* Loading Progress Bar */}
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-1 bg-transparent z-10 overflow-hidden">
          <div className="h-full bg-brand animate-[shimmer_2s_infinite] w-full origin-left"></div>
        </div>
      )}

      {/* Left Column: Chat Interface */}
      <section 
        className={`flex flex-col h-full min-h-0 transition-all duration-500 ease-in-out ${showForm ? 'w-full lg:w-1/2' : 'w-full max-w-4xl mx-auto'}`}
        aria-label="Chat Interface"
      >
          <ChatHeader isLoading={isLoading} qualificationScore={qualificationScore} />

          {/* Chat Area - Scrollable */}
          <div 
            className="flex-grow min-h-0 overflow-y-auto no-scrollbar space-y-6 p-4 rounded-2xl bg-white/80 border border-light-border mb-4 shadow-inner relative glass-panel"
            role="log"
            aria-live="polite"
          >
            {messages.map((msg, idx) => (
              <MessageBubble key={msg.timestamp + idx} message={msg} index={idx} />
            ))}
            
            {isTyping && (
              <div className="flex justify-start animate-pulse" aria-label="Strategist is typing">
                <div className="bg-accent text-white rounded-lg rounded-bl-none px-5 py-4 shadow-md flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            
            {/* Syncing Terminal Animation */}
            {isSyncing && (
                <div className="flex justify-center my-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
                    <TerminalLoader className="w-64 h-24" />
                </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input - Pinned */}
          <ChatInput 
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSend={handleSendMessage}
            isLoading={isLoading}
            isSyncing={isSyncing}
            qualificationScore={qualificationScore}
          />
      </section>

      {/* Right Column: Strategic Brief Form (Revealed when Qualified) */}
      {showForm && (
        <section 
          className="hidden lg:block lg:w-1/2 h-full min-h-0 animate-in slide-in-from-right duration-700 fade-in fill-mode-forwards"
          aria-label="Strategic Brief Form Desktop"
        >
          <StrategicBriefForm />
        </section>
      )}

      {/* Mobile Overlay for Form */}
      {showForm && (
          <dialog 
            className="lg:hidden fixed inset-0 z-50 bg-white w-full h-full animate-in slide-in-from-bottom duration-500 overflow-y-auto m-0 p-0"
            open
            aria-label="Strategic Brief Form Mobile"
          >
              <div className="p-4 h-full flex flex-col">
                  <header className="flex justify-between items-center mb-4 flex-shrink-0">
                      <h2 className="text-xl font-bold text-light-text">Strategic Brief</h2>
                      <button onClick={() => setView('strategist')} className="p-2 text-brand font-bold uppercase text-xs">Back to Chat</button>
                  </header>
                  <div className="flex-grow min-h-0">
                     <StrategicBriefForm />
                  </div>
              </div>
          </dialog>
      )}

    </div>
  );
};