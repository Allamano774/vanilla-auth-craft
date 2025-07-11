
-- Update the orders table to have better status management
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'pending';

-- Create a function to send WhatsApp notifications when orders are placed
CREATE OR REPLACE FUNCTION notify_admin_new_order()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert a notification record that can be picked up by an edge function
  INSERT INTO admin_notifications (
    type,
    order_id,
    message,
    created_at
  ) VALUES (
    'new_order',
    NEW.id,
    'New order placed: ' || NEW.service_name || ' - Quantity: ' || NEW.quantity || ' - Price: KES ' || NEW.price,
    now()
  );
  
  RETURN NEW;
END;
$$;

-- Create admin notifications table
CREATE TABLE IF NOT EXISTS admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  order_id uuid REFERENCES orders(id),
  message text NOT NULL,
  sent boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Create trigger to notify admin when new order is placed
CREATE TRIGGER on_order_created
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_new_order();

-- Enable RLS on admin_notifications table
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for admin notifications (only accessible by admin functions)
CREATE POLICY "Admin notifications policy" ON admin_notifications
  FOR ALL USING (false);
