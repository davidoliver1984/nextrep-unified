import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useJournalsQuery } from "@/features/journals/query/useJournalsQuery";
import { useDeleteJournal } from "@/features/journals/query/useDeleteJournal";
import { toAppError } from "@/lib/http";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/Button";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { toast } from "@/components/toast/toast.store";

function excerpt(text: string, max = 55) {
  const t = text.trim();
  return t.length <= max ? t : t.slice(0, max).trimEnd() + "…";
}

export default function JournalsListPage() {
  const [page, setPage] = useState(1);
  const [journalToDelete, setJournalToDelete] = useState<number | null>(null);

  const perPage = 10; // or make selectable later
  const query = useJournalsQuery({ page, perPage });
  const deleteJournal = useDeleteJournal();

  async function confirmDeleteJournal() {
    if (journalToDelete == null) return;

    try {
      await deleteJournal.mutateAsync(journalToDelete);
      toast.success("Journal deleted");
      setJournalToDelete(null);
    } catch (err) {
      toast.error("Delete failed", toAppError(err).message);
    }
  }

  const rows = query.data?.data ?? [];
  const meta = query.data?.meta;

  const pageCount = meta?.last_page ?? 1;
  const canPrev = page > 1;
  const canNext = page < pageCount;

  // simple page window (keeps pagination tidy)
  const pageWindow = useMemo(() => {
    if (!meta) return [1];
    const start = Math.max(1, meta.current_page - 2);
    const end = Math.min(meta.last_page, meta.current_page + 2);
    const out: number[] = [];
    for (let p = start; p <= end; p++) out.push(p);
    return out;
  }, [meta]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
        <div>
          <h4 className="text-lg font-semibold leading-none">Journal Entries</h4>
          <p className="mt-2 text-sm text-muted-foreground">
            Your daily logs: weight, steps, calories and notes.
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link to="/journals/create">+ Add Entry</Link>
        </Button>
      </div>

      <div className="rounded-xl border bg-card/80">
        <TooltipProvider delayDuration={150}>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-[90px]">ID</TableHead>
                <TableHead className="w-[160px]">Date</TableHead>
                <TableHead className="w-[120px]">Weight</TableHead>
                <TableHead className="w-[140px]">Steps</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-[170px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {query.isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    No journal entries yet.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r, i) => {
                  const notes = r.notes?.trim() || "";
                  return (
                    <TableRow key={r.id} className={i % 2 === 0 ? "bg-muted/20" : "bg-transparent"}>
                      <TableCell className="font-medium">{r.id}</TableCell>
                      <TableCell>{r.date}</TableCell>
                      <TableCell>{r.weight == null ? "—" : Number(r.weight).toFixed(1)}</TableCell>
                      <TableCell>{r.steps == null ? "—" : Number(r.steps).toLocaleString()}</TableCell>

                      <TableCell className="max-w-[520px]">
                        {notes ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help text-muted-foreground">
                                {excerpt(notes)}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[520px]">
                              <p className="text-sm">{notes}</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button asChild variant="secondary" size="sm">
                            <Link to={`/journals/${r.id}/edit`}>Edit</Link>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            type="button"
                            onClick={() => setJournalToDelete(r.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TooltipProvider>
      </div>

      {meta ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            Page {meta.current_page} of {meta.last_page} • {meta.total} total
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => canPrev && setPage((p) => p - 1)}
                  className={!canPrev ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {pageWindow.map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === meta.current_page}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => canNext && setPage((p) => p + 1)}
                  className={!canNext ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}

      <ConfirmDialog
        open={journalToDelete != null}
        title="Delete journal entry?"
        message="This will permanently delete the journal entry and may also remove its attached workouts."
        confirmText="Delete journal"
        danger
        pending={deleteJournal.isPending}
        onConfirm={() => void confirmDeleteJournal()}
        onClose={() => setJournalToDelete(null)}
      />
    </div>
  );
}
