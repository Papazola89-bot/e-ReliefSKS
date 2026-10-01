import Link from "next/link";
import { CalendarDays, ClipboardList, LayoutDashboard, Settings, UsersRound } from "lucide-react";
import { SchoolBrand } from "./SchoolBrand";

const items = [
  ["Dashboard", "/admin", LayoutDashboard],
  ["Keberadaan", "/admin/keberadaan", UsersRound],
  ["Jana Relief", "/admin/relief/new", ClipboardList],
  ["Jadual Relief", "/relief/today", CalendarDays],
  ["Tetapan", "#", Settings],
] as const;

export function AdminNav({ active }: { active?: string }) {
  return (
    <aside className="adminSidebar">
      <SchoolBrand compact />
      <nav>
        {items.map(([label, href, Icon]) => (
          <Link key={label} href={href} className={active === label ? "navItem active" : "navItem"}>
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <div className="sidebarNote">
        <strong>SK Semangar</strong>
        <span>Relief lebih teratur, guru lebih terjaga.</span>
      </div>
    </aside>
  );
}
