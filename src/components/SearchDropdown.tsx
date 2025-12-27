"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useId, useMemo } from "react";

type Option = { value: string; label: string };
type OptionGroup = { label: string; options: Option[] };
type DropdownItem =
  | { type: "option"; option: Option }
  | { type: "group"; group: OptionGroup };

export function SearchDropdown({
  label,
  placeholder = "Sve",
  items,
  options = [],
  groups = [],
  param = "q",
}: {
  label: string;
  placeholder?: string;
  items?: DropdownItem[];
  options?: Option[];
  groups?: OptionGroup[];
  param?: string;
}) {
  const id = useId();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = searchParams.get(param) ?? "";
  const itemsToRender = useMemo(() => {
    if (items && items.length > 0) return items;
    return [
      ...options.map((o) => ({ type: "option" as const, option: o })),
      ...groups.map((g) => ({ type: "group" as const, group: g })),
    ];
  }, [groups, items, options]);
  const allValues = useMemo(() => {
    const set = new Set<string>();
    for (const item of itemsToRender) {
      if (item.type === "option") set.add(item.option.value);
      else for (const o of item.group.options) set.add(o.value);
    }
    return set;
  }, [itemsToRender]);

  function onChange(value: string) {
    const next = new URLSearchParams(searchParams.toString());
    const trimmed = value.trim();
    if (trimmed) next.set(param, trimmed);
    else next.delete(param);
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const value = allValues.has(current) ? current : "";

  return (
    <div>
      <label
        htmlFor={id}
        className="text-sm font-medium text-slate-700 dark:text-slate-200"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 shadow-sm outline-none ring-sky-500/30 focus:border-sky-500 focus:ring-4 dark:border-white/15 dark:bg-slate-900/70 dark:text-slate-100"
      >
        <option value="">{placeholder}</option>
        {current && !allValues.has(current) ? (
          <option value={current}>{`Pretraga: ${current}`}</option>
        ) : null}
        {itemsToRender.map((item) => {
          if (item.type === "option") {
            const o = item.option;
            return (
              <option key={`__opt__${o.value}`} value={o.value}>
                {o.label}
              </option>
            );
          }

          return (
            <optgroup key={item.group.label} label={item.group.label}>
              {item.group.options.map((o) => (
                <option key={`${item.group.label}::${o.value}`} value={o.value}>
                  {o.label}
                </option>
              ))}
            </optgroup>
          );
        })}
      </select>
    </div>
  );
}
