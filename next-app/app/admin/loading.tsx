export default function AdminLoading() {
  return (
    <div>
      <div className="h-8 w-48 surface-tint rounded-lg animate-pulse mb-4" />
      <div className="card-base">
        {[0,1,2,3,4,5].map(i => (
          <div key={i} className="grid grid-cols-5 gap-3 p-3 border-b border-tint">
            <div className="h-4 surface-tint rounded animate-pulse" />
            <div className="h-4 surface-tint rounded animate-pulse" />
            <div className="h-4 surface-tint rounded animate-pulse" />
            <div className="h-4 surface-tint rounded animate-pulse" />
            <div className="h-4 surface-tint rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
