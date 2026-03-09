/**
 * Search Page Skeleton Loading State
 */

export function SearchSkeleton() {
  return (
    <div className="p-6 animate-pulse">
      {/* Top Result + Songs Skeleton */}
      <div className="grid grid-cols-[1.5fr_1fr] gap-6 mb-8">
        {/* Top Result Card Skeleton */}
        <div className="bg-[#181818] rounded-[8px] p-6">
          <div className="flex items-end gap-6">
            <div className="w-[92px] h-[92px] bg-[#282828] rounded" />
            <div className="flex-1">
              <div className="h-3 w-16 bg-[#282828] rounded mb-2" />
              <div className="h-8 w-3/4 bg-[#282828] rounded mb-2" />
              <div className="h-4 w-1/2 bg-[#282828] rounded" />
            </div>
          </div>
        </div>

        {/* Songs List Skeleton */}
        <div>
          <div className="h-5 w-20 bg-[#282828] rounded mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <div className="w-10 h-10 bg-[#282828] rounded" />
                <div className="flex-1">
                  <div className="h-4 w-3/4 bg-[#282828] rounded mb-1" />
                  <div className="h-3 w-1/2 bg-[#282828] rounded" />
                </div>
                <div className="w-10 h-4 bg-[#282828] rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Artists Section Skeleton */}
      <div className="mb-8">
        <div className="h-5 w-24 bg-[#282828] rounded mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-[#181818] p-4 rounded">
              <div className="w-full aspect-square bg-[#282828] rounded-full mb-4" />
              <div className="h-4 w-3/4 bg-[#282828] rounded mb-2" />
              <div className="h-3 w-1/2 bg-[#282828] rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Albums Section Skeleton */}
      <div className="mb-8">
        <div className="h-5 w-20 bg-[#282828] rounded mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-[#181818] p-4 rounded">
              <div className="w-full aspect-square bg-[#282828] rounded mb-4" />
              <div className="h-4 w-3/4 bg-[#282828] rounded mb-2" />
              <div className="h-3 w-1/2 bg-[#282828] rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Playlists Section Skeleton */}
      <div className="mb-8">
        <div className="h-5 w-24 bg-[#282828] rounded mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-[#181818] p-4 rounded">
              <div className="w-full aspect-square bg-[#282828] rounded mb-4" />
              <div className="h-4 w-3/4 bg-[#282828] rounded mb-2" />
              <div className="h-3 w-1/2 bg-[#282828] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
