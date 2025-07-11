
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  message: string;
  orderId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('WhatsApp notification function called');

    // Get pending notifications
    const { data: notifications, error } = await supabaseClient
      .from('admin_notifications')
      .select('*')
      .eq('sent', false)
      .eq('type', 'new_order');

    if (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }

    console.log(`Found ${notifications?.length || 0} pending notifications`);

    // Process each notification
    for (const notification of notifications || []) {
      try {
        // Here you would integrate with a WhatsApp API service like Twilio
        // For now, we'll just log the message and mark as sent
        console.log(`Sending WhatsApp to +254785760507: ${notification.message}`);
        
        // In a real implementation, you would call WhatsApp API here
        // Example with Twilio (you'd need to set up Twilio credentials):
        /*
        const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
        const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
        const fromWhatsApp = 'whatsapp:+14155238886'; // Twilio sandbox number
        const toWhatsApp = 'whatsapp:+254785760507';
        
        const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            From: fromWhatsApp,
            To: toWhatsApp,
            Body: notification.message,
          }),
        });
        */

        // Mark notification as sent
        const { error: updateError } = await supabaseClient
          .from('admin_notifications')
          .update({ sent: true })
          .eq('id', notification.id);

        if (updateError) {
          console.error('Error updating notification:', updateError);
        } else {
          console.log(`Notification ${notification.id} marked as sent`);
        }
      } catch (notificationError) {
        console.error('Error processing notification:', notificationError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: notifications?.length || 0 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in send-whatsapp-notification function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
