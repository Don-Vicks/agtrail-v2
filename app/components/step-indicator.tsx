import type { ReactNode } from 'react'
import { cn } from '~/lib/utils'

interface Step {
  label: string
  icon?: ReactNode
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  className?: string
}

/**
 * Horizontal step indicator with connected lines.
 * Steps can be: completed (green filled), active (green outlined), or upcoming (gray).
 */
export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <div className={cn('flex items-center justify-center gap-0', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep
        const isLast = index === steps.length - 1

        return (
          <div key={step.label} className="flex items-center">
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'flex size-10 items-center justify-center rounded-full border-2 transition-colors',
                  isCompleted && 'border-brand bg-brand text-white',
                  isActive && 'border-brand bg-white text-brand',
                  !isCompleted && !isActive && 'border-gray-300 bg-white text-gray-400'
                )}
              >
                {isCompleted ? (
                  <svg className="size-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  step.icon ?? (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium',
                  isCompleted || isActive ? 'text-gray-900' : 'text-gray-400'
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting line */}
            {!isLast && (
              <div
                className={cn(
                  'mx-2 mb-5 h-0.5 w-12',
                  index < currentStep ? 'bg-brand' : 'bg-gray-200'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─── Numbered sub-step indicator ─── */

interface SubStep {
  label: string
}

interface SubStepIndicatorProps {
  steps: SubStep[]
  currentStep: number
  className?: string
}

/**
 * Numbered sub-step indicator (1 → 2 → 3 → 4) used inside the Verification step.
 */
export function SubStepIndicator({ steps, currentStep, className }: SubStepIndicatorProps) {
  return (
    <div className={cn('flex items-center justify-center gap-0', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep
        const isLast = index === steps.length - 1

        return (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-full text-xs font-bold transition-colors',
                  isCompleted && 'bg-brand text-white',
                  isActive && 'bg-brand text-white',
                  !isCompleted && !isActive && 'bg-gray-200 text-gray-500'
                )}
              >
                {isCompleted ? (
                  <svg className="size-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  'text-[11px] font-medium',
                  isCompleted || isActive ? 'text-gray-900' : 'text-gray-400'
                )}
              >
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div
                className={cn(
                  'mx-1.5 mb-5 h-0.5 w-8',
                  index < currentStep ? 'bg-brand' : 'bg-gray-200'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
