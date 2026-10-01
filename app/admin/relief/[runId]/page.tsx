import Link from "next/link";
import { CheckCircle2, ChevronLeft, Send } from "lucide-react";
import { AdminNav } from "@/components/AdminNav";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { normalReliefPreview } from "@/lib/mock-data";

export default async function ReliefPreviewPage({ params }: { params: Promise<{ runId: string }> }) {
  await params;
  return <main className="adminLayout"><AdminNav active="Jana Relief" /><section className="adminContent"><header className="adminTop"><div><span className="eyebrow">STEP 3 · PREVIEW</span><h1>Preview Relief</h1><p>Semak jadual sebelum diterbitkan.</p></div><span className="statusPill">DRAFT</span></header><div className="summaryCards"><div><strong>12</strong><span>slot relief</span></div><div><strong>0</strong><span>unresolved</span></div><div><strong>8</strong><span>guru terlibat</span></div><div><strong>12</strong><span>load unit</span></div></div><section className="previewList">{normalReliefPreview.map((item,index)=><article className="reliefCard blockCard" key={item.time}><div className="reliefNo">{index+1}</div><div className="reliefMain"><span className="reliefTime">{item.time}</span><h3>{item.className} · {item.subject}</h3><div className="pair"><span>Guru Tidak Hadir<strong>{item.absent}</strong></span><span>Guru Relief<strong>{item.relief}</strong></span></div></div><span className="rankBadge">Pilihan #1</span></article>)}</section><div className="publishBar"><Link href="/admin/relief/new" className="button secondary"><ChevronLeft size={17} /> Kembali</Link><button className="button primary"><CheckCircle2 size={17} /> Simpan Draft</button><button className="button teal"><Send size={17} /> Terbitkan</button></div></section><MobileBottomNav /></main>
}
