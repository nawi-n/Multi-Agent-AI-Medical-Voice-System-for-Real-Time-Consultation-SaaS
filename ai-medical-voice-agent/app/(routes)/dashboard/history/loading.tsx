export default function LoadingHistory() {
  return (
    <div className="space-y-6">
      <div className="h-7 w-56 rounded bg-gray-200 animate-pulse" />
      <div className="w-full rounded-2xl border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-56 rounded bg-gray-200" />
          <div className="h-10 w-full rounded bg-gray-100" />
          <div className="h-10 w-full rounded bg-gray-100" />
          <div className="h-10 w-3/5 rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
