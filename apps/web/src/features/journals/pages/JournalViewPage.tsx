import { Navigate, useParams } from "react-router-dom";

export default function JournalViewPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <Navigate
      to={id ? `/journals/${id}/edit` : "/journals"}
      replace
    />
  );
}
