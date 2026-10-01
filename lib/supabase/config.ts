export const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  'https://lhjgdvpsvscghecwuwho.supabase.co';

export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  'sb_publishable_LIFDir2ohX1i6pADceIF7Q_QbVDkWZB';
