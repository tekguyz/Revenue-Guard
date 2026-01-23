import React from 'react';
import { Database, Users, Cpu, MessageSquare, ClipboardCheck } from 'lucide-react';

interface StepBottlenecksProps {
  bottlenecks: string[];
  setBottlenecks: (bottlenecks: string[]) => void;
  error?: string;
}

export const StepBottlenecks: React.FC<StepBottlenecksProps> = ({ bottlenecks, setBottlenecks, error }) => {
  const options = [
    { id: "Manual Data Entry", label: "Data Fatigue", desc: "Teams manually porting data between isolated systems.", icon: <Database className="w-4 h-4" /> },
    { id: "Meeting Overload", label: "Sync Paralysis", desc: "Too many status meetings, not enough execution.", icon: <Users className="w-4 h-4" /> },
    { id: "Legacy Tech Debt", label: "Architecture Rot", desc: "Outdated software slowing down modern workflows.", icon: <Cpu className="w-4 h-4" /> },
    { id: "Communication Silos", label: "Shadow Ops", desc: "Crucial info lost in emails and fragmented chats.", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "Approval Delays", label: "Red Tape Loop", desc: "Bottlenecks waiting on senior sign-offs.", icon: <ClipboardCheck className="w-4 h-4" /> }
  ];

  const toggleOption = (id: string) => {
    if (bottlenecks.includes(id)) {
      setBottlenecks(bottlenecks.filter(x => x !== id));
    } else {
      setBottlenecks([...bottlenecks, id]);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">Operational Friction</h2>
        <p className="text-light-muted dark:text-dark-muted">Where is your team bleeding most of their time?</p>
      </header>
      
      <div className="space-y-2" role="group" aria-label="Select Bottlenecks">
        {options.map((opt) => {
          const isSelected = bottlenecks.includes(opt.id);
          return (
            <button 
              key={opt.id} 
              type="button"
              onClick={() => toggleOption(opt.id)}
              className={`flex items-start text-left w-full p-4 rounded-xl border transition-all duration-200 group ${
                isSelected 
                  ? 'border-brand bg-brand/5 dark:bg-brand-light/5 ring-1 ring-brand' 
                  : 'border-light-border dark:border-dark-border hover:border-brand/30 bg-white/50 dark:bg-dark-card/50'
              }`}
            >
              <div className={`mt-1 p-2 rounded-lg transition-colors ${isSelected ? 'bg-brand text-white' : 'bg-black/5 dark:bg-white/5 text-light-muted dark:text-dark-muted group-hover:text-brand'}`}>
                {opt.icon}
              </div>
              <div className="ml-4 flex-grow">
                <div className="font-bold text-light-text dark:text-dark-text text-sm">{opt.label}</div>
                <div className="text-[10px] text-light-muted dark:text-dark-muted leading-tight mt-0.5">{opt.desc}</div>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'border-brand bg-brand' : 'border-light-border dark:border-dark-border'}`}>
                {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
              </div>
            </button>
          );
        })}
      </div>
      {error && <p className="text-red-500 text-xs mt-2 font-mono uppercase" role="alert">{error}</p>}
    </div>
  );
};