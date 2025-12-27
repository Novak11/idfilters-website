import Link from "next/link";

import { Container } from "./Container";

const phonePrimary = "+381 62 123 5412";
const phoneSecondary = "+381 11 630 4291";
const email = "idfilters@gmail.com";

export function SiteFooter() {
  return (
    <footer className="border-t bg-white/60 py-10 dark:bg-white/[0.02]">
      <Container className="grid gap-8 md:grid-cols-3">
        <div>
          <div className="text-sm font-semibold tracking-tight">ID Filters d.o.o.</div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Porodična firma za proizvodnju i prodaju filtera za vazduh za civilnu i
            industrijsku klimatizaciju i ventilaciju.
          </p>
        </div>

        <div>
          <div className="text-sm font-semibold tracking-tight">Brzi linkovi</div>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/proizvodi" className="text-slate-700 hover:underline dark:text-slate-200">
                Proizvodi
              </Link>
            </li>
            <li>
              <Link href="/aplikacija" className="text-slate-700 hover:underline dark:text-slate-200">
                Aplikacije
              </Link>
            </li>
            <li>
              <Link href="/iso-16890-zamena-za-en779" className="text-slate-700 hover:underline dark:text-slate-200">
                ISO 16890 (zamena za EN779)
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold tracking-tight">Kontakt</div>
          <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
            <div>
              11271 Beograd, Surčin – Srbija <br />
              Labudova br. 7
            </div>
            <div>
              <a className="hover:underline" href={`tel:${phonePrimary.replace(/\s+/g, "")}`}>
                {phonePrimary}
              </a>
              {` · `}
              <a className="hover:underline" href={`tel:${phoneSecondary.replace(/\s+/g, "")}`}>
                {phoneSecondary}
              </a>
            </div>
            <div>
              <a className="hover:underline" href={`mailto:${email}`}>
                {email}
              </a>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} ID Filters. Sva prava zadržana.
          </div>
        </div>
      </Container>
    </footer>
  );
}

