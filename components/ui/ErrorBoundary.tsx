
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Fixed class definition to ensure property inference and explicitly using React.Component
export class ErrorBoundary extends React.Component<Props, State> {
  // Added constructor to ensure props are correctly passed to the base component and state is initialized
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('System Critical Error:', error, errorInfo);
  }

  private handleReset = () => {
    // Clear localStorage to reset persistent states
    localStorage.removeItem('revenue-guard-lead');
    localStorage.removeItem('revenue-guard-interaction');
    localStorage.removeItem('revenue-guard-ui');
    window.location.reload();
  };

  public render() {
    // Destructuring state and props to resolve potential 'this' context issues and improve compiler type awareness
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#161618] border border-red-900/50 rounded-xl p-8 shadow-2xl relative overflow-hidden">
            {/* Glow Effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-[shimmer_2s_infinite]"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-2">Critical Sync Interrupted</h1>
              <p className="text-gray-400 mb-8">
                The Intelligence Core encountered an unrecoverable state. A system reset is required to restore protocol integrity.
              </p>

              {/* Progress Bar Animation */}
              <div className="w-full bg-gray-800 h-1.5 rounded-full mb-8 overflow-hidden">
                <div className="h-full bg-red-600 w-2/3 animate-[progress_1s_ease-in-out_infinite_alternate]"></div>
              </div>

              <Button 
                onClick={this.handleReset} 
                className="w-full bg-red-900/50 hover:bg-red-800 text-red-100 border border-red-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset System Protocol
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}
