import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div aria-busy="true" aria-label="Carregando conteúdo" className="admin-loading-state">
      <div className="admin-loading-header">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="admin-loading-grid">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton className="h-28" key={index} />
        ))}
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
