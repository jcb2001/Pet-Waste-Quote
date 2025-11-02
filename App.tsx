import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { FormData, Quote, ServiceFrequency, YardSize, BookingDetails } from './types';
import { 
  PRICING,
  YARD_SIZE_MULTIPLIER, 
  INITIAL_CLEANUP_FEE, 
  WEEKS_IN_MONTH,
  FREQUENCY_OPTIONS,
  YARD_SIZE_OPTIONS,
} from './constants';
import QuoteForm from './components/QuoteForm';
import QuoteDisplay from './components/QuoteDisplay';
import BookingModal from './components/BookingModal';


const initialFormData: FormData = {
  numDogs: 1,
  yardSize: YardSize.SMALL,
  frequency: ServiceFrequency.ONCE_A_WEEK,
  initialCleanup: false,
};

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingResult, setBookingResult] = useState<string | null>(null);

  const calculateQuote = useCallback(() => {
    let perVisitCost = 0;
    const { frequency, numDogs, yardSize } = formData;

    const pricingInfo = PRICING[frequency];

    if ('prices' in pricingInfo) {
      if (numDogs > pricingInfo.maxDogs) {
        setQuote(null);
        return;
      }
      perVisitCost = pricingInfo.prices[numDogs as keyof typeof pricingInfo.prices] ?? 0;
    } else if ('base' in pricingInfo) {
      perVisitCost = pricingInfo.base;
      if (numDogs > 1) {
        perVisitCost += (numDogs - 1) * pricingInfo.perAdditionalDog;
      }
    }
    
    const yardMultiplier = YARD_SIZE_MULTIPLIER[yardSize];
    perVisitCost *= yardMultiplier;
    
    let weeklyRate: number | null = null;
    let monthlyRate: number | null = null;

    if (formData.frequency !== ServiceFrequency.ONE_TIME) {
       switch (formData.frequency) {
        case ServiceFrequency.ONCE_A_WEEK:
          weeklyRate = perVisitCost;
          break;
        case ServiceFrequency.TWICE_A_WEEK:
          weeklyRate = perVisitCost * 2;
          break;
        case ServiceFrequency.EVERY_OTHER_WEEK:
          weeklyRate = perVisitCost / 2;
          break;
      }
      if (weeklyRate) {
        monthlyRate = weeklyRate * WEEKS_IN_MONTH;
      }
    }

    const newQuote: Quote = {
      perVisit: formData.frequency !== ServiceFrequency.ONE_TIME ? perVisitCost : null,
      totalOneTime: formData.frequency === ServiceFrequency.ONE_TIME ? perVisitCost : null,
      monthly: monthlyRate,
      initialCleanupFee: formData.initialCleanup ? INITIAL_CLEANUP_FEE : null,
      frequency: formData.frequency,
    };
    
    setQuote(newQuote);

  }, [formData]);

  useEffect(() => {
    calculateQuote();
  }, [calculateQuote]);

  const handleFormChange = (newFormData: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...newFormData }));
  };
  
  const handleReset = () => {
    setFormData(initialFormData);
  };
  
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
      setIsModalOpen(false);
      // Reset booking state after a short delay to allow the modal to animate out
      setTimeout(() => {
          setIsBooking(false);
          setBookingResult(null);
      }, 300);
  };

  const handleBookingSubmit = async (bookingDetails: BookingDetails) => {
    if (!quote) return;
    setIsBooking(true);
    setBookingResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const frequencyLabel = FREQUENCY_OPTIONS.find(opt => opt.value === formData.frequency)?.label;
      const yardSizeLabel = YARD_SIZE_OPTIONS.find(opt => opt.value === formData.yardSize)?.label;

      const prompt = `
        A new customer has requested pet waste removal service. Please format the following details into a professional confirmation summary for our internal records. The tone should be clear, concise, and professional.

        Customer Details:
        - Name: ${bookingDetails.firstName} ${bookingDetails.lastName}
        - Email: ${bookingDetails.email}
        - Phone: ${bookingDetails.phone}
        - Address: ${bookingDetails.address}, ${bookingDetails.city}, ${bookingDetails.state} ${bookingDetails.zip}

        Service Details:
        - Number of Dogs: ${formData.numDogs}
        - Yard Size: ${yardSizeLabel}
        - Service Frequency: ${frequencyLabel}
        - Initial Heavy-Duty Cleanup Required: ${formData.initialCleanup ? 'Yes' : 'No'}

        Quote Summary:
        - Per Visit: ${quote.perVisit ? quote.perVisit.toFixed(2) : 'N/A'}
        - Monthly Estimate: ${quote.monthly ? quote.monthly.toFixed(2) : 'N/A'}
        - One-Time Cleanup Cost: ${quote.totalOneTime ? quote.totalOneTime.toFixed(2) : 'N/A'}
        - Initial Cleanup Fee: ${quote.initialCleanupFee ? quote.initialCleanupFee.toFixed(2) : 'N/A'}

        Customer Notes:
        - ${bookingDetails.notes || 'No notes provided.'}

        Generate a summary that starts with "New Service Request Confirmation".
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setBookingResult(response.text);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setBookingResult("We're sorry, but there was an error processing your request. Please try again later.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans antialiased text-slate-800">
      <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-2xl">
        <main className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <QuoteForm formData={formData} onFormChange={handleFormChange} onReset={handleReset} />
          </div>
          {quote && (
            <QuoteDisplay quote={quote} onBookNow={handleOpenModal} />
          )}
        </main>
      </div>
      {quote && (
        <BookingModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleBookingSubmit}
          quote={quote}
          formData={formData}
          isLoading={isBooking}
          bookingResult={bookingResult}
        />
      )}
    </div>
  );
};

export default App;