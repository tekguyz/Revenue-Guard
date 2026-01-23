import React, { useRef } from 'react';
import { useTerminalReveal } from '../../components/animations/useTerminalReveal';
import { LayoutDashboard, TrendingUp, Users, DollarSign, Lock } from 'lucide-react';
import { useLeadStore } from '../../store/leadStore';
import { CommandCenter } from './CommandCenter';
import { Button } from '../../components/ui/Button';
import { useUIStore } from '../../store/uiStore';

export const DashboardView: React.FC = () => {
    const { auditComplete } = useLeadStore();
    const { setView } = useUIStore();
    const headerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    
    useTerminalReveal(headerRef, { delay: 0 });
    useTerminalReveal(gridRef, { delay: 200 });

    // If audit is complete, show the ROI Command Center
    if (auditComplete) {
        return <CommandCenter />;
    }

    // Default "Pre-Audit" Dashboard View
    const stats = [
        { label: "Pipeline Value", value: "$--", icon: <DollarSign className="w-5 h-5 text-gray-400" />, trend: "Pending" },
        { label: "Qualified Leads", value: "--", icon: <Users className="w-5 h-5 text-gray-400" />, trend: "Pending" },
        { label: "Conversion Rate", value: "--%", icon: <TrendingUp className="w-5 h-5 text-gray-400" />, trend: "Pending" },
    ];

  return (
    <div className="space-y-8 h-full flex flex-col justify-center items-center">
      <div ref={headerRef} className="opacity-0 text-center max-w-2xl">
        <div className="w-16 h-16 bg-light-bg dark:bg-dark-bg rounded-2xl flex items-center justify-center mx-auto mb-6 border border-light-border dark:border-dark-border shadow-inner">
            <Lock className="w-8 h-8 text-light-muted dark:text-dark-muted" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Executive Dashboard Locked</h1>
        <p className="text-light-muted dark:text-dark-muted mb-8 text-lg">
            Real-time revenue projections and efficiency models are generated after the Strategic Audit is complete.
        </p>
        <Button onClick={() => setView('strategist')} className="mx-auto">
            Begin Strategic Audit
        </Button>
      </div>

      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-0 w-full max-w-4xl opacity-50 blur-[2px] select-none pointer-events-none grayscale">
        {stats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-dark-card p-6 rounded-xl border border-light-border dark:border-dark-border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <span className="p-2 bg-light-bg dark:bg-dark-bg rounded-lg">{stat.icon}</span>
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{stat.trend}</span>
                </div>
                <div className="text-2xl font-bold mb-1 text-gray-300 dark:text-gray-600">{stat.value}</div>
                <div className="text-sm text-light-muted dark:text-dark-muted">{stat.label}</div>
            </div>
        ))}
      </div>
    </div>
  );
};