import React, { useState, useEffect } from 'react';
import { Quote, FormData, BookingDetails, ServiceFrequency } from '../types';
import { FREQUENCY_OPTIONS } from '../constants';
import Spinner from './Spinner';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: BookingDetails) => void;
  quote: Quote;
  formData: FormData;
  isLoading: boolean;
  bookingResult: string | null;
}

const formatCurrency = (amount: number | null) => {
  if (amount === null || isNaN(amount)) return 'N/A';
  return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SuccessIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onSubmit, quote, formData, isLoading, bookingResult }) => {
  const [details, setDetails] = useState<BookingDetails>({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', notes: '',
  });

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setDetails({
        firstName: '', lastName: '', email: '', phone: '',
        address: '', city: '', state: '', zip: '', notes: '',
      });
    }
  }, [isOpen]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(details);
  };

  if (!isOpen) return null;

  const frequencyLabel = FREQUENCY_OPTIONS.find(f => f.value === formData.frequency)?.label;
  const isOneTime = formData.frequency === ServiceFrequency.ONE_TIME;
  const displayPrice = isOneTime ? quote.totalOneTime : quote.monthly;
  
  const inputClasses = "block w-full rounded-lg border-2 border-transparent bg-slate-100 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#6CFF83] focus:outline-none focus:ring-0 transition-colors duration-200 sm:text-sm";
  const labelClasses = "block text-sm font-semibold text-slate-700 mb-1.5";


  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center p-12">
          <Spinner className="w-12 h-12 text-[#6CFF83] mx-auto" />
          <p className="mt-4 text-lg font-semibold text-slate-700">Processing your booking...</p>
          <p className="text-slate-500">Please wait a moment.</p>
        </div>
      );
    }

    if (bookingResult) {
      return (
        <div className="p-6 sm:p-8 text-center">
            <SuccessIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Request Sent!</h3>
            <p className="text-slate-600 mb-6">Thank you! We've received your request and will be in touch shortly to confirm.</p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left whitespace-pre-wrap text-sm text-slate-700 font-mono overflow-x-auto">
                {bookingResult}
            </div>
            <button
                onClick={onClose}
                className="mt-8 w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
                Done
            </button>
        </div>
      );
    }
    
    return (
       <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                <div>
                    <label htmlFor="firstName" className={labelClasses}>First Name</label>
                    <input type="text" id="firstName" name="firstName" onChange={handleChange} value={details.firstName} required className={inputClasses} />
                </div>
                 <div>
                    <label htmlFor="lastName" className={labelClasses}>Last Name</label>
                    <input type="text" id="lastName" name="lastName" onChange={handleChange} value={details.lastName} required className={inputClasses} />
                </div>
            </div>
            <div>
                 <label htmlFor="email" className={labelClasses}>Email Address</label>
                <input type="email" id="email" name="email" onChange={handleChange} value={details.email} required className={inputClasses} />
            </div>
            <div>
                 <label htmlFor="phone" className={labelClasses}>Phone Number</label>
                <input type="tel" id="phone" name="phone" onChange={handleChange} value={details.phone} required className={inputClasses} />
            </div>
             <div>
                 <label htmlFor="address" className={labelClasses}>Street Address</label>
                <input type="text" id="address" name="address" onChange={handleChange} value={details.address} required className={inputClasses} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-6">
                <div>
                    <label htmlFor="city" className={labelClasses}>City</label>
                    <input type="text" id="city" name="city" onChange={handleChange} value={details.city} required className={inputClasses} />
                </div>
                 <div>
                    <label htmlFor="state" className={labelClasses}>State</label>
                    <input type="text" id="state" name="state" onChange={handleChange} value={details.state} required className={inputClasses} />
                </div>
                 <div>
                    <label htmlFor="zip" className={labelClasses}>ZIP Code</label>
                    <input type="text" id="zip" name="zip" onChange={handleChange} value={details.zip} required className={inputClasses} />
                </div>
            </div>
            <div>
                <label htmlFor="notes" className={labelClasses}>Notes <span className="text-slate-500 font-medium">(optional)</span></label>
                <textarea id="notes" name="notes" placeholder="e.g., gate code, dog's name, etc." rows={3} onChange={handleChange} value={details.notes} className={inputClasses}></textarea>
            </div>
            <div className="pt-4">
                <button type="submit" className="w-full flex justify-center bg-[#6CFF83] hover:brightness-95 text-slate-900 font-bold text-lg py-3 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#6CFF83] focus:ring-opacity-50">
                    Confirm & Book Service
                </button>
                <button type="button" onClick={onClose} className="w-full text-center text-sm text-slate-600 hover:text-slate-800 mt-4 font-medium">
                    Cancel
                </button>
            </div>
       </form>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col transform transition-all duration-300 scale-100">
        <header className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 rounded-t-xl sticky top-0 z-10">
          <div className="flex justify-between items-center">
             <div>
                <h2 className="text-xl font-bold text-slate-800">Complete Your Booking</h2>
                <p className="text-sm text-slate-500 mt-1">{frequencyLabel}: <span className="font-semibold text-slate-700">{formatCurrency(displayPrice)} {isOneTime ? '' : 'est. / month'}</span></p>
             </div>
             <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6CFF83]" aria-label="Close">
                 <CloseIcon className="w-6 h-6"/>
             </button>
          </div>
        </header>
        <div className="overflow-y-auto">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;