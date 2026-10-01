import Link from 'next/link';
import { ArrowLeft, LockKeyhole } from 'lucide-react';
import { SchoolBrand } from '@/components/SchoolBrand';
import { login } from './actions';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="loginPage">
      <section className="loginCard blockCard">
        <div className="loginBrand"><SchoolBrand /></div>
        <div className="iconBubble"><LockKeyhole size={28} /></div>
        <h1>Admin Login</h1>
        <p>Untuk pentadbir Relief SK Semangar.</p>
        {error ? <div className="notice warning">{error}</div> : null}
        <form action={login}>
          <label>Email<input name="email" type="email" placeholder="admin@sekolah.my" required /></label>
          <label>Kata Laluan<input name="password" type="password" placeholder="••••••••" required /></label>
          <button type="submit" className="button primary full">Log Masuk</button>
        </form>
        <Link href="/" className="textLink"><ArrowLeft size={16} /> Kembali</Link>
      </section>
    </main>
  );
}
