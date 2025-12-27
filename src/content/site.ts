import pagesData from "./pages.json";

export type PageType =
  | "home"
  | "products_index"
  | "product"
  | "applications_index"
  | "application"
  | "attachment"
  | "page";

export type PageEntry = {
  path: string;
  type: PageType;
  title: string;
  excerpt: string;
  heroImage: string | null;
  markdown: string;
  source: {
    url: string;
    file: string;
  };
};

const pages = pagesData.pages as PageEntry[];

const pagesByPath = new Map(pages.map((p) => [p.path, p]));

export function getAllPages() {
  return pages;
}

export function getPageByPath(pagePath: string) {
  return pagesByPath.get(pagePath) ?? null;
}

export function getProducts() {
  return pages.filter((p) => p.type === "product");
}

export function getApplications() {
  return pages.filter((p) => p.type === "application");
}

export function getAttachments() {
  return pages.filter((p) => p.type === "attachment");
}

export function getStaticPagePaths() {
  return pages.map((p) => p.path);
}

