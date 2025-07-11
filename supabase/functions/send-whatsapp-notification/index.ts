
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
        // Get Twilio credentials from environment variables
        const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
        const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
        const fromWhatsApp = Deno.env.get('TWILIO_WHATSAPP_FROM'); // Your Twilio WhatsApp number
        const toWhatsApp = `whatsapp:+254785760507`; // Your WhatsApp number

        if (!accountSid || !authToken || !fromWhatsApp) {
          console.error('Missing Twilio credentials');
          continue;
        }

        console.log(`Sending WhatsApp to ${toWhatsApp}: ${notification.message}`);
        
        // Send WhatsApp message via Twilio
        const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            From: fromWhatsApp,
            To: toWhatsApp,
            Body: `🚨 NEW ORDER ALERT!\n\n${notification.message}\n\nPlease check your admin panel to approve this order.`,
          }),
        });

        const result = await response.json();
        
        if (response.ok) {
          console.log('WhatsApp message sent successfully:', result.sid);
          
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
        } else {
          console.error('Error sending WhatsApp message:', result);
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
