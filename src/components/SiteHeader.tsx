import Image from "next/image";
import Link from "next/link";

import { Container } from "./Container";
import { MobileNav } from "./MobileNav";

const nav = [
  { href: "/proizvodi", label: "Proizvodi" },
  { href: "/aplikacija", label: "Aplikacije" },
  { href: "/o-nama", label: "O nama" },
  { href: "/o-filterima", label: "O filterima" },
  { href: "/kontakt", label: "Kontakt" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur dark:bg-black/20">
      <Container className="flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/wp-content/uploads/2014/03/id-filters-beograd-logo-mali.png"
            alt="ID Filters"
            width={100}
            height={34}
            priority
          />
          <span className="sr-only">Početna</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <MobileNav items={nav} />
      </Container>
    </header>
  );
}
