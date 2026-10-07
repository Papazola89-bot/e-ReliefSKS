import { redirect } from 'next/navigation';

export default function LegacyGuestTokenSuccessPage() {
  redirect('/guest');
}
