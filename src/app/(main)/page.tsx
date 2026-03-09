/**
 * Home Page
 */

export default function HomePage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Good afternoon</h1>
      
      {/* Content placeholder */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Placeholder cards */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#181818] rounded-[4px] p-4 hover:bg-[#282828] transition-colors cursor-pointer"
          >
            <div className="w-full aspect-square bg-[#282828] rounded-[4px] mb-4" />
            <div className="h-4 bg-[#282828] rounded-[2px] mb-2" />
            <div className="h-3 bg-[#282828] rounded-[2px] w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
