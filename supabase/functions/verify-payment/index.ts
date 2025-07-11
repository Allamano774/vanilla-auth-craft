
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
    console.log('Verify payment function started')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { reference } = await req.json()
    console.log('Verifying payment reference:', reference)

    if (!reference) {
      console.error('Missing reference')
      return new Response(
        JSON.stringify({ error: 'Reference is required' }),
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

    console.log('Verifying with Paystack...')
    
    // Verify payment with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
      },
    })

    const paystackData = await paystackResponse.json()
    console.log('Paystack verification response:', { 
      status: paystackResponse.status, 
      ok: paystackResponse.ok,
      data: paystackData 
    })

    if (!paystackResponse.ok || paystackData.data.status !== 'success') {
      console.error('Payment verification failed:', paystackData)
      return new Response(
        JSON.stringify({ error: 'Payment verification failed', details: paystackData }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const amount = paystackData.data.amount / 100 // Convert from kobo
    const userId = paystackData.data.metadata.user_id

    console.log('Payment verified successfully. Updating database...')

    // Update deposit status
    const { error: updateError } = await supabaseClient
      .from('deposits')
      .update({ status: 'completed' })
      .eq('transaction_reference', reference)

    if (updateError) {
      console.error('Database update error:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update deposit', details: updateError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update user balance using SQL function
    const { error: balanceError } = await supabaseClient
      .rpc('increment_balance', {
        user_id: userId,
        amount: amount
      })

    if (balanceError) {
      console.error('Balance update error:', balanceError)
      // Don't fail the whole transaction for balance update issues
    }

    console.log('Payment verification completed successfully')
    return new Response(
      JSON.stringify({ success: true, amount }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in verify-payment function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
