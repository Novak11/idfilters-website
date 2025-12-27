"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useState } from "react";

export function SearchField({
  label,
  placeholder,
  param = "q",
}: {
  label: string;
  placeholder?: string;
  param?: string;
}) {
  const id = useId();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = searchParams.get(param) ?? "";
  const [value, setValue] = useState(current);

  useEffect(() => {
    setValue(current);
  }, [current]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams(searchParams.toString());
    const trimmed = value.trim();
    if (trimmed) next.set(param, trimmed);
    else next.delete(param);
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </label>
        <input
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none ring-sky-500/30 placeholder:text-slate-400 focus:ring-4 dark:bg-white/[0.03]"
        />
      </div>
      <button
        type="submit"
        className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/40"
      >
        Pretraži
      </button>
    </form>
  );
}

