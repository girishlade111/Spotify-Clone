'use client';

export function MobileGuard() {
  return (
    <div className="mobile-guard-overlay">
      {/* Spotify Logo */}
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20 text-white mb-8">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>

      <h1 className="text-2xl font-bold text-white mb-4">
        For the best experience, use Spotify on desktop
      </h1>

      <p className="text-[#A7A7A7] text-base mb-8 max-w-md">
        The Spotify Web Player is optimized for desktop browsers. Download the mobile app for the best experience on your phone or tablet.
      </p>

      <div className="flex gap-4">
        {/* App Store Button */}
        <a
          href="https://apps.apple.com/app/spotify-music/id324684580"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-6 py-3 bg-white text-black rounded-full hover:scale-105 transition-transform font-medium"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          <div className="text-left">
            <div className="text-xs">Download on the</div>
            <div className="text-lg font-semibold">App Store</div>
          </div>
        </a>

        {/* Google Play Button */}
        <a
          href="https://play.google.com/store/apps/details?id=com.spotify.music"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-6 py-3 bg-white text-black rounded-full hover:scale-105 transition-transform font-medium"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.428-.175A.994.994 0 013 21.318V2.682a.994.994 0 01.182-.507.996.996 0 01.427-.175zm1.86 1.155l7.53 7.53-7.53 7.53V2.97zm9.47 1.545L22.314 12l-7.375 7.486-7.068-7.486 7.068-7.486z" />
          </svg>
          <div className="text-left">
            <div className="text-xs">Get it on</div>
            <div className="text-lg font-semibold">Google Play</div>
          </div>
        </a>
      </div>
    </div>
  );
}
