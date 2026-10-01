import Link from "next/link";
import { CalendarDays, Home, Sparkles, UsersRound } from "lucide-react";

export function MobileBottomNav() {
  return (
    <nav className="mobileBottomNav">
      <Link href="/admin"><Home size={19} /><span>Dashboard</span></Link>
      <Link href="/admin/keberadaan"><UsersRound size={19} /><span>Keberadaan</span></Link>
      <Link href="/admin/relief/new"><Sparkles size={19} /><span>Relief</span></Link>
      <Link href="/relief/today"><CalendarDays size={19} /><span>Jadual</span></Link>
    </nav>
  );
}
