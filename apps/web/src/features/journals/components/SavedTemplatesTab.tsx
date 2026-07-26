import { useState } from "react";
import { ClipboardPlus, Trash2 } from "lucide-react";
import { QueryStatus } from "@/components/query/QueryStatus";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useCreateJournalWorkoutFromTemplate } from "@/features/journals/query/useCreateJournalWorkoutFromTemplate";
import { useDeleteWorkoutTemplate } from "@/features/journals/query/useDeleteWorkoutTemplate";
import { toAppError } from "@/lib/http";
import { useJournalTemplates } from "@/features/journals/query/useJournalTemplates";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/toast/toast.store";

type Props = {
  journalId: number;
  onTemplateApplied?: () => void;
};

export function SavedTemplatesTab({ journalId, onTemplateApplied }: Props) {
  const [templateToDeleteId, setTemplateToDeleteId] = useState<number | null>(null);
  const templatesQuery = useJournalTemplates(journalId);
  const templates = templatesQuery.data ?? [];

  const msg = templatesQuery.isError
    ? toAppError(templatesQuery.error).message
    : null;

  const applyMut = useCreateJournalWorkoutFromTemplate(journalId);
  const deleteMut = useDeleteWorkoutTemplate(journalId);
  const templateToDelete = templates.find((template) => template.id === templateToDeleteId);

  async function handleApplyTemplate(templateId: number) {
    try {
      await applyMut.mutateAsync({ templateId });
      toast.success("Template applied");
      onTemplateApplied?.();
    } catch (err) {
      toast.error("Template failed", toAppError(err).message);
    }
  }

  async function handleDeleteTemplate() {
    if (templateToDeleteId == null) return;

    try {
      await deleteMut.mutateAsync(templateToDeleteId);
      toast.success("Template deleted");
      setTemplateToDeleteId(null);
    } catch (err) {
      toast.error("Delete failed", toAppError(err).message);
    }
  }

  if (templatesQuery.isLoading || templatesQuery.isError) {
    return (
      <QueryStatus
        isLoading={templatesQuery.isLoading}
        isError={templatesQuery.isError}
        errorMessage={msg}
        loadingText="Loading templates…"
        onRetry={() => void templatesQuery.refetch()}
      />
    );
  }

  if (templates.length === 0) {
    return <p className="text-sm text-muted-foreground">No templates available.</p>;
  }

  return (
    <>
      <div className="grid gap-2">
        {templates.map((template) => {
          const isApplying =
            applyMut.isPending && applyMut.variables?.templateId === template.id;

          return (
            <div
              key={template.id}
              className="flex items-center justify-between gap-4 rounded-lg border bg-muted/20 px-4 py-3"
            >
              <span className="min-w-0 truncate font-medium">{template.title}</span>
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  title={`Apply ${template.title}`}
                  aria-label={`Apply ${template.title}`}
                  onClick={() => void handleApplyTemplate(template.id)}
                  disabled={applyMut.isPending || deleteMut.isPending}
                >
                  <ClipboardPlus className={isApplying ? "animate-pulse" : ""} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  title={`Delete ${template.title}`}
                  aria-label={`Delete ${template.title}`}
                  onClick={() => setTemplateToDeleteId(template.id)}
                  disabled={applyMut.isPending || deleteMut.isPending}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        open={templateToDeleteId != null}
        title="Delete template?"
        message={`This will permanently delete${templateToDelete ? ` “${templateToDelete.title}”` : " this template"}.`}
        confirmText="Delete template"
        danger
        pending={deleteMut.isPending}
        onConfirm={() => void handleDeleteTemplate()}
        onClose={() => setTemplateToDeleteId(null)}
      />
    </>
  );
}
