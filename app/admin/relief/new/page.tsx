import Link from "next/link";
import { CheckCircle2, Sparkles, UsersRound } from "lucide-react";
import { AdminNav } from "@/components/AdminNav";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export default function NewReliefPage() {
  return <main className="adminLayout"><AdminNav active="Jana Relief" /><section className="adminContent"><header className="adminTop"><div><span className="eyebrow">STEP 1 · TETAPAN</span><h1>Jana Relief</h1><p>Sistem akan menilai planned + LIVE dan mencadangkan mode yang sesuai.</p></div></header><div className="stepper"><span className="active">1 Tetapan</span><span>2 Analisis</span><span>3 Preview</span><span>4 Terbit</span></div><section className="blockCard settingsCard"><label>Tarikh Relief<input type="date" defaultValue="2026-10-02" /></label><label>Mode<select defaultValue="AUTO"><option>AUTO</option><option>NORMAL</option><option>BERKAMPUNG</option></select></label><div className="analysisPreview"><div><UsersRound /><span>P1 Hadir</span><strong>10 / 12</strong></div><div><CheckCircle2 /><span>Normal Capacity</span><strong>Mencukupi</strong></div><div><Sparkles /><span>Cadangan</span><strong>Relief Biasa</strong></div></div><Link href="/admin/relief/demo" className="button primary full"><Sparkles size={18} /> Jana Cadangan</Link></section></section><MobileBottomNav /></main>
}
