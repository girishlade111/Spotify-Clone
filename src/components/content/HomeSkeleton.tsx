/**
 * Home Page Skeleton Loading State
 */

export function HomeSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Greeting Skeleton */}
      <div className="h-8 w-48 bg-[#282828] rounded mb-6" />

      {/* Shortcut Tiles Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 bg-[#282828] rounded" />
        ))}
      </div>

      {/* Section 1 Skeleton */}
      <div className="mb-6">
        <div className="h-5 w-32 bg-[#282828] rounded mb-4" />
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

      {/* Section 2 Skeleton */}
      <div className="mb-6">
        <div className="h-5 w-40 bg-[#282828] rounded mb-4" />
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

      {/* Section 3 Skeleton */}
      <div className="mb-6">
        <div className="h-5 w-36 bg-[#282828] rounded mb-4" />
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
