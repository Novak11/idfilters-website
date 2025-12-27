import Image from "next/image";
import Link from "next/link";

import { AirflowBackground } from "@/components/AirflowBackground";
import { CardLink } from "@/components/CardLink";
import { Container } from "@/components/Container";
import type { PageEntry } from "@/content/site";
import { getApplications, getPageByPath } from "@/content/site";

const phone = "+381 62 123 5412";
const email = "idfilters@gmail.com";

export default function HomePage() {
  const home = getPageByPath("/")!;
  const about = getPageByPath("/o-nama");
  const iso = getPageByPath("/iso-16890-zamena-za-en779");

  const featuredProductPaths = [
    "/proizvodi/filter-materijali",
    "/proizvodi/filter-vrece/fine-filter-vrece",
    "/proizvodi/kompaktni-filteri",
    "/proizvodi/panelni-filteri/panelni-filteri",
    "/proizvodi/industrijski-filteri",
    "/proizvodi/apsolutni-filteri",
  ];
  const featuredProducts = featuredProductPaths
    .map((p) => getPageByPath(p))
    .filter((p): p is PageEntry => Boolean(p));

  const applications = getApplications();

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50 to-white dark:from-slate-950 dark:to-slate-950" />
        <AirflowBackground />
        <Container className="relative py-14 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="inline-flex items-center rounded-full border bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm dark:bg-white/[0.03] dark:text-slate-200">
                Proizvodnja · Tehnička podrška · Brza isporuka
              </div>
              <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
                {home.title}
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-base text-slate-600 dark:text-slate-300 sm:text-lg">
                {about?.excerpt ||
                  "Specijalizovani smo za filtere za vazduh za civilnu i industrijsku klimatizaciju i ventilaciju, uz potpunu tehničku podršku."}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/proizvodi"
                  className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/40"
                >
                  Pogledaj proizvode
                </Link>
                <Link
                  href="/kontakt"
                  className="inline-flex items-center justify-center rounded-xl border bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/30 dark:bg-white/[0.03] dark:text-white dark:hover:bg-white/[0.06]"
                >
                  Kontakt i ponuda
                </Link>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  <a className="font-medium hover:underline" href={`tel:${phone.replace(/\s+/g, "")}`}>
                    {phone}
                  </a>
                  {" · "}
                  <a className="font-medium hover:underline" href={`mailto:${email}`}>
                    {email}
                  </a>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border bg-white shadow-sm dark:bg-white/[0.03]">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-200/50 via-transparent to-emerald-200/40 dark:from-sky-500/10 dark:to-emerald-500/10" />
              <div className="relative p-6 sm:p-8">
                <div className="text-sm font-semibold tracking-tight">Brzi pregled</div>
                <ul className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-200">
                  <li className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-sky-600" />
                    ISO 16890 (zamena za EN779) – klase G2 do F9
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-sky-600" />
                    HEPA/ULPA filteri (EN1822) – po zahtevu
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-sky-600" />
                    Rešenja za čiste sobe, lakirnice, industrijsko otprašivanje
                  </li>
                </ul>
                {home.heroImage ? (
                  <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-2xl border bg-slate-50 dark:bg-white/[0.02]">
                    <Image
                      src={home.heroImage}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 420px, 100vw"
                      priority
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Proizvodi</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Najtraženije kategorije iz ponude.
              </p>
            </div>
            <Link
              href="/proizvodi"
              className="text-sm font-semibold text-sky-700 hover:underline dark:text-sky-300"
            >
              Sve kategorije →
            </Link>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((p) => (
              <CardLink
                key={p.path}
                href={p.path}
                title={p.title}
                description={p.excerpt}
                image={p.heroImage}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y bg-white/40 py-14 dark:bg-white/[0.02]">
        <Container>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Aplikacije</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Gde se naši filteri najčešće koriste.
              </p>
            </div>
            <Link
              href="/aplikacija"
              className="text-sm font-semibold text-sky-700 hover:underline dark:text-sky-300"
            >
              Sve aplikacije →
            </Link>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {applications.map((a) => (
              <CardLink
                key={a.path}
                href={a.path}
                title={a.title}
                description={a.excerpt}
                image={a.heroImage}
                badge="Aplikacija"
              />
            ))}
          </div>
        </Container>
      </section>

      {iso ? (
        <section className="py-14">
          <Container>
            <div className="grid gap-6 rounded-3xl border bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-8 shadow-sm dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Standardi i edukacija
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                    {iso.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {iso.excerpt}
                  </p>
                </div>
                <Link
                  href={iso.path}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/40 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                  Pročitaj više
                </Link>
              </div>
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
