import React from 'react';
import { Quote, ServiceFrequency } from '../types';

interface QuoteDisplayProps {
  quote: Quote | null;
  onBookNow: () => void;
}

const formatCurrency = (amount: number | null) => {
  if (amount === null || isNaN(amount)) return '';
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, onBookNow }) => {
  if (!quote) {
    return null;
  }

  const isOneTime = quote.frequency === ServiceFrequency.ONE_TIME;
  const quoteKey = quote.monthly ?? quote.totalOneTime;

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-[#6CFF83] mb-4 text-center">Your Instant Quote</h2>
      
      <div key={quoteKey} className="text-center mb-6 animate-pulse-quick">
        {isOneTime ? (
          <>
            <p className="text-5xl font-bold tracking-tight">{formatCurrency(quote.totalOneTime)}</p>
            <p className="text-slate-300 mt-1">For a one-time cleanup</p>
          </>
        ) : (
          <>
            <p className="text-5xl font-bold tracking-tight">{formatCurrency(quote.monthly)}</p>
            <p className="text-slate-300 mt-1">Estimated per month</p>
            <p className="text-lg text-slate-200 mt-2">{formatCurrency(quote.perVisit)} / visit</p>
          </>
        )}
      </div>

      {quote.initialCleanupFee && (
        <div className="border-t border-slate-700 pt-4 mt-4 text-center">
          <p className="text-lg">
            + <span className="font-bold">{formatCurrency(quote.initialCleanupFee)}</span> for initial cleanup
          </p>
          <p className="text-sm text-slate-400">(One-time fee on your first bill)</p>
        </div>
      )}

      <div className="mt-8">
        <button
          onClick={onBookNow}
          className="w-full bg-[#6CFF83] hover:brightness-95 text-slate-900 font-bold text-lg py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-[#6CFF83] focus:ring-opacity-50"
        >
          Book Your Service Now
        </button>
        <p className="text-xs text-slate-400 mt-3 text-center">
          No contracts, cancel anytime.
        </p>
      </div>
    </div>
  );
};

export default QuoteDisplay;