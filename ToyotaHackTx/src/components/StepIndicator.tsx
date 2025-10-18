import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: 'Finances' },
    { number: 2, label: 'Lifestyle' },
    { number: 3, label: 'Results' },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10">
          <div
            className="h-full bg-red-600 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center flex-1">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                step.number < currentStep
                  ? 'bg-red-600 text-white'
                  : step.number === currentStep
                  ? 'bg-red-600 text-white ring-4 ring-red-200'
                  : 'bg-white border-2 border-gray-300 text-gray-400'
              }`}
            >
              {step.number < currentStep ? (
                <Check className="w-6 h-6" />
              ) : (
                <span>{step.number}</span>
              )}
            </div>
            <span
              className={`mt-2 ${
                step.number <= currentStep ? 'text-red-600' : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
