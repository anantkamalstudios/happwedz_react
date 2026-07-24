// One-off image optimizer: recompress oversized raster images IN PLACE,
// keeping the same filename + format so no code references need to change.
import sharp from "sharp";
import { readdir, stat, rename, unlink } from "node:fs/promises";
import path from "node:path";

const ROOTS = ["public/images", "src/assets"];
const MIN_BYTES = 200 * 1024; // only touch files bigger than this
const MAX_DIM = 1920; // cap the longest side
const JPEG_Q = 78;
const PNG_Q = 80;

const exts = new Set([".jpg", ".jpeg", ".png"]);
let totalBefore = 0,
  totalAfter = 0,
  count = 0;
const rows = [];

async function walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full);
    else if (exts.has(path.extname(e.name).toLowerCase())) await optimize(full);
  }
}

async function optimize(file) {
  const before = (await stat(file)).size;
  if (before < MIN_BYTES) return;

  const ext = path.extname(file).toLowerCase();
  const img = sharp(file, { failOn: "none" });
  const meta = await img.metadata();

  let pipeline = img.rotate(); // respect EXIF orientation
  if (meta.width && meta.height && Math.max(meta.width, meta.height) > MAX_DIM) {
    pipeline = pipeline.resize({
      width: meta.width >= meta.height ? MAX_DIM : undefined,
      height: meta.height > meta.width ? MAX_DIM : undefined,
      withoutEnlargement: true,
    });
  }

  if (ext === ".png") {
    pipeline = pipeline.png({ quality: PNG_Q, compressionLevel: 9, effort: 8, palette: true });
  } else {
    pipeline = pipeline.jpeg({ quality: JPEG_Q, mozjpeg: true });
  }

  const tmp = file + ".opt";
  await pipeline.toFile(tmp);
  const after = (await stat(tmp)).size;

  // Only keep the optimized version if it's actually smaller.
  if (after < before) {
    await unlink(file);
    await rename(tmp, file);
    totalBefore += before;
    totalAfter += after;
    count++;
    rows.push({ file: path.relative(".", file), before, after });
  } else {
    await unlink(tmp);
  }
}

const kb = (b) => (b / 1024).toFixed(0) + " KB";
for (const r of ROOTS) await walk(r);
rows.sort((a, b) => b.before - a.before);
for (const r of rows)
  console.log(`${kb(r.before).padStart(9)} -> ${kb(r.after).padStart(9)}  (${((1 - r.after / r.before) * 100).toFixed(0)}%)  ${r.file}`);
console.log("\n" + "=".repeat(50));
console.log(`Optimized ${count} files`);
console.log(`Total: ${(totalBefore / 1048576).toFixed(1)} MB -> ${(totalAfter / 1048576).toFixed(1)} MB  (saved ${((totalBefore - totalAfter) / 1048576).toFixed(1)} MB)`);
