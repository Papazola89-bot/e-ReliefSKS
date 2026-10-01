import { createBrowserClient } from '@supabase/ssr';

function publicKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = publicKey();

  if (!url || !key) {
    throw new Error('Supabase public environment variables are missing.');
  }

  return createBrowserClient(url, key);
}
