import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { MarkdownContent } from "@/components/MarkdownContent";
import { getAllPages, getPageByPath } from "@/content/site";

export const dynamicParams = false;

function normalizeForCompare(value: string) {
  return value
    .toLowerCase()
    .replace(/đ/g, "dj")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "dj")
    .replace(/\s+/g, " ")
    .trim();
}

function stripLeadingTitleHeading(markdown: string, title: string) {
  const lines = markdown.split("\n");
  let i = 0;
  while (i < lines.length && lines[i].trim() === "") i++;

  const headingLine = lines[i]?.trim() ?? "";
  const headingMatch = headingLine.match(/^#{1,6}\s+(.+?)\s*$/);
  if (!headingMatch) return markdown.trim();

  const headingText = headingMatch[1].replace(/\s*#+\s*$/, "").trim();

  const a = normalizeForCompare(headingText);
  const b = normalizeForCompare(title);
  const redundant = Boolean(a && b && (a === b || a.startsWith(b) || b.startsWith(a)));

  if (!redundant) return markdown.trim();

  i++;
  while (i < lines.length && lines[i].trim() === "") i++;
  return lines.slice(i).join("\n").trim();
}

function pageHrefFromSlug(slug: string[]) {
  return `/${slug.join("/")}`.replace(/\/+$/, "") || "/";
}

export function generateStaticParams() {
  const excluded = new Set(["/", "/proizvodi", "/aplikacija", "/kontakt"]);
  return getAllPages()
    .map((p) => p.path)
    .filter((p) => !excluded.has(p))
    .map((p) => ({ slug: p.slice(1).split("/") }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Metadata {
  const path = pageHrefFromSlug(params.slug);
  const page = getPageByPath(path);
  if (!page) return {};

  return {
    title: page.title,
    description: page.excerpt || undefined,
  };
}

function labelForType(type: string) {
  switch (type) {
    case "product":
      return "Proizvod";
    case "products_index":
      return "Proizvodi";
    case "application":
      return "Aplikacija";
    case "applications_index":
      return "Aplikacije";
    case "attachment":
      return "Resurs";
    default:
      return "Stranica";
  }
}

function prettifySegment(seg: string) {
  const decoded = decodeURIComponent(seg);
  return decoded
    .replace(/-/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function Breadcrumbs({ path }: { path: string }) {
  const segments = path.split("/").filter(Boolean);
  const crumbs: Array<{ href: string; label: string; linked: boolean }> = [
    { href: "/", label: "Početna", linked: true },
  ];

  let acc = "";
  for (const seg of segments) {
    acc += `/${seg}`;
    const page = getPageByPath(acc);
    crumbs.push({
      href: acc,
      label: page?.title ?? prettifySegment(seg),
      linked: Boolean(page),
    });
  }

  return (
    <nav aria-label="Breadcrumb" className="text-xs text-slate-500 dark:text-slate-400">
      <ol className="flex flex-wrap items-center gap-2">
        {crumbs.map((c, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
          <li key={c.href} className="flex items-center gap-2">
            {idx > 0 ? <span className="opacity-50">/</span> : null}
            {isLast ? (
              <span aria-current="page" className="text-slate-700 dark:text-slate-200">
                {c.label}
              </span>
            ) : c.href === "/" || c.linked ? (
              <Link href={c.href} className="hover:underline">
                {c.label}
              </Link>
            ) : (
              <span>{c.label}</span>
            )}
          </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default function ContentPage({ params }: { params: { slug: string[] } }) {
  const path = pageHrefFromSlug(params.slug);
  const page = getPageByPath(path);
  if (!page) notFound();

  const typeLabel = labelForType(page.type);
  const markdown = stripLeadingTitleHeading(page.markdown, page.title);

  return (
    <Container className="py-12">
      <div className="grid gap-8">
        <Breadcrumbs path={page.path} />

        <div className="grid gap-6 rounded-3xl border bg-white p-7 shadow-sm dark:bg-white/[0.03]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white dark:bg-white dark:text-slate-950">
              {typeLabel}
            </div>
            {page.source?.url ? (
              <a
                className="text-xs text-slate-500 hover:underline dark:text-slate-400"
                href={page.source.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Izvor
              </a>
            ) : null}
          </div>

          <div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {page.title}
            </h1>
          </div>

          <MarkdownContent markdown={markdown} />

          {page.type === "product" || page.type === "application" ? (
            <div className="mt-2 flex flex-col gap-3 rounded-2xl border bg-sky-50 p-5 text-sm text-slate-700 dark:bg-sky-500/10 dark:text-slate-200 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-semibold tracking-tight">Treba ponuda?</div>
                <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  Pošaljite dimenzije, klasu i količinu — odgovaramo brzo.
                </div>
              </div>
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/40"
              >
                Kontakt
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </Container>
  );
}
