import { createClient } from '@supabase/supabase-js';
import { supabasePublishableKey, supabaseUrl } from './config';

// Guest RPCs use the publishable key; no Admin session refresh is needed.
export function createGuestClient() {
  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
