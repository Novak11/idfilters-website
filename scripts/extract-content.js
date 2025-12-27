/* eslint-disable no-console */
const fs = require("node:fs/promises");
const path = require("node:path");
const { load } = require("cheerio");
const TurndownService = require("turndown");

function normalizePathname(pathname) {
  const trimmed = (pathname || "/").trim();
  if (!trimmed || trimmed === "/") return "/";
  return `/${trimmed.replace(/^\/+|\/+$/g, "")}`;
}

function localFileForUrl(hostRoot, url) {
  const { pathname } = new URL(url);
  const cleanPath = normalizePathname(pathname);
  if (cleanPath === "/") return path.join(hostRoot, "index.html");
  if (cleanPath.endsWith(".xml") || cleanPath.endsWith(".txt")) {
    return path.join(hostRoot, cleanPath.slice(1));
  }
  return path.join(hostRoot, cleanPath.slice(1), "index.html");
}

function classifyPage(pathname) {
  if (pathname.includes("/attachment/")) return "attachment";
  if (pathname === "/") return "home";
  if (pathname === "/proizvodi") return "products_index";
  if (pathname.startsWith("/proizvodi/")) return "product";
  if (pathname === "/aplikacija") return "applications_index";
  if (pathname.startsWith("/aplikacija/")) return "application";
  return "page";
}

function rewriteInternalUrl(maybeUrl) {
  throw new Error(
    "rewriteInternalUrl requires a base URL: use rewriteInternalUrlWithBase()."
  );
}

function stripIndexHtml(p) {
  if (!p) return p;
  return p.replace(/\/index\.html$/i, "").replace(/\.html$/i, "");
}

function rewriteInternalUrlWithBase(maybeUrl, baseUrl) {
  if (!maybeUrl) return maybeUrl;

  const value = String(maybeUrl).trim();
  if (!value) return value;

  // Keep anchors, mailto, tel untouched.
  if (
    value.startsWith("#") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:")
  ) {
    return value;
  }

  const normalized = value.startsWith("//") ? `https:${value}` : value;

  try {
    const resolved = new URL(normalized, baseUrl);
    const host = resolved.hostname.toLowerCase();
    if (
      host.endsWith("idfilters.rs") ||
      host === "seo-evolve.com" ||
      host.endsWith(".evolve-designstudio.com")
    ) {
      const pathname = stripIndexHtml(decodeURIComponent(resolved.pathname));
      const clean = normalizePathname(pathname);
      return `${clean}${resolved.hash || ""}`;
    }
    return value;
  } catch {
    // If it's a bare relative path without protocol that URL() can't parse, best-effort normalize.
    const bare = stripIndexHtml(value);
    if (bare.startsWith("/")) return normalizePathname(bare);
    if (bare.startsWith("wp-content/") || bare.startsWith("wp-includes/")) {
      return `/${bare}`;
    }
    return value;
  }
}

function rewriteAssetUrl(maybeUrl, baseUrl) {
  const rewritten = rewriteInternalUrlWithBase(maybeUrl, baseUrl);
  if (!rewritten) return rewritten;

  // If it points to a known WP asset path, ensure it starts with /wp-content/...
  const idx = rewritten.indexOf("/wp-content/");
  if (idx >= 0) return rewritten.slice(idx);
  const idx2 = rewritten.indexOf("/wp-includes/");
  if (idx2 >= 0) return rewritten.slice(idx2);
  if (rewritten.startsWith("wp-content/") || rewritten.startsWith("wp-includes/")) {
    return `/${rewritten}`;
  }
  return rewritten;
}

function textExcerpt(text, maxLen = 180) {
  const clean = String(text || "")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= maxLen) return clean;
  return `${clean.slice(0, maxLen - 1)}…`;
}

async function main() {
  const projectRoot = path.resolve(__dirname, "..");
  const hostRoot = path.resolve(projectRoot, "../mirror/www.idfilters.rs");
  const urlsPath = path.resolve(projectRoot, "../metadata/urls.txt");
  const outPath = path.resolve(projectRoot, "src/content/pages.json");

  const urls = (await fs.readFile(urlsPath, "utf8"))
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    emDelimiter: "_",
  });
  turndown.keep(["sup", "sub"]);

  const pages = [];

  for (const url of urls) {
    const pathname = normalizePathname(new URL(url).pathname);

    // Skip machine-only endpoints; Next.js will generate its own sitemap/robots.
    if (pathname === "/robots.txt" || pathname === "/sitemap.xml") continue;

    const sourcePath = localFileForUrl(hostRoot, url);
    let html;
    try {
      html = await fs.readFile(sourcePath, "utf8");
    } catch (err) {
      console.warn(`Missing file for ${url}: ${sourcePath}`);
      continue;
    }

    const $ = load(html, { decodeEntities: true });

    const title =
      $("#Subheader h1").first().text().trim() ||
      $("title").first().text().trim() ||
      pathname;

    const $contentRoot =
      $("#Content .the_content.the_content_wrapper").first().length
        ? $("#Content .the_content.the_content_wrapper").first()
        : $("#Content .content").first().length
          ? $("#Content .content").first()
          : $("#Content .container").first();

    // Remove sidebar/widgets/forms/scripts from the captured area.
    $contentRoot
      .find("script, style, noscript, iframe, form, input, textarea, button, select")
      .remove();
    $contentRoot.find(".four.columns, .widget-area, .widget").remove();

    // Rewrite links + images to internal/local paths.
    $contentRoot.find("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      const rewritten = rewriteInternalUrlWithBase(href, url);
      if (rewritten) $(el).attr("href", rewritten);
    });

    $contentRoot.find("img").each((_, el) => {
      const src = $(el).attr("src");
      const dataSrc = $(el).attr("data-src");
      const finalSrc = rewriteAssetUrl(src || dataSrc, url);
      if (finalSrc) $(el).attr("src", finalSrc);
      $(el).removeAttr("srcset");
      $(el).removeAttr("sizes");
      $(el).removeAttr("loading");
    });

    const contentHtml = $contentRoot.html() || "";
    const markdown = turndown.turndown(contentHtml);

    const firstImage =
      $contentRoot.find("img").first().attr("src")?.trim() || null;

    const firstParagraphText =
      $contentRoot.find("p").first().text().trim() ||
      $contentRoot.text().trim();

    pages.push({
      path: pathname,
      type: classifyPage(pathname),
      title,
      excerpt: textExcerpt(firstParagraphText, 180),
      heroImage: firstImage,
      markdown,
      source: {
        url,
        file: path.relative(projectRoot, sourcePath).replaceAll(path.sep, "/"),
      },
    });
  }

  pages.sort((a, b) => a.path.localeCompare(b.path));

  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, `${JSON.stringify({ pages }, null, 2)}\n`, "utf8");

  console.log(`Wrote ${pages.length} pages → ${path.relative(projectRoot, outPath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
