export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-7 w-44 rounded bg-gray-200 animate-pulse" />
        <div className="h-10 w-40 rounded bg-gray-200 animate-pulse" />
      </div>

      <div className="w-full rounded-2xl border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-56 rounded bg-gray-200" />
          <div className="h-10 w-full rounded bg-gray-100" />
          <div className="h-10 w-full rounded bg-gray-100" />
          <div className="h-10 w-3/5 rounded bg-gray-100" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-6 w-64 rounded bg-gray-200 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-48 w-full rounded-xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
