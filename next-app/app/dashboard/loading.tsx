export default function DashboardLoading() {
  return (
    <div className="py-10">
      <div className="h-8 w-64 surface-tint rounded-lg animate-pulse mb-2" />
      <div className="h-4 w-40 surface-tint rounded-lg animate-pulse mb-8" />
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[0, 1, 2].map(i => <div key={i} className="card-base p-5 h-24 animate-pulse" />)}
      </div>
      <div className="h-6 w-40 surface-tint rounded-lg animate-pulse mb-3" />
      <div className="card-base h-64 animate-pulse" />
    </div>
  );
}
