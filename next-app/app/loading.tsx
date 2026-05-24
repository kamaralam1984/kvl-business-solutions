export default function RootLoading() {
  return (
    <div className="min-h-[70vh] grid place-items-center p-4">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-tint border-t-primary animate-spin" />
        <div className="text-xs text-text2 tracking-[3px] uppercase">Loading</div>
      </div>
    </div>
  );
}
