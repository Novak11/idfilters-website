"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

type NavItem = {
  href: string;
  label: string;
};

export function MobileNav({ items }: { items: NavItem[] }) {
  const detailsRef = useRef<HTMLDetailsElement | null>(null);
  const pathname = usePathname();

  function close() {
    if (detailsRef.current) detailsRef.current.open = false;
  }

  useEffect(() => {
    close();
  }, [pathname]);

  return (
    <details ref={detailsRef} className="relative md:hidden">
      <summary className="list-none rounded-xl border px-3 py-2 text-sm font-medium text-slate-800 shadow-sm dark:text-slate-100 [&::-webkit-details-marker]:hidden">
        Meni
      </summary>
      <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border bg-white shadow-lg dark:bg-slate-950">
        <div className="p-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className="block rounded-xl px-3 py-2 text-sm text-slate-800 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-white/[0.05]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </details>
  );
}
