// KaamDost - Job States Machine
export const JOB_STATES = {
  REQUESTED: 'REQUESTED',
  SEARCHING: 'SEARCHING',
  OFFERED: 'OFFERED',
  ACCEPTED: 'ACCEPTED',
  ARRIVING: 'ARRIVING',
  STARTED: 'STARTED',
  COMPLETED: 'COMPLETED',
  PAYMENT_CONFIRMED: 'PAYMENT_CONFIRMED',
  RATED: 'RATED',
  CANCELLED: 'CANCELLED'
};

export const STATUS_LABELS = {
  REQUESTED: { label: 'Finding Nearest Worker', color: '#ea580c', bg: '#fff7ed' },
  SEARCHING: { label: 'Dispatching Nearby', color: '#f59e0b', bg: '#fef3c7' },
  OFFERED: { label: 'Awaiting Partner Confirmation', color: '#3b82f6', bg: '#eff6ff' },
  ACCEPTED: { label: 'Partner Assigned', color: '#10b981', bg: '#ecfdf5' },
  ARRIVING: { label: 'Partner on the Way', color: '#06b6d4', bg: '#ecfeff' },
  STARTED: { label: 'Work in Progress', color: '#8b5cf6', bg: '#f5f3ff' },
  COMPLETED: { label: 'Work Completed', color: '#10b981', bg: '#ecfdf5' },
  PAYMENT_CONFIRMED: { label: 'Payment Successful', color: '#059669', bg: '#d1fae5' },
  RATED: { label: 'Closed & Rated', color: '#64748b', bg: '#f1f5f9' },
  CANCELLED: { label: 'Cancelled', color: '#ef4444', bg: '#fef2f2' }
};
