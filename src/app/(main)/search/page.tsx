/**
 * Search Page
 */

export default function SearchPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Browse all</h1>
      
      {/* Genre cards placeholder */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {["Pop", "Hip-Hop", "Rock", "Latin", "Mood", "Indie", "Workout", "Country", "R&B", "Electronic"].map((genre) => (
          <div
            key={genre}
            className="aspect-square rounded-[8px] p-4 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
            style={{
              backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
            }}
          >
            <span className="text-2xl font-bold text-white">{genre}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
