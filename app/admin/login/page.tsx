import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { SchoolBrand } from "@/components/SchoolBrand";

export default function AdminLoginPage() {
  return (
    <main className="loginPage">
      <section className="loginCard blockCard">
        <div className="loginBrand"><SchoolBrand /></div>
        <div className="iconBubble"><LockKeyhole size={28} /></div>
        <h1>Admin Login</h1>
        <p>Untuk pentadbir Relief SK Semangar.</p>
        <form>
          <label>Email<input type="email" placeholder="admin@sekolah.my" /></label>
          <label>Kata Laluan<input type="password" placeholder="••••••••" /></label>
          <Link href="/admin" className="button primary full">Log Masuk</Link>
        </form>
        <Link href="/" className="textLink"><ArrowLeft size={16} /> Kembali</Link>
      </section>
    </main>
  );
}
