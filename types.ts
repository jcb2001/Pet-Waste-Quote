export enum ServiceFrequency {
  ONCE_A_WEEK = 'ONCE_A_WEEK',
  TWICE_A_WEEK = 'TWICE_A_WEEK',
  EVERY_OTHER_WEEK = 'EVERY_OTHER_WEEK',
  ONE_TIME = 'ONE_TIME',
}

export enum YardSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  EXTRA_LARGE = 'EXTRA_LARGE',
}

export interface FormData {
  numDogs: number;
  yardSize: YardSize;
  frequency: ServiceFrequency;
  initialCleanup: boolean;
}

export interface Quote {
  perVisit: number | null;
  totalOneTime: number | null;
  monthly: number | null;
  initialCleanupFee: number | null;
  frequency: ServiceFrequency;
}

export interface BookingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  notes: string;
}