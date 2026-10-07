import { redirect } from 'next/navigation';

export default function LegacyGuestTokenPage() {
  redirect('/guest');
}
