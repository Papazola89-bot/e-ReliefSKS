import { AdminNav } from "@/components/AdminNav";
import { MobileBottomNav } from "@/components/MobileBottomNav";

const days = [
  { day: "ISNIN", date: "28 Sept", items: ["Guru A · CRK", "Guru B · Program PPD", "Guru C · Kursus Daerah"] },
  { day: "SELASA", date: "29 Sept", items: ["Guru D · Mesyuarat", "Guru E · Pertandingan"] },
  { day: "RABU", date: "30 Sept", items: [] },
];

export default function KeberadaanPage() {
  return <main className="adminLayout"><AdminNav active="Keberadaan" /><section className="adminContent"><header className="adminTop"><div><span className="eyebrow">MINGGU 34</span><h1>Keberadaan Guru</h1><p>Paparan mingguan untuk perancangan relief.</p></div></header><div className="weeklyGrid">{days.map((d)=><section key={d.day} className="blockCard dayCard"><div className="dayHead"><div><strong>{d.day}</strong><span>{d.date}</span></div><span className="countBadge">{d.items.length}</span></div>{d.items.length ? <ol>{d.items.map(item=><li key={item}>{item}</li>)}</ol> : <div className="emptyState">Tiada rekod keberadaan.</div>}</section>)}</div></section><MobileBottomNav /></main>
}
