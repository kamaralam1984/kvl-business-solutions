export function AdminSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="admin-skeleton" style={{ width: `${85 - i * 12}%` }} />
      ))}
    </div>
  );
}
