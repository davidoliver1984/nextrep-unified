import api from "@/api/api";

import type { Workout } from "@/features/workouts/types/workout";
import type {
  CreateJournalPayload,
  Journal,
  Paginated,
  UpdateJournalPayload,
} from "@/features/journals/types";
import type { Template } from "@/features/templates/types/template";
import { unwrapOne, unwrapList } from "@/lib/http";
import { unwrapPaginated } from "@/lib/http/unwrapPaginated";

export type FetchJournalsParams = {
  page?: number;
  perPage?: number;
  from?: string;
  to?: string;
};

export async function fetchJournals(
  params: FetchJournalsParams,
  signal?: AbortSignal
): Promise<Paginated<Journal>> {
  const res = await api.get("/journals", {
    params: {
      page: params.page ?? 1,
      per_page: params.perPage ?? 10,
      from: params.from,
      to: params.to,
    },
    signal,
  });

  const { data, meta } = unwrapPaginated<Journal>(res.data);
  return { data, meta };
}

export async function fetchJournalDetail(
  journalId: number,
  signal?: AbortSignal
): Promise<Journal> {
  const res = await api.get(`/journals/${journalId}`, { signal });
  return unwrapOne<Journal>(res.data);
}

export async function fetchJournalWorkouts(
  journalId: number,
  signal?: AbortSignal
): Promise<Workout[]> {
  const res = await api.get(`/workouts`, { params: { journal_id: journalId }, signal });
  return unwrapList<Workout>(res.data);
}

export async function fetchJournalTemplates(
  journalId: number,
  signal?: AbortSignal
): Promise<Template[]> {
  const res = await api.get("/templates", {
    params: { journal_id: journalId },
    signal,
  });
  return unwrapList<Template>(res.data);
}

export async function createJournalWorkoutFromTemplate(templateId: number, journalId: number) {
  const res = await api.post(`/templates/${templateId}/apply`, {
    journal_id: journalId,
  });
  return unwrapOne<Workout>(res.data);
}

export async function deleteWorkoutTemplate(templateId: number): Promise<void> {
  await api.delete(`/templates/${templateId}`);
}

export async function createJournal(
  payload: CreateJournalPayload
): Promise<Journal> {
  const res = await api.post("/journals", payload);
  return unwrapOne<Journal>(res.data);
}

export async function patchJournal(
  id: number,
  payload: UpdateJournalPayload
): Promise<Journal> {
  const res = await api.patch(`/journals/${id}`, payload);
  return unwrapOne<Journal>(res.data);
}

export async function deleteJournal(id: number): Promise<void> {
  await api.delete(`/journals/${id}`);
}
