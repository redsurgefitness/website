// src/lib/authors.ts
import { getEntry, type CollectionEntry } from "astro:content";

export async function getAuthor(
  slug?: string,
): Promise<CollectionEntry<"authors"> | undefined> {
  if (!slug) return undefined;
  const author = await getEntry("authors", slug);
  if (!author && import.meta.env.DEV) {
    console.warn(`[authors] No author entry found for slug "${slug}"`);
  }
  return author;
}
