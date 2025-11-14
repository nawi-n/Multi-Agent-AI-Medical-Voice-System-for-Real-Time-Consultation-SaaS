export default function LoadingCall() {
  return (
    <div className="p-5 border rounded-3xl bg-secondary">
      <div className="flex justify-between items-center">
        <div className="h-8 w-40 rounded bg-gray-200 animate-pulse" />
        <div className="h-6 w-20 rounded bg-gray-200 animate-pulse" />
      </div>

      <div className="flex items-center flex-col mt-10">
        <div className="h-[100px] w-[100px] rounded-full bg-gray-200 animate-pulse" />
        <div className="mt-3 h-5 w-40 rounded bg-gray-200 animate-pulse" />
        <div className="mt-1 h-4 w-52 rounded bg-gray-100 animate-pulse" />

        <div className="mt-10 w-full max-w-lg rounded-xl px-6 py-6 border bg-white/60 backdrop-blur-sm">
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="h-10 w-full rounded bg-gray-100" />
          </div>
        </div>

        <div className="mt-16 h-10 w-36 rounded bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}
