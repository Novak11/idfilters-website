import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function isInternalHref(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}

export function MarkdownContent({ markdown }: { markdown: string }) {
  return (
    <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-a:break-words prose-img:rounded-xl">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a({ href, children }) {
            const safeHref = typeof href === "string" ? href.trim() : "";
            if (!safeHref) return <span>{children}</span>;

            if (safeHref.startsWith("mailto:") || safeHref.startsWith("tel:")) {
              return (
                <a href={safeHref.replace(/^mailto:\s*/i, "mailto:")} className="underline">
                  {children}
                </a>
              );
            }

            if (isInternalHref(safeHref)) {
              return (
                <Link href={safeHref} className="underline underline-offset-4">
                  {children}
                </Link>
              );
            }

            return (
              <a
                href={safeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                {children}
              </a>
            );
          },
          img({ src, alt }) {
            const source = typeof src === "string" ? src.trim() : "";
            if (!source) return null;

            const isLocal = source.startsWith("/");

            if (!isLocal) {
              // External images are rendered as-is to avoid Next.js remote config.
              // eslint-disable-next-line @next/next/no-img-element
              return <img src={source} alt={alt ?? ""} />;
            }

            return (
              <figure className="my-6">
                <div className="relative w-full overflow-hidden rounded-xl border bg-black/[0.02] dark:bg-white/[0.03] aspect-[16/9]">
                  <Image
                    src={source}
                    alt={alt ?? ""}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 896px, 100vw"
                  />
                </div>
              </figure>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

