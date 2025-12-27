import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/Container";
import { SearchDropdown } from "@/components/SearchDropdown";
import type { PageEntry } from "@/content/site";
import { getProducts } from "@/content/site";

export const metadata: Metadata = {
  title: "Proizvodi",
  description:
    "Pregled proizvoda: filter materijali, filter vreće, panelni, kompaktni, kasetni, apsolutni i industrijski filteri.",
};

export const dynamic = 'force-static';

type ProductGroup = {
  key: string;
  category: PageEntry | null;
  items: PageEntry[];
};

type DropdownOption = { value: string; label: string };
type DropdownGroup = { label: string; options: DropdownOption[] };
type DropdownItem =
  | { type: "option"; option: DropdownOption }
  | { type: "group"; group: DropdownGroup };

function groupProducts(products: PageEntry[]): ProductGroup[] {
  const map = new Map<string, ProductGroup>();

  for (const p of products) {
    const rest = p.path.replace(/^\/proizvodi\//, "");
    const segments = rest.split("/").filter(Boolean);
    const key = segments[0] ?? "ostalo";
    const isCategory = segments.length === 1;

    const group = map.get(key) ?? { key, category: null, items: [] };
    if (isCategory) group.category = p;
    else group.items.push(p);
    map.set(key, group);
  }

  const groups = Array.from(map.values());
  for (const g of groups) g.items.sort((a, b) => a.title.localeCompare(b.title));

  groups.sort((a, b) => {
    const aTitle = a.category?.title ?? a.items[0]?.title ?? a.key;
    const bTitle = b.category?.title ?? b.items[0]?.title ?? b.key;
    return aTitle.localeCompare(bTitle);
  });

  return groups;
}

function cleanTitle(value: string) {
  return value.replace(/\s*[–-]\s*novo\s*$/i, "").trim();
}

function normalizeForSearch(value: string) {
  return value
    .toLowerCase()
    .replace(/đ/g, "dj")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "dj");
}

function matchesQuery(p: PageEntry, q: string) {
  const hay = normalizeForSearch(`${p.title} ${p.excerpt}`);
  return hay.includes(q);
}

function Chevron() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 text-slate-500 transition group-open:rotate-180 dark:text-slate-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const all = getProducts();
  const q = normalizeForSearch((searchParams?.q ?? "").trim());

  const allGroups = groupProducts(all);

  const dropdownItems: DropdownItem[] = [];
  for (const g of allGroups) {
    const groupLabel = cleanTitle(g.category?.title ?? g.items[0]?.title ?? g.key);
    const groupLabelKey = normalizeForSearch(groupLabel);

    const itemCandidates = g.items
      .map((p) => {
        const cleaned = cleanTitle(p.title);
        return { value: cleaned, label: cleaned };
      })
      .filter((o) => {
        if (!g.category) return true;
        return normalizeForSearch(o.label) !== groupLabelKey;
      });

    const seen = new Set<string>();
    const itemOptions: DropdownOption[] = [];
    for (const o of itemCandidates) {
      const key = normalizeForSearch(o.value);
      if (seen.has(key)) continue;
      seen.add(key);
      itemOptions.push(o);
    }

    if (itemOptions.length === 0) {
      const base = g.category ?? g.items[0] ?? null;
      if (!base) continue;
      const cleaned = cleanTitle(base.title);
      dropdownItems.push({ type: "option", option: { value: cleaned, label: cleaned } });
      continue;
    }

    if (itemOptions.length === 1 && normalizeForSearch(itemOptions[0].label) === groupLabelKey) {
      dropdownItems.push({ type: "option", option: itemOptions[0] });
      continue;
    }

    dropdownItems.push({ type: "group", group: { label: groupLabel, options: itemOptions } });
  }

  const groups = allGroups
    .map((g) => {
      if (!q) return g;
      const items = g.items.filter((p) => matchesQuery(p, q));
      return { ...g, items };
    })
    .filter((g) => {
      if (!q) return true;
      return Boolean(g.category && matchesQuery(g.category, q)) || g.items.length > 0;
    });

  return (
    <Container className="py-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Proizvodi</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Kategorije i pod-kategorije filtera. Pretraga radi po nazivu i opisu.
          </p>
        </div>
        <div className="w-full max-w-xl">
          <SearchDropdown
            label="Pretraga"
            placeholder="Sve kategorije"
            items={dropdownItems}
          />
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border bg-white shadow-sm dark:bg-white/[0.03]">
        {groups.length === 0 ? (
          <div className="p-6">
            <div className="text-base font-semibold tracking-tight">Nema rezultata</div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Pokušajte drugu pretragu ili prikažite sve kategorije.
            </p>
            <div className="mt-4">
              <Link
                href="/proizvodi"
                className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/40"
              >
                Prikaži sve
              </Link>
            </div>
          </div>
        ) : null}

        {groups.map((g, idx) => {
          const category = g.category ?? null;
          if (!category) return null;

          const categoryTitleKey = normalizeForSearch(cleanTitle(category.title));
          const children = g.items.filter(
            (p) => normalizeForSearch(cleanTitle(p.title)) !== categoryTitleKey,
          );
          const showChildren = children.length > 0;
          const isFirst = idx === 0;

          const header = (
            <div className="flex items-center gap-4">
              <div className="relative hidden h-12 w-12 overflow-hidden rounded-xl border bg-slate-50 dark:bg-white/[0.02] sm:block">
                {category.heroImage ? (
                  <Image
                    src={category.heroImage}
                    alt={category.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-base font-semibold tracking-tight">
                  {category.title}
                </div>
                {showChildren ? (
                  <div className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                    {children.length} podkategorije
                  </div>
                ) : null}
              </div>
            </div>
          );

          if (!showChildren) {
            return (
              <Link
                key={g.key}
                href={category.path}
                className={`block p-4 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/30 dark:hover:bg-white/[0.04] sm:p-5 ${!isFirst ? "border-t" : ""}`}
              >
                <div className="flex items-center justify-between gap-4">
                  {header}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
              </Link>
            );
          }

          const open = q ? matchesQuery(category, q) || children.length > 0 : false;

          return (
            <details
              key={g.key}
              className={`group ${!isFirst ? "border-t" : ""}`}
              open={open}
            >
              <summary className="list-none cursor-pointer p-4 hover:bg-slate-50 dark:hover:bg-white/[0.04] sm:p-5 [&::-webkit-details-marker]:hidden">
                <div className="flex items-center justify-between gap-4">
                  {header}
                  <Chevron />
                </div>
              </summary>

              <div className="border-t p-2 sm:p-3">
                <ul className="grid gap-1 sm:grid-cols-2">
                  {children.map((p) => (
                    <li key={p.path}>
                      <Link
                        href={p.path}
                        className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/30 dark:text-slate-100 dark:hover:bg-white/[0.06]"
                      >
                        <span className="min-w-0 truncate">{p.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          );
        })}
      </div>
    </Container>
  );
}
