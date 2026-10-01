import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LockKeyhole, MapPin, UsersRound } from "lucide-react";
import { SchoolBrand } from "@/components/SchoolBrand";

export default function HomePage() {
  return (
    <main className="landingPage">
      <header className="topbar container"><SchoolBrand /></header>
      <section className="hero container">
        <div className="heroCopy">
          <span className="eyebrow">APLIKASI PENGURUSAN</span>
          <h1>Relief<br /><span>SK Semangar</span></h1>
          <p>Keberadaan Guru · Penjanaan Relief · Lebih Teratur · Lebih Mudah</p>
          <div className="location"><MapPin size={17} /> Kota Tinggi, Johor</div>
          <div className="heroActions">
            <Link href="/guest/demo" className="actionCard primary">
              <UsersRound size={30} />
              <span><strong>Saya Guru</strong><small>Guest Mode · tanpa login</small></span>
              <ArrowRight size={22} />
            </Link>
            <Link href="/admin/login" className="actionCard secondary">
              <LockKeyhole size={28} />
              <span><strong>Admin Login</strong><small>Untuk pentadbir sistem</small></span>
              <ArrowRight size={22} />
            </Link>
          </div>
          <p className="microNote">Jika hadir seperti biasa, tidak perlu isi borang keberadaan.</p>
        </div>
        <div className="heroPhoto blockCard">
          <Image src="/images/sk-semangar.jpg" alt="Sekolah Kebangsaan Semangar" fill priority sizes="(max-width: 900px) 100vw, 50vw" />
          <div className="photoOverlay"><strong>Relief SK Semangar</strong><span>Pengurusan keberadaan guru dan guru ganti secara digital.</span></div>
        </div>
      </section>
    </main>
  );
}
