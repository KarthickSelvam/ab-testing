import { Check } from 'lucide-react'

interface StepperProps {
  steps: string[]
  currentStep: number
  onStepClick: (step: number) => void
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="flex items-center w-full justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center flex-1 last:flex-none">
          <div 
            className="flex flex-col items-center relative cursor-pointer"
            onClick={() => onStepClick(index)}
          >
            <div className="flex items-center justify-center">
              {index < currentStep ? (
                // Completed step
                <div className="w-6 h-6 rounded-full bg-[#16A34A] flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              ) : index === currentStep ? (
                // Current step
                <div className="w-6 h-6 rounded-full bg-[#3B82F6] flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              ) : (
                // Future step
                <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
              )}
            </div>
            <span className={`mt-2 text-sm ${
              index < currentStep ? 'text-[#16A34A]' : 
              index === currentStep ? 'text-[#3B82F6]' : 
              'text-gray-500'
            }`}>
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="flex-1 mx-4 flex items-center mb-[30px]">
              <div className={`h-[2px] w-full ${
                index < currentStep ? 'bg-[#16A34A]' :
                'border-t-2 border-dashed border-gray-300'
              }`} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

