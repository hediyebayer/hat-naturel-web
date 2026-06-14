'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4;
}

export function StepIndicator({ currentStep }: StepIndicatorProps): React.ReactElement {
  const t = useTranslations('payment.steps');

  const steps = [
    { number: 1, label: t('info') },
    { number: 2, label: t('card') },
    { number: 3, label: t('verify') },
    { number: 4, label: t('result') },
  ] as const;

  return (
    <nav aria-label="Ödeme adımları" className="mb-8">
      <ol className="flex items-center justify-center gap-0">
        {steps.map((step, idx) => {
          const isDone = step.number < currentStep;
          const isActive = step.number === currentStep;
          const isFuture = step.number > currentStep;

          return (
            <li key={step.number} className="flex items-center">
              {/* Step circle + label */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.05, duration: 0.2 }}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                    isDone && 'bg-green-500 text-white',
                    isActive && 'bg-primary-600 text-white ring-2 ring-primary-300 ring-offset-1',
                    isFuture && 'bg-neutral-200 text-neutral-500',
                  )}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isDone ? <Check size={14} strokeWidth={3} /> : step.number}
                </motion.div>
                <span
                  className={cn(
                    'mt-1.5 hidden text-center text-xs font-medium leading-tight sm:block',
                    isDone && 'text-green-600',
                    isActive && 'text-primary-700',
                    isFuture && 'text-neutral-400',
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    'mx-2 h-0.5 w-10 flex-shrink-0 sm:w-16 transition-colors duration-300',
                    step.number < currentStep ? 'bg-green-400' : 'bg-neutral-200',
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
      {/* Mobile: active step label */}
      <p className="mt-2 text-center text-sm font-medium text-primary-700 sm:hidden">
        {steps[currentStep - 1]?.label}
      </p>
    </nav>
  );
}
