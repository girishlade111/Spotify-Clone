# Spotify Web Player Clone - Setup Instructions

## ✅ Application Status
The Spotify Web Player Clone is now **fully functional** and running!

## 🚀 How to Access

1. **Open your browser** and navigate to: **http://localhost:3000**

2. You will be redirected to the **Login Page**

3. To use the app with real Spotify data, you need to configure Spotify OAuth:

## 🔑 Spotify API Configuration

### Step 1: Create a Spotify App
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create App"
4. Fill in:
   - **App Name**: Spotify Clone
   - **App Description**: A Spotify Web Player Clone
   - **Redirect URI**: `http://localhost:3000/api/auth/callback/spotify`
   - **Website**: (optional)
   - Check the boxes for terms and policies
5. Click "Save"
6. Copy your **Client ID** and **Client Secret**

### Step 2: Update Environment Variables
Edit the `.env.local` file in the project root:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=Sp0t1fy-Cl0n3-S3cr3t-K3y-2026-X9mP4qR7
SPOTIFY_CLIENT_ID=YOUR_CLIENT_ID_HERE
SPOTIFY_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=YOUR_CLIENT_ID_HERE
```

Replace `YOUR_CLIENT_ID_HERE` and `YOUR_CLIENT_SECRET_HERE` with your actual Spotify credentials.

### Step 3: Restart the Server
After updating `.env.local`, restart the dev server:

```bash
# Stop the current server (Ctrl+C in terminal)
pnpm run dev
```

## 📁 Project Structure

```
spotify-clone/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Authentication pages (login)
│   │   ├── (main)/          # Main app pages (home, search, playlist, etc.)
│   │   ├── api/             # API routes (NextAuth, Spotify)
│   │   ├── layout.tsx       # Root layout
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── layout/          # Sidebar, TopBar, etc.
│   │   ├── player/          # NowPlayingBar, controls, etc.
│   │   ├── content/         # Music cards, track lists
│   │   ├── search/          # Search components
│   │   ├── queue/           # Queue panel
│   │   ├── ui/              # Reusable UI components
│   │   └── providers/       # React providers
│   ├── hooks/               # Custom React hooks
│   ├── store/               # Zustand stores
│   ├── services/            # API services
│   ├── lib/                 # Utilities
│   └── types/               # TypeScript types
```

## 🎵 Features

### Authentication
- ✅ Spotify OAuth login
- ✅ Social login buttons (Google, Facebook, Apple)
- ✅ Automatic token refresh
- ✅ Session management

### Main Layout
- ✅ 3-panel responsive grid
- ✅ Resizable sidebar (72px - 420px)
- ✅ Sticky top navigation
- ✅ Fixed Now Playing bar (72px)

### Pages
- ✅ **Home** - Greeting, shortcut tiles, content sections
- ✅ **Search** - Genre grid, search results
- ✅ **Playlist** - Dynamic background, track list
- ✅ **Album** - Album view with tracks
- ✅ **Artist** - Hero section, popular tracks
- ✅ **Liked Songs** - Special gradient header
- ✅ **Settings** - Audio, playback, display settings

### Player
- ✅ Spotify Web Playback SDK
- ✅ Play/pause, skip, shuffle, repeat
- ✅ Progress bar with seek
- ✅ Volume control
- ✅ Queue panel with drag-and-drop

### UI Components
- ✅ Music cards with hover effects
- ✅ Track rows with playing indicator
- ✅ Context menus
- ✅ Skeleton loading states
- ✅ Toast notifications

## 🛠️ Development Commands

```bash
# Start development server
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm run start

# Run linter
pnpm run lint
```

## 🎨 Design Tokens

All Spotify design tokens are configured in `globals.css` and `tailwind.config.ts`:

- **Colors**: #121212 (bg), #1DB954 (green), #FFFFFF (text), etc.
- **Typography**: Figtree font family
- **Spacing**: 4px base unit
- **Border Radius**: 2px - 9999px
- **Transitions**: 0.1s - 0.4s

## ⚠️ Important Notes

1. **Spotify Premium Required**: The Web Playback SDK only works with Premium accounts. Free accounts can browse but not play music.

2. **Localhost Only**: This is a development setup. For production deployment, you'll need to:
   - Update `NEXTAUTH_URL` to your production domain
   - Add production URL to Spotify App redirect URIs
   - Generate a new `NEXTAUTH_SECRET` using `openssl rand -base64 32`

3. **Rate Limiting**: Spotify API has rate limits. If you see 429 errors, wait a few minutes.

## 🐛 Troubleshooting

### "Application not found" error
- Make sure you're accessing `http://localhost:3000` (not 3001 or other ports)
- Check that the dev server is running

### Login redirect loop
- Verify your Redirect URI in Spotify Dashboard matches exactly: `http://localhost:3000/api/auth/callback/spotify`
- Check `.env.local` has correct credentials

### No sound / playback not working
- You need Spotify Premium for Web Playback SDK
- Check browser console for errors
- Try connecting to a different device (Spotify Connect)

### Build errors
- Run `pnpm install` to ensure all dependencies are installed
- Delete `.next` folder and rebuild: `pnpm run build`

## 📞 Support

For issues or questions, check:
- Next.js Documentation: https://nextjs.org/docs
- NextAuth.js Documentation: https://next-auth.js.org
- Spotify Web API: https://developer.spotify.com/documentation/web-api
