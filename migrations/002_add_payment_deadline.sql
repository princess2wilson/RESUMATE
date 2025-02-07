
ALTER TABLE cv_reviews 
ADD COLUMN IF NOT EXISTS payment_deadline TEXT;
