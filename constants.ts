import { ServiceFrequency, YardSize } from './types';

// New pricing structure based on number of dogs and frequency
export const PRICING = {
  [ServiceFrequency.TWICE_A_WEEK]: {
    base: 12.85,
    perAdditionalDog: 2,
    maxDogs: 10, // A reasonable maximum
  },
  [ServiceFrequency.ONCE_A_WEEK]: {
    base: 13.85,
    perAdditionalDog: 2,
    maxDogs: 10,
  },
  [ServiceFrequency.EVERY_OTHER_WEEK]: {
    prices: {
      1: 21.85,
      2: 23.85,
      3: 28.85,
    },
    maxDogs: 3,
  },
  [ServiceFrequency.ONE_TIME]: {
    // Prices for one-time service were not specified, retaining old logic
    base: 75,
    perAdditionalDog: 5,
    maxDogs: 10,
  },
};

// Multiplier for yard size
export const YARD_SIZE_MULTIPLIER = {
  [YardSize.SMALL]: 1.0,
  [YardSize.MEDIUM]: 1.2,
  [YardSize.LARGE]: 1.5,
  [YardSize.EXTRA_LARGE]: 2.0,
};

// One-time fee for initial cleanup if needed
export const INITIAL_CLEANUP_FEE = 50;

// Average number of weeks in a month for monthly estimate
export const WEEKS_IN_MONTH = 4;

// Labels for form options
export const FREQUENCY_OPTIONS = [
  { value: ServiceFrequency.ONCE_A_WEEK, label: 'Once a Week' },
  { value: ServiceFrequency.TWICE_A_WEEK, label: 'Twice a Week' },
  { value: ServiceFrequency.EVERY_OTHER_WEEK, label: 'Every Other Week' },
  { value: ServiceFrequency.ONE_TIME, label: 'One-Time Cleanup' },
];

export const YARD_SIZE_OPTIONS = [
  { value: YardSize.SMALL, label: 'Small', description: '< 1/8 acre' },
  { value: YardSize.MEDIUM, label: 'Medium', description: '1/8-1/4 acre' },
  { value: YardSize.LARGE, label: 'Large', description: '1/4-1/2 acre' },
  { value: YardSize.EXTRA_LARGE, label: 'X-Large', description: '> 1/2 acre' },
];