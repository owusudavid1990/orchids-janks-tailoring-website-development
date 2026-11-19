import fs from "fs";
import path from "path";

export interface GalleryPhoto {
  src: string;
  alt: string;
  category: string;
}

export interface GalleryCategory {
  slug: string;
  label: string;
}

const ARCHIVE_DIR = path.join(process.cwd(), "public", "archive");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

/** "peacock-velvet-jacket-lapel-detail.jpg" -> "Peacock Velvet Jacket Lapel Detail" */
function filenameToTitle(filename: string): string {
  const base = filename.replace(path.extname(filename), "");
  return base
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** "garments" -> "Garments" */
function slugToLabel(slug: string): string {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function isImageFile(filename: string): boolean {
  return IMAGE_EXTENSIONS.has(path.extname(filename).toLowerCase());
}

/**
 * Reads every photo out of /public/archive.
 * - Subfolders (e.g. /public/archive/garments) become categories.
 * - Photos placed directly in /public/archive (no subfolder) fall under "General".
 * Drop new photos into any of these folders and they show up automatically —
 * no code changes needed.
 */
export function getGalleryPhotos(): { photos: GalleryPhoto[]; categories: GalleryCategory[] } {
  const photos: GalleryPhoto[] = [];
  const categorySlugs = new Set<string>();

  if (!fs.existsSync(ARCHIVE_DIR)) {
    return { photos: [], categories: [] };
  }

  const entries = fs.readdirSync(ARCHIVE_DIR, { withFileTypes: true });

  // Top-level photos (no subfolder) -> "general" category
  const topLevelFiles = entries
    .filter((e) => e.isFile() && isImageFile(e.name))
    .map((e) => e.name)
    .sort();

  for (const filename of topLevelFiles) {
    photos.push({
      src: `/archive/${filename}`,
      alt: filenameToTitle(filename),
      category: "general",
    });
    categorySlugs.add("general");
  }

  // Subfolders -> categories
  const subfolders = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  for (const folder of subfolders) {
    const folderPath = path.join(ARCHIVE_DIR, folder);
    const files = fs
      .readdirSync(folderPath, { withFileTypes: true })
      .filter((e) => e.isFile() && isImageFile(e.name))
      .map((e) => e.name)
      .sort();

    for (const filename of files) {
      photos.push({
        src: `/archive/${folder}/${filename}`,
        alt: filenameToTitle(filename),
        category: folder,
      });
      categorySlugs.add(folder);
    }
  }

  const categories: GalleryCategory[] = Array.from(categorySlugs).map((slug) => ({
    slug,
    label: slug === "general" ? "General" : slugToLabel(slug),
  }));

  return { photos, categories };
}
