import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="not-found wrap">
      <p className="syntax-keyword">404 / SIGNAL LOST</p>
      <h1>Off the flight path.</h1>
      <p>This page could not be found.</p>
      <Link href="/" className="btn solid">
        Return to portfolio
      </Link>
    </main>
  );
}
