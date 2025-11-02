import React from 'react';
import { FormData, ServiceFrequency, YardSize } from '../types';
import { FREQUENCY_OPTIONS, YARD_SIZE_OPTIONS, PRICING, INITIAL_CLEANUP_FEE } from '../constants';

interface QuoteFormProps {
  formData: FormData;
  onFormChange: (newFormData: Partial<FormData>) => void;
  onReset: () => void;
}

const MinusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
  </svg>
);

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
  </svg>
);

const QuoteForm: React.FC<QuoteFormProps> = ({ formData, onFormChange, onReset }) => {

  const handleDogChange = (change: number) => {
    const maxDogs = PRICING[formData.frequency].maxDogs;
    const newNumDogs = formData.numDogs + change;
    if (newNumDogs >= 1 && newNumDogs <= maxDogs) {
      onFormChange({ numDogs: newNumDogs });
    }
  };
  
  const maxDogsForCurrentFrequency = PRICING[formData.frequency].maxDogs;

  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      {/* Number of Dogs */}
      <div>
        <label id="numDogs-label" className="block text-lg font-semibold text-slate-800 mb-2">
          1. How many dogs do you have?
        </label>
        <div className="relative mt-2 flex items-center gap-4">
           <button
            type="button"
            onClick={() => handleDogChange(-1)}
            disabled={formData.numDogs <= 1}
            aria-label="Decrease number of dogs"
            className="p-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6CFF83] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <MinusIcon className="w-6 h-6" />
          </button>
          
          <span 
            className="text-2xl font-bold text-slate-900 w-12 text-center tabular-nums" 
            aria-live="polite" 
            aria-labelledby="numDogs-label"
          >
            {formData.numDogs}
          </span>
          
          <button
            type="button"
            onClick={() => handleDogChange(1)}
            disabled={formData.numDogs >= maxDogsForCurrentFrequency}
            aria-label="Increase number of dogs"
            className="p-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6CFF83] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <PlusIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Yard Size */}
      <div>
        <h3 className="block text-lg font-semibold text-slate-800 mb-3">
          2. What is your yard size?
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {YARD_SIZE_OPTIONS.map(option => (
            <label key={option.value} className={`relative block p-3 border rounded-lg cursor-pointer transition-all text-center ${formData.yardSize === option.value ? 'bg-green-50 border-[#6CFF83] ring-2 ring-[#6CFF83]' : 'bg-white border-slate-300 hover:border-slate-400'}`}>
              <input
                type="radio"
                name="yardSize"
                value={option.value}
                checked={formData.yardSize === option.value}
                onChange={() => onFormChange({ yardSize: option.value as YardSize })}
                className="sr-only"
              />
              <span className="block font-semibold text-slate-800">{option.label}</span>
              <span className="block text-sm text-slate-500">{option.description}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Service Frequency */}
      <div>
        <h3 className="block text-lg font-semibold text-slate-800 mb-3">
          3. How often would you like service?
        </h3>
        <div className="space-y-3">
          {FREQUENCY_OPTIONS.map(option => {
            const pricingInfo = PRICING[option.value as ServiceFrequency];
            const isDisabled = formData.numDogs > pricingInfo.maxDogs;

            return (
              <label key={option.value} className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${formData.frequency === option.value ? 'bg-green-50 border-[#6CFF83] ring-2 ring-[#6CFF83]' : 'bg-white border-slate-300 hover:border-slate-400'} ${isDisabled ? 'opacity-50 bg-slate-100 cursor-not-allowed' : ''}`}>
                  <input
                    type="radio"
                    name="frequency"
                    value={option.value}
                    checked={formData.frequency === option.value}
                    onChange={() => onFormChange({ frequency: option.value as ServiceFrequency })}
                    className="sr-only"
                    disabled={isDisabled}
                  />
                  <span className="font-semibold text-slate-800">{option.label}</span>
                  {isDisabled && <span className="ml-auto text-sm text-slate-500 text-right">Max {pricingInfo.maxDogs} dogs</span>}
              </label>
            )
          })}
        </div>
      </div>
      
      {/* Initial Cleanup */}
       {formData.frequency !== ServiceFrequency.ONE_TIME && (
        <div>
          <label className="flex items-center space-x-3 cursor-pointer p-3 -m-3 rounded-lg hover:bg-slate-50">
            <input
              type="checkbox"
              name="initialCleanup"
              checked={formData.initialCleanup}
              onChange={(e) => onFormChange({ initialCleanup: e.target.checked })}
              className="h-5 w-5 rounded border-gray-300 text-[#6CFF83] focus:ring-[#6CFF83]"
            />
            <span className="text-slate-700 font-medium">
              Add first-time heavy duty cleanup?
              <span className="font-semibold text-slate-600 ml-1">
                  (+{INITIAL_CLEANUP_FEE.toLocaleString('en-US', { style: 'currency', currency: 'USD' })})
              </span>
              <span className="block text-sm text-slate-500">Select if it has been a while since the last scoop.</span>
            </span>
          </label>
        </div>
       )}
        <div className="pt-4 text-center">
            <button
                type="button"
                onClick={onReset}
                className="text-sm font-semibold text-slate-600 hover:text-slate-800 underline transition-colors"
            >
                Start Over
            </button>
        </div>

    </form>
  );
};

export default QuoteForm;