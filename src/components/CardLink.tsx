import Image from "next/image";
import Link from "next/link";

export function CardLink({
  href,
  title,
  description,
  image,
  badge,
}: {
  href: string;
  title: string;
  description?: string;
  image?: string | null;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl border bg-white/[0.03] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full bg-white/[0.02]">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-slate-400">
            <span className="text-sm">Bez slike</span>
          </div>
        )}
        {badge ? (
          <div className="absolute left-3 top-3 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            {badge}
          </div>
        ) : null}
      </div>
      <div className="p-5">
        <div className="text-base font-semibold tracking-tight">{title}</div>
        {description ? (
          <div className="mt-2 line-clamp-3 text-sm text-slate-300">
            {description}
          </div>
        ) : null}
        <div className="mt-4 text-sm font-medium text-sky-300">
          Pogledaj →
        </div>
      </div>
    </Link>
  );
}
