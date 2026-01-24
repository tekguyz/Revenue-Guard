
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Check } from 'lucide-react';

interface BriefingSchedulerProps {
  selectedTime?: string;
  onSelect: (time: string) => void;
}

export const BriefingScheduler: React.FC<BriefingSchedulerProps> = ({ selectedTime, onSelect }) => {
  const [activeDay, setActiveDay] = useState(0);

  // Generate the next 3 business days
  const days = Array.from({ length: 3 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    if (d.getDay() === 0) d.setDate(d.getDate() + 2); // Skip Sunday
    if (d.getDay() === 6) d.setDate(d.getDate() + 2); // Skip Saturday
    return d;
  });

  const timeSlots = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {days.map((day, i) => (
          <button
            key={i}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); // Explicitly block event bubble to form
              setActiveDay(i);
            }}
            className={`flex-shrink-0 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
              activeDay === i 
                ? 'bg-brand text-white border-brand shadow-lg shadow-brand/20' 
                : 'bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:border-brand/50'
            }`}
          >
            <div className="text-[10px] uppercase opacity-70 mb-0.5">
              {day.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {timeSlots.map((slot) => {
          const fullTime = `${days[activeDay].toDateString()} at ${slot}`;
          const isSelected = selectedTime === fullTime;

          return (
            <button
              key={slot}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // Explicitly block event bubble to form
                onSelect(fullTime);
              }}
              className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${
                isSelected 
                  ? 'border-accent bg-accent/5 ring-1 ring-accent text-accent' 
                  : 'border-light-border dark:border-dark-border bg-white/50 dark:bg-dark-card/50 text-light-text dark:text-dark-text hover:border-accent/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-accent' : 'opacity-40'}`} />
                {slot}
              </div>
              {isSelected && <Check className="w-4 h-4" />}
            </button>
          );
        })}
      </div>
      
      <p className="text-[10px] font-mono text-center text-light-muted dark:text-dark-muted uppercase tracking-tighter opacity-50">
        Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
      </p>
    </div>
  );
};
