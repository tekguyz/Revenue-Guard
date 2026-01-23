
import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface FormNavigationProps {
  step: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({ 
  step, 
  totalSteps, 
  onBack, 
  onNext, 
  onSubmit, 
  isSubmitting 
}) => {
  return (
    <nav className="p-6 border-t border-light-border bg-light-bg/50 backdrop-blur-sm" aria-label="Form Navigation">
      <div className="flex justify-between items-center">
        {step > 1 ? (
          <Button type="button" variant="ghost" onClick={onBack} aria-label="Go to previous step">Back</Button>
        ) : (
          <div></div>
        )}
        
        {step < totalSteps ? (
          <Button type="button" onClick={onNext} aria-label="Go to next step">
            Continue <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button 
            type="button" 
            onClick={onSubmit} 
            disabled={isSubmitting} 
            aria-label="Submit Strategic Brief"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Syncing Vault...
              </>
            ) : (
              <>
                Initialize Sprint <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    </nav>
  );
};
