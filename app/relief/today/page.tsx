import { BookOpen, Building2, FlaskConical, Info } from "lucide-react";
import { SchoolBrand } from "@/components/SchoolBrand";

const jobs = [
  ["07:50–08:20", "2 LINUX", "Bahasa Melayu", BookOpen],
  ["08:30–09:00", "4 WINDOWS", "Sains", FlaskConical],
  ["10:40–11:10", "6 FEDORA", "Sejarah", Building2],
] as const;

export default function TodayReliefPage() {
  return <main className="todayPage container narrow"><header className="guestHeader"><SchoolBrand compact /></header><section className="pageIntro"><span className="eyebrow">JADUAL HARI INI</span><h1>Jadual Relief Saya</h1><p>Nama guru akan dipaparkan selepas backend disambungkan.</p></section><div className="notice warning"><Info size={20}/><span>Anda ditugaskan menggantikan kelas seperti berikut.</span></div><div className="todayJobs">{jobs.map(([time,cls,subj,Icon])=><article className="blockCard todayJob" key={time}><Icon size={26}/><div><span>{time}</span><strong>{cls} · {subj}</strong></div></article>)}</div><div className="notice info"><Info size={20}/><span>Ini ialah jadual relief rasmi. Sila hadir mengikut masa dan kelas yang ditetapkan.</span></div></main>
}
