import Link from 'next/link';
import { ArrowLeft, LockKeyhole } from 'lucide-react';
import { SchoolBrand } from '@/components/SchoolBrand';
import { SubmitButton } from '@/components/SubmitButton';
import { login } from './actions';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  return (
    <main className="loginPage">
      <section className="loginCard blockCard">
        <div className="loginBrand"><SchoolBrand /></div>
        <div className="iconBubble"><LockKeyhole size={28} /></div>
        <h1>Admin Login</h1>
        <p>Untuk pentadbir Relief SK Semangar.</p>
        {error ? <div className="notice warning">{error}</div> : null}
        {message ? <div className="notice info" role="status">{message}</div> : null}
        <form action={login}>
          <label>Email<input name="email" autoComplete="username" type="email" placeholder="admin@sekolah.my" required /></label>
          <label>Kata Laluan<input name="password" autoComplete="current-password" type="password" placeholder="••••••••" required /></label>
          <SubmitButton>Log Masuk</SubmitButton>
        </form>
        <Link href="/admin/signup" className="button secondary full" style={{ marginTop: 16 }}>Daftar Akaun (Sign Up)</Link>
        <Link href="/" className="textLink"><ArrowLeft size={16} /> Kembali</Link>
      </section>
    </main>
  );
}
