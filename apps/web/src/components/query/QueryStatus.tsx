import { memo } from "react";

type Props = {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  onRetry?: () => void;

  loadingText?: string;
  emptyText?: string; // optional for list pages
  isEmpty?: boolean;  // optional for list pages
};

export const QueryStatus = memo(function QueryStatus({
  isLoading,
  isError,
  errorMessage,
  onRetry,
  loadingText = "Loading…",
  emptyText = "Nothing here yet.",
  isEmpty = false,
}: Props) {
  if (isLoading) {
    return <p style={{ margin: 0, opacity: 0.75 }}>{loadingText}</p>;
  }

  if (isError) {
    return (
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <p style={{ margin: 0, color: "#cc0000", fontWeight: 600 }}>
          {errorMessage ?? "Request failed."}
        </p>
        {onRetry ? (
          <button type="button" onClick={onRetry}>
            Retry
          </button>
        ) : null}
      </div>
    );
  }

  if (isEmpty) {
    return <p style={{ margin: 0, opacity: 0.75 }}>{emptyText}</p>;
  }

  return null;
});