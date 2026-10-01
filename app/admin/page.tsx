import Link from "next/link";
import { AlertTriangle, CalendarDays, CheckCircle2, Sparkles, UserRoundX, UsersRound } from "lucide-react";
import { AdminNav } from "@/components/AdminNav";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { absenceRows } from "@/lib/mock-data";

export default function AdminDashboard() {
  return (
    <main className="adminLayout">
      <AdminNav active="Dashboard" />
      <section className="adminContent">
        <header className="adminTop"><div><span className="eyebrow">HARI INI</span><h1>Dashboard Admin</h1><p>Ringkasan keberadaan guru dan status relief sekolah.</p></div><span className="adminChip">Admin SK Semangar</span></header>
        <div className="kpiGrid">
          <div className="kpi"><UsersRound /><span>Guru Hadir</span><strong>36</strong><small>Status semasa</small></div>
          <div className="kpi"><CalendarDays /><span>Planned Away</span><strong>6</strong><small>Keberadaan terancang</small></div>
          <div className="kpi"><UserRoundX /><span>Live Absent</span><strong>3</strong><small>Tidak hadir hari ini</small></div>
          <div className="kpi"><Sparkles /><span>Cadangan Mode</span><strong>BIASA</strong><small>Kapasiti normal mencukupi</small></div>
        </div>
        <section className="blockCard adminBlock">
          <div className="sectionHeading"><div><h2>Senarai Guru Tidak Hadir</h2><p>Planned dan LIVE untuk hari ini.</p></div><Link href="/admin/keberadaan">Lihat semua</Link></div>
          <div className="tableLike">{absenceRows.map((row,index)=><div className="tableRow" key={row.name}><span>{index+1}</span><strong>{row.name}</strong><span className="statusPill">{row.status}</span><span className="rowDetail">{row.detail}</span><span className="source">{row.source}</span></div>)}</div>
        </section>
        <div className="dashboardActions">
          <section className="blockCard reliefNeed"><AlertTriangle /><span>Keperluan Relief Hari Ini</span><strong>12</strong><small>waktu perlu diisi</small></section>
          <section className="blockCard modeCard"><CheckCircle2 /><span>Mode Dicadangkan</span><strong>Relief Biasa</strong><small>Kapasiti normal masih mencukupi.</small></section>
        </div>
        <Link href="/admin/relief/new" className="button primary fabLike"><Sparkles size={18} /> Jana Relief</Link>
      </section>
      <MobileBottomNav />
    </main>
  );
}
