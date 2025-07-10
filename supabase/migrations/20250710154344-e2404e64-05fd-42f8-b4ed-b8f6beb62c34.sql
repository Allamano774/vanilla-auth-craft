
-- Add transaction_reference column to deposits table
ALTER TABLE public.deposits 
ADD COLUMN transaction_reference TEXT;

-- Create an index for faster lookups by transaction reference
CREATE INDEX idx_deposits_transaction_reference ON public.deposits(transaction_reference);
