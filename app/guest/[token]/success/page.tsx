import Link from "next/link";
import { CheckCircle2, Home } from "lucide-react";

export default async function SuccessPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <main className="successPage container narrow">
      <div className="successCard blockCard">
        <CheckCircle2 size={74} className="successIcon" />
        <span className="eyebrow">BERJAYA</span>
        <h1>Maklumat Berjaya Dihantar</h1>
        <p>Terima kasih kerana memaklumkan keberadaan anda.</p>
        <div className="summaryList">
          <div><span>Nama Guru</span><strong>Nama guru</strong></div>
          <div><span>Tarikh</span><strong>2 Oktober 2026</strong></div>
          <div><span>Status</span><strong>Bertugas Luar</strong></div>
          <div><span>Sebab / Program</span><strong>Program rasmi</strong></div>
        </div>
        <Link href={`/guest/${token}`} className="button secondary full">Kemaskini Maklumat</Link>
        <Link href="/" className="button primary full"><Home size={18} /> Kembali ke Halaman Utama</Link>
      </div>
    </main>
  );
}
