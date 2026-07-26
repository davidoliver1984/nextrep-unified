function getExt(filename: string): string {
  const i = filename.lastIndexOf(".");
  if (i === -1) return "";
  return filename.slice(i + 1).toLowerCase();
}

function hasAllowedExtension(filename: string, allowed: string[]): boolean {
  const ext = getExt(filename);
  return allowed.map((value) => value.toLowerCase()).includes(ext);
}

function isImageMime(file: File): boolean {
  return file.type.startsWith("image/");
}

export function isValidImageFile(
  file: File,
  opts: { maxBytes: number; allowedExts: string[] }
): { ok: true } | { ok: false; message: string } {
  if (!isImageMime(file)) {
    return { ok: false, message: "File must be an image." };
  }
  if (!hasAllowedExtension(file.name, opts.allowedExts)) {
    return { ok: false, message: `Allowed: ${opts.allowedExts.join(", ")}` };
  }
  if (file.size > opts.maxBytes) {
    return { ok: false, message: "File is too large." };
  }
  return { ok: true };
}
