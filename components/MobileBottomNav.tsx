import { logout } from '@/app/admin/login/actions';
import Link from "next/link";
import { CalendarDays, Home, Sparkles, UsersRound, Settings, LogOut } from "lucide-react";

export function MobileBottomNav() {
  return (
    <nav className="mobileBottomNav">
      <Link href="/admin"><Home size={19} /><span>Dashboard</span></Link>
      <Link href="/admin/keberadaan"><UsersRound size={19} /><span>Keberadaan</span></Link>
      <Link href="/admin/relief/new"><Sparkles size={19} /><span>Relief</span></Link>
      <Link href="/relief/today"><CalendarDays size={19} /><span>Jadual</span></Link>
    <Link href="/admin/settings"><Settings size={19} /><span>Tetapan</span></Link><form action={logout}><button className="mobileLogout" aria-label="Log Keluar"><LogOut size={19} /><span>Keluar</span></button></form>
    </nav>
  );
}
