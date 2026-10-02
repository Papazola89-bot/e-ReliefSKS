import Link from 'next/link';
import { SchoolBrand } from '@/components/SchoolBrand';
import { SubmitButton } from '@/components/SubmitButton';
import { openGuestLink } from './actions';

export default async function GuestEntry({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main className="guestPage container narrow">
    <header className="guestHeader"><SchoolBrand compact /></header>
    <section className="pageIntro"><span className="eyebrow">GUEST MODE</span><h1>Saya Guru</h1><p>Gunakan pautan peribadi yang diberikan oleh admin.</p></section>
    <div className="notice info">Jika hadir seperti biasa, tidak perlu isi apa-apa. Pautan ini hanya untuk memaklumkan ketidakhadiran atau tugasan luar.</div>
    {error ? <div className="notice warning" role="alert">{error}</div> : null}
    <form action={openGuestLink} className="formCard blockCard">
      <label>Pautan / Token Guru<input name="token" required autoComplete="off" placeholder="Tampal pautan peribadi anda" /></label>
      <SubmitButton>Buka Borang Keberadaan</SubmitButton>
      <p className="microNote">Belum menerima pautan? Hubungi pentadbir relief sekolah.</p>
    </form><Link href="/" className="textLink">Kembali ke halaman utama</Link>
  </main>;
}
