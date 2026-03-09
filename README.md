# 🎵 Spotify Web Player Clone

A full-featured **Spotify Web Player clone** built with modern web technologies, featuring OAuth authentication, real-time music playback, and a pixel-perfect recreation of the Spotify UI.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css)
![Spotify API](https://img.shields.io/badge/Spotify-API-1DB954?logo=spotify)

---

## ✨ Features

### 🔐 Authentication
- **Spotify OAuth 2.0** - Secure login with your Spotify account
- **Social Login Buttons** - Google, Facebook, Apple integration (UI ready)
- **Automatic Token Refresh** - Seamless session management
- **NextAuth.js v5** - Modern authentication with beta features

### 🎨 User Interface
- **Pixel-Perfect Design** - Exact replica of Spotify Web Player
- **Responsive 3-Panel Layout** - Sidebar, Main Content, Player Bar
- **Resizable Sidebar** - Adjustable from 72px to 420px
- **Dynamic Backgrounds** - Color extraction from album art
- **Smooth Animations** - Framer Motion powered transitions
- **Skeleton Loading States** - Professional loading indicators
- **Toast Notifications** - Real-time feedback

### 🎵 Music Playback
- **Spotify Web Playback SDK** - Full track playback (Premium required)
- **Playback Controls** - Play, pause, skip, previous, shuffle, repeat
- **Progress Bar** - Seek functionality with time display
- **Volume Control** - Adjustable volume with mute toggle
- **Queue Management** - Drag-and-drop queue reordering
- **Spotify Connect** - Connect to other devices

### 📄 Pages & Views
| Page | Description |
|------|-------------|
| **Home** | Personalized greeting, shortcut tiles, recently played, made for you |
| **Search** | Genre grid, search results with debounced input |
| **Playlist** | Dynamic header, track list, context menus |
| **Album** | Album details with full track listing |
| **Artist** | Hero section, popular tracks, discography |
| **Liked Songs** | Special gradient header, all saved tracks |
| **Settings** | Audio, playback, and display preferences |

### 🧩 Components
- **Music Cards** - Hover effects with play button overlay
- **Track Rows** - Playing indicator, track number, duration
- **Context Menus** - Right-click actions for tracks/playlists
- **Top Bar** - Navigation history, user menu, search
- **Sidebar** - Navigation, playlists library, collapsible sections
- **Now Playing Bar** - Current track info, controls, queue toggle

---

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 16.1.6** - React framework with App Router
- **React 19.2.3** - Latest React with concurrent features
- **TypeScript 5.x** - Type-safe development

### Styling & UI
- **Tailwind CSS 4.x** - Utility-first CSS framework
- **Framer Motion** - Animation library for React
- **Figtree Font** - Spotify's typeface

### State Management
- **Zustand 5.0.11** - Lightweight state management
- **TanStack Query 5.90.21** - Server state management with caching
- **React Query DevTools** - Debugging tools included

### Authentication
- **NextAuth.js 5.0.0-beta.30** - Next-gen authentication
- **@auth/core 0.34.3** - Auth core utilities

### API & Data Fetching
- **Axios 1.13.6** - HTTP client for API requests
- **Spotify Web API** - Real music data integration

### Drag & Drop
- **@dnd-kit/core 6.3.1** - Modern drag-and-drop library
- **@dnd-kit/sortable 10.0.0** - Sortable list utilities
- **@dnd-kit/utilities 3.2.2** - DnD helper functions

### Utilities
- **clsx 2.1.1** - Conditional className utility
- **tailwind-merge 3.5.0** - Tailwind class merging
- **use-debounce 10.1.0** - Debounce hooks
- **react-window 2.2.7** - Virtualized lists for performance
- **colorthief 3.3.1** - Color palette extraction from images
- **react-hot-toast 2.6.0** - Toast notifications

### Development
- **ESLint 9.x** - Code linting
- **Babel Plugin React Compiler** - React compiler optimizations
- **PostCSS 8.x** - CSS processing

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| **Total Dependencies** | 19 |
| **Dev Dependencies** | 8 |
| **React Version** | 19.2.3 |
| **Next.js Version** | 16.1.6 |
| **TypeScript** | 5.x |
| **Tailwind CSS** | 4.x |
| **Build Tool** | Turbopack (Next.js default) |
| **Package Manager** | pnpm |

---

## 📁 Project Structure

```
spotify-clone/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/               # Authentication routes
│   │   │   └── login/            # Login page
│   │   ├── (main)/               # Main application routes
│   │   │   ├── page.tsx          # Home page
│   │   │   ├── search/           # Search page
│   │   │   ├── playlist/         # Playlist view
│   │   │   ├── album/            # Album view
│   │   │   ├── artist/           # Artist view
│   │   │   └── liked/            # Liked songs
│   │   ├── api/                  # API routes
│   │   │   ├── auth/             # NextAuth endpoints
│   │   │   └── spotify/          # Spotify API proxy
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles & tokens
│   │
│   ├── components/
│   │   ├── layout/               # Layout components
│   │   │   ├── Sidebar.tsx       # Navigation sidebar
│   │   │   ├── TopBar.tsx        # Top navigation
│   │   │   └── NowPlayingBar.tsx # Player bar
│   │   ├── player/               # Player components
│   │   │   ├── PlayButton.tsx    # Play/pause control
│   │   │   ├── ProgressBar.tsx   # Seek bar
│   │   │   ├── VolumeControl.tsx # Volume slider
│   │   │   └── QueuePanel.tsx    # Queue drawer
│   │   ├── content/              # Content components
│   │   │   ├── MusicCard.tsx     # Album/playlist cards
│   │   │   ├── TrackRow.tsx      # Track list items
│   │   │   └── SectionGrid.tsx   # Content sections
│   │   ├── search/               # Search components
│   │   │   ├── SearchBar.tsx     # Search input
│   │   │   └── GenreCard.tsx     # Genre tiles
│   │   ├── queue/                # Queue components
│   │   │   └── QueueItem.tsx     # Draggable queue items
│   │   ├── ui/                   # Reusable UI
│   │   │   ├── Button.tsx        # Button variants
│   │   │   ├── Skeleton.tsx      # Loading skeletons
│   │   │   └── Toast.tsx         # Toast notifications
│   │   └── providers/            # React providers
│   │       ├── QueryProvider.tsx # TanStack Query
│   │       └── ThemeProvider.tsx # Theme context
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useSpotify.ts         # Spotify API hook
│   │   ├── usePlayer.ts          # Player state hook
│   │   ├── useDebounce.ts        # Debounce utility
│   │   └── useLocalStorage.ts    # LocalStorage hook
│   │
│   ├── store/                    # Zustand stores
│   │   ├── playerStore.ts        # Player state
│   │   ├── queueStore.ts         # Queue state
│   │   └── uiStore.ts            # UI state
│   │
│   ├── services/                 # API services
│   │   ├── spotify.ts            # Spotify API client
│   │   └── auth.ts               # Auth utilities
│   │
│   ├── lib/                      # Utilities
│   │   ├── utils.ts              # Helper functions
│   │   └── constants.ts          # App constants
│   │
│   └── types/                    # TypeScript types
│       ├── spotify.ts            # Spotify API types
│       └── index.ts              # Type exports
│
├── public/                       # Static assets
├── .env.local                    # Environment variables
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

---

## ⚙️ Configuration

### TypeScript (`tsconfig.json`)
```json
{
  "target": "ES2017",
  "strict": true,
  "moduleResolution": "bundler",
  "paths": { "@/*": ["./src/*"] }
}
```

### Tailwind Theme (`tailwind.config.ts`)
| Color Token | Value | Usage |
|-------------|-------|-------|
| `spotify-green` | #1DB954 | Primary buttons, play icons |
| `spotify-green-hover` | #1ED760 | Hover states |
| `spotify-black` | #121212 | Main background |
| `spotify-card` | #181818 | Card backgrounds |
| `spotify-card-hover` | #282828 | Card hover states |
| `spotify-elevated` | #242424 | Elevated surfaces |
| `spotify-white` | #FFFFFF | Text color |
| `spotify-subdued` | #A7A7A7 | Secondary text |

### Next.js Image Domains (`next.config.ts`)
Configured for Spotify CDN images:
- `i.scdn.co` - Album/artist images
- `mosaic.scdn.co` - Playlist mosaics
- `t.scdn.co` - Artist images
- `p.scdn.co` - Profile images
- And 8 more domains

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** installed
- **pnpm** package manager (`npm install -g pnpm`)
- **Spotify account** (Premium required for playback)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd spotify-clone
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the project root:
```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=Sp0t1fy-Cl0n3-S3cr3t-K3y-2026-X9mP4qR7

# Spotify OAuth
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
```

4. **Configure Spotify OAuth**

   a. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   
   b. Create a new app with:
      - **App Name**: Spotify Clone
      - **Redirect URI**: `http://localhost:3000/api/auth/callback/spotify`
   
   c. Copy **Client ID** and **Client Secret** to `.env.local`

5. **Run the development server**
```bash
pnpm run dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start development server on port 3000 |
| `pnpm run build` | Build production bundle |
| `pnpm run start` | Start production server |
| `pnpm run lint` | Run ESLint code analysis |

---

## 🎨 Design System

### Typography
- **Font Family**: Figtree (Google Fonts)
- **Base Size**: 16px
- **Scale**: 12, 14, 16, 18, 20, 24, 32, 48, 64, 96

### Spacing
- **Base Unit**: 4px
- **Scale**: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

### Border Radius
- **Small**: 2px, 4px
- **Medium**: 8px, 12px
- **Large**: 16px
- **Full**: 9999px (pills, circles)

### Animations
- **Playing Bars**: 3-bar animation for now playing indicator
- **Shimmer**: Skeleton loading effect
- **Toast Slide**: Notification entrance
- **Fade/Scale**: Modal and overlay transitions

### Transitions
- **Fast**: 0.1s
- **Normal**: 0.2s
- **Slow**: 0.3s
- **Slower**: 0.4s

---

## ⚠️ Important Notes

### Spotify Premium Required
> The **Spotify Web Playback SDK** only works with **Spotify Premium** accounts. Free accounts can browse content but cannot play music.

### Localhost Development
This is a development setup. For production:
1. Update `NEXTAUTH_URL` to your production domain
2. Add production URL to Spotify App redirect URIs
3. Generate new secret: `openssl rand -base64 32`

### Rate Limiting
Spotify API has rate limits (~180 requests per 30 seconds). If you encounter 429 errors, wait a few minutes before retrying.

### Browser Compatibility
- Chrome 90+
- Firefox 89+
- Safari 14+
- Edge 90+

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Login redirect loop | Verify Redirect URI matches exactly in Spotify Dashboard |
| No sound/playback fails | Spotify Premium required for Web Playback SDK |
| Build errors | Delete `.next` folder and run `pnpm run build` |
| Missing dependencies | Run `pnpm install` to reinstall all packages |
| 401 Unauthorized | Check `.env.local` has valid Spotify credentials |

---

## 📦 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables for Production
```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<generate-new-secret>
SPOTIFY_CLIENT_ID=<your-client-id>
SPOTIFY_CLIENT_SECRET=<your-client-secret>
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=<your-client-id>
```

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Zustand Documentation](https://zustand-demo.pmnd.rs)
- [TanStack Query Documentation](https://tanstack.com/query)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is for educational purposes only. Spotify and its logo are trademarks of Spotify AB.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Powered by [Spotify API](https://developer.spotify.com)
- Auth by [NextAuth.js](https://next-auth.js.org)

---

**Made with ❤️ and lots of ☕**
