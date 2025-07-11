
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Process payment function started')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    console.log('Auth check:', { user: user?.email, error: authError })

    if (authError || !user) {
      console.error('Authentication failed:', authError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { amount, email } = await req.json()
    console.log('Payment request:', { amount, email })

    if (!amount || !email) {
      console.error('Missing required fields:', { amount, email })
      return new Response(
        JSON.stringify({ error: 'Amount and email are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get Paystack secret key - FIXED: Use the actual secret name
    const paystackSecretKey = Deno.env.get('sk_live_09f7f8e5af6e740cb15a901af1aefcdf8ccbd58b')
    console.log('Paystack key check:', { hasKey: !!paystackSecretKey })
    
    if (!paystackSecretKey) {
      console.error('Paystack secret key not found')
      return new Response(
        JSON.stringify({ error: 'Payment configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Initializing Paystack payment...')
    
    // Initialize Paystack payment
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // Convert to kobo
        currency: 'KES',
        callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/verify-payment`,
        metadata: {
          user_id: user.id,
        },
      }),
    })

    const paystackData = await paystackResponse.json()
    console.log('Paystack response:', { 
      status: paystackResponse.status, 
      ok: paystackResponse.ok,
      data: paystackData 
    })

    if (!paystackResponse.ok) {
      console.error('Paystack error:', paystackData)
      return new Response(
        JSON.stringify({ error: 'Payment initialization failed', details: paystackData }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create deposit record
    console.log('Creating deposit record...')
    const { error: insertError } = await supabaseClient
      .from('deposits')
      .insert([
        {
          user_id: user.id,
          amount: amount,
          payment_method: 'paystack',
          status: 'pending',
          transaction_reference: paystackData.data.reference,
        },
      ])

    if (insertError) {
      console.error('Database error:', insertError)
      return new Response(
        JSON.stringify({ error: 'Failed to create deposit record', details: insertError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Payment initialization successful')
    return new Response(
      JSON.stringify({
        authorization_url: paystackData.data.authorization_url,
        reference: paystackData.data.reference,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in process-payment function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
