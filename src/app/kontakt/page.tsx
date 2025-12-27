import type { Metadata } from "next";

import { ContactForm } from "@/components/ContactForm";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontakt informacije i forma za upit/potražnju ponude.",
};

const phonePrimary = "+381 62 123 5412";
const phoneSecondary = "+381 11 630 4291";
const email = "idfilters@gmail.com";

export default function ContactPage() {
  return (
    <Container className="py-12">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl border bg-white p-6 shadow-sm dark:bg-white/[0.03]">
          <h1 className="text-3xl font-semibold tracking-tight">Kontakt</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Pošaljite upit i dobićete odgovor u najkraćem roku.
          </p>

          <div className="mt-6 space-y-4 text-sm text-slate-700 dark:text-slate-200">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Adresa
              </div>
              <div className="mt-1">
                11271 Beograd, Surčin – Srbija <br />
                Labudova br. 7
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Telefon
              </div>
              <div className="mt-1">
                <a className="hover:underline" href={`tel:${phonePrimary.replace(/\s+/g, "")}`}>
                  {phonePrimary}
                </a>
                <br />
                <a className="hover:underline" href={`tel:${phoneSecondary.replace(/\s+/g, "")}`}>
                  {phoneSecondary}
                </a>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Email
              </div>
              <div className="mt-1">
                <a className="hover:underline" href={`mailto:${email}`}>
                  {email}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border bg-slate-50 p-4 text-xs text-slate-600 dark:bg-white/[0.02] dark:text-slate-300">
            Savet: u poruci navedite dimenzije, klasu (ISO 16890 / EN), količinu i rok isporuke.
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm dark:bg-white/[0.03]">
          <div className="text-sm font-semibold tracking-tight">Forma za upit</div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Dugme „Pošalji“ otvara vaš email klijent sa popunjenim podacima.
          </p>
          <div className="mt-6">
            <ContactForm toEmail={email} />
          </div>
        </div>
      </div>
    </Container>
  );
}

