import Link from 'next/link';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { SchoolBrand } from '@/components/SchoolBrand';
import { SubmitButton } from '@/components/SubmitButton';
import { signup } from './actions';

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; submitted?: string }>;
}) {
  const { error, submitted } = await searchParams;

  return (
    <main className="loginPage">
      <section className="loginCard blockCard">
        <div className="loginBrand"><SchoolBrand /></div>
        <div className="iconBubble"><UserPlus size={28} /></div>
        <h1>Daftar Akaun</h1>
        <p>Untuk pentadbir Relief SK Semangar.</p>
        <div className="notice info">Pendaftaran tidak memberikan akses Admin secara automatik. Pentadbir sekolah perlu mengaktifkan akses anda selepas email disahkan.</div>
        {error ? <div className="notice warning" role="alert">{error}</div> : null}
        {submitted ? (
          <div className="notice info" role="status">Permintaan pendaftaran diterima. Semak peti masuk dan folder spam untuk pautan pengesahan. Jika email ini sudah didaftarkan, gunakan akaun sedia ada. Selepas email disahkan, hubungi pentadbir sekolah untuk pengaktifan akses Admin.</div>
        ) : (
          <form action={signup}>
            <label>Email<input name="email" autoComplete="email" type="email" required maxLength={254} placeholder="nama@sekolah.my" /></label>
            <label>Kata Laluan<input name="password" autoComplete="new-password" type="password" required minLength={8} maxLength={128} /></label>
            <label>Sahkan Kata Laluan<input name="confirmPassword" autoComplete="new-password" type="password" required minLength={8} maxLength={128} /></label>
            <p className="microNote">Gunakan sekurang-kurangnya 8 aksara.</p>
            <SubmitButton>Daftar Akaun</SubmitButton>
          </form>
        )}
        <Link href="/admin/login" className="textLink"><ArrowLeft size={16} /> Kembali ke Log Masuk</Link>
      </section>
    </main>
  );
}
