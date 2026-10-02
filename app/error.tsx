'use client';

import Link from 'next/link';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="container narrow successPage"><section className="blockCard successCard"><h1>Halaman tidak dapat dibuka</h1><p>Sambungan atau pemprosesan terganggu. Sila cuba semula.</p><button className="button primary full" onClick={reset}>Cuba Semula</button><Link href="/" className="button secondary full">Halaman Utama</Link></section></main>;
}
