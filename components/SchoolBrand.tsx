import Image from "next/image";
import Link from "next/link";

export function SchoolBrand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand">
      <Image
        src="/images/logo-sk-semangar.png"
        alt="Logo SK Semangar"
        width={compact ? 42 : 54}
        height={compact ? 42 : 54}
        className="brandLogo"
      />
      <span>
        <strong>{compact ? "Relief SK Semangar" : "SK Semangar"}</strong>
        <small>Kota Tinggi, Johor</small>
      </span>
    </Link>
  );
}
