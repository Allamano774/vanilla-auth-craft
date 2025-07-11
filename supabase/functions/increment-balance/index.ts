
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  // This is a placeholder - the actual balance increment will be handled by SQL function
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
