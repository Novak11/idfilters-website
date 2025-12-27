import Link from "next/link";

import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl rounded-3xl border bg-white p-8 text-center shadow-sm dark:bg-white/[0.03]">
        <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          404
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Stranica nije pronađena
        </h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Link je možda zastareo ili je stranica premeštena. Probajte početnu stranicu
          ili pregled proizvoda.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/40"
          >
            Početna
          </Link>
          <Link
            href="/proizvodi"
            className="inline-flex items-center justify-center rounded-xl border bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 dark:bg-white/[0.03] dark:text-white dark:hover:bg-white/[0.06]"
          >
            Proizvodi
          </Link>
        </div>
      </div>
    </Container>
  );
}

