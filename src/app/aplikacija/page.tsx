import type { Metadata } from "next";

import { CardLink } from "@/components/CardLink";
import { Container } from "@/components/Container";
import { getApplications } from "@/content/site";

export const metadata: Metadata = {
  title: "Aplikacije",
  description: "Gde se ID Filters rešenja najčešće koriste.",
};

export default function ApplicationsPage() {
  const apps = getApplications().sort((a, b) => a.title.localeCompare(b.title));

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Aplikacije</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
        Primeri primene filtera za vazduh u industriji i objektima sa posebnim zahtevima.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {apps.map((a) => (
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
  );
}

