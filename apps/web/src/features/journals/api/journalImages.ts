import api from "@/api/api";
import type { JournalImage, Paginated } from "@/features/journals/types";
import { unwrapOne } from "@/lib/http";
import { unwrapPaginated } from "@/lib/http/unwrapPaginated";

export async function fetchJournalImages(
  journalId: number,
  page: number,
  signal?: AbortSignal
): Promise<Paginated<JournalImage>> {
  const response = await api.get(`/journals/${journalId}/images`, {
    params: { page, per_page: 24 },
    signal,
  });
  return unwrapPaginated<JournalImage>(response.data);
}

export async function fetchGalleryImages(
  page: number,
  signal?: AbortSignal
): Promise<Paginated<JournalImage>> {
  const response = await api.get("/gallery-images", {
    params: { page, per_page: 24 },
    signal,
  });
  return unwrapPaginated<JournalImage>(response.data);
}

export async function fetchJournalImage(
  imageId: number,
  signal?: AbortSignal
): Promise<JournalImage> {
  const response = await api.get(`/journal-images/${imageId}`, { signal });
  return unwrapOne<JournalImage>(response.data);
}

export async function uploadJournalImage(
  journalId: number,
  image: File
): Promise<JournalImage> {
  const form = new FormData();
  form.append("image", image);

  const response = await api.post(`/journals/${journalId}/images`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrapOne<JournalImage>(response.data);
}

export async function deleteJournalImage(imageId: number): Promise<void> {
  await api.delete(`/journal-images/${imageId}`);
}
