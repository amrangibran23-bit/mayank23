
import React from 'react';

interface StepperProps {
  currentStep: number;
}

const steps = ['Upload', 'Analyze', 'Customize', 'Confirm'];

const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  return (
    <div className="w-full px-4 sm:px-0">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-gray-200 dark:bg-gray-600">
          <div
            className="absolute h-full bg-blue-500 transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep;
          return (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                  isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                {stepNumber}
              </div>
              <p className={`mt-2 text-sm font-medium ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                {step}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
