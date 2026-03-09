# Spotify Clone

A full-featured Spotify Web Player clone built with modern web technologies. This project replicates the core functionality of Spotify's web player, providing an authentic music streaming experience with a modern UI.

---

## Table of Contents

- [✨ Features](#-features)
- [🛠️ Development Stack](#️-development-stack)
- [📋 Prerequisites](#-prerequisites)
- [🚀 Installation](#-installation)
- [⚙️ Configuration](#-⚙️-configuration)
- [📁 Project Structure](#-project-structure)
- [🔧 Available Scripts](#-available-scripts)
- [📊 Project Stats](#-project-stats)
- [🤝 Contributing](#-contributing)

---

## ✨ Features

### Core Functionality
- **🎵 Music Playback** — Full audio playback with play, pause, skip, seek, and volume controls
- **📋 Playlist Management** — Create, edit, and manage custom playlists
- **🔍 Search** — Search for tracks, artists, albums, and playlists
- **❤️ Library** — Save favorite tracks and access your liked songs
- **🎧 Device Management** — Connect and control playback across multiple devices

### User Experience
- **🎨 Spotify-Accurate UI** — Pixel-perfect recreation of the Spotify Web Player interface
- **🌙 Dark Theme** — Authentic Spotify dark theme with exact color codes
- **✨ Smooth Animations** — Fluid transitions and micro-interactions using Framer Motion
- **📱 Responsive Design** — Fully responsive layout for all screen sizes

### Technical Features
- **🔐 Authentication** — Secure OAuth 2.0 authentication with NextAuth.js
- **🌐 Spotify Web API Integration** — Full integration with Spotify's REST API
- **⚡ Real-time Playback State** — Live sync of playback state across components
- **💾 State Management** — Efficient global state management with Zustand
- **🔄 Data Fetching** — Optimized API queries with TanStack React Query

---

## 🛠️ Development Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | ^19.2.3 | UI Framework |
| **Next.js** | 16.1.6 | Full-stack React Framework |
| **TypeScript** | ^5.9.3 | Type Safety |
| **Tailwind CSS** | ^4.2.1 | Styling |
| **Framer Motion** | ^12.35.1 | Animations |

### State & Data Management
| Technology | Version | Purpose |
|------------|---------|---------|
| **Zustand** | ^5.0.11 | Global State Management |
| **TanStack Query** | ^5.90.21 | Server State Management |
| **NextAuth.js** | 5.0.0-beta.30 | Authentication |

### Utilities
| Technology | Version | Purpose |
|------------|---------|---------|
| **Axios** | ^1.13.6 | HTTP Client |
| **clsx** | ^2.1.1 | Conditional Classes |
| **tailwind-merge** | ^3.5.0 | Tailwind Class Merging |
| **react-hot-toast** | ^2.6.0 | Toast Notifications |
| **react-window** | ^2.2.7 | Virtualized Lists |
| **ColorThief** | ^3.3.1 | Color Extraction |

### Development Tools
| Technology | Version | Purpose |
|------------|---------|---------|
| **ESLint** | ^9.39.4 | Code Linting |
| **Babel Plugin RC** | ^1.0.0 | React Compiler |
| **@types/** | Latest | TypeScript Definitions |

---

## 📋 Prerequisites

Before running the project, ensure you have:

- **Node.js** — Version 18.x or higher
- **npm** — Version 8.x or higher (comes with Node.js)
- **Spotify Developer Account** — To obtain API credentials
- **Git** — For version control

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd spotify-clone
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Spotify API Credentials
# Get these from https://developer.spotify.com/dashboard
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# NextAuth Configuration
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Spotify Redirect URIs
# Must match exactly in Spotify Developer Dashboard
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback/spotify
```

### 4. Configure Spotify Developer Dashboard

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Add `http://localhost:3000/api/auth/callback/spotify` to **Redirect URIs**
4. Copy your **Client ID** and **Client Secret**

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SPOTIFY_CLIENT_ID` | ✅ | Spotify API Client ID |
| `SPOTIFY_CLIENT_SECRET` | ✅ | Spotify API Client Secret |
| `NEXTAUTH_SECRET` | ✅ | Secret for NextAuth.js encryption |
| `NEXTAUTH_URL` | ✅ | Base URL for the application |
| `SPOTIFY_REDIRECT_URI` | ✅ | OAuth callback URL |

### Tailwind CSS Configuration

The project uses **Tailwind CSS v4** with a custom configuration in `globals.css`:

- **Custom Color Palette** — Spotify brand colors and UI colors
- **CSS Variables** — Consistent theming across the application
- **Custom Animations** — Equalizer bars, shimmer loading effects

### TypeScript Configuration

Strict mode enabled with the following path aliases:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 📁 Project Structure

```
spotify-clone/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Authentication routes
│   │   │   └── login/          # Login page
│   │   ├── api/                # API routes
│   │   │   └── auth/           # NextAuth.js routes
│   │   ├── globals.css         # Global styles & Tailwind
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # React components
│   │   └── providers/          # Context providers
│   ├── hooks/                  # Custom React hooks
│   │   └── useAuth.ts          # Authentication hook
│   ├── lib/                    # Utility libraries
│   │   └── auth.ts             # NextAuth configuration
│   ├── types/                  # TypeScript type definitions
│   │   ├── next-auth/          # NextAuth types
│   │   ├── player.ts           # Player types
│   │   ├── spotify.ts          # Spotify API types
│   │   └── ui.ts               # UI types
│   └── store/                  # Zustand stores
├── public/                     # Static assets
├── .env.local                  # Environment variables
├── package.json                # Dependencies
└── README.md                   # This file
```

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build the production application |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |

---

## 📊 Project Stats

### Dependencies Summary

- **Total Dependencies**: 17
- **Development Dependencies**: 9
- **Total Packages**: 26

### Key Metrics

| Metric | Value |
|--------|-------|
| **Framework** | Next.js 16.1.6 |
| **React Version** | 19.2.3 |
| **TypeScript** | 5.9.3 |
| **Tailwind CSS** | 4.2.1 |
| **Node Support** | 18.x+ |

### Bundle Analysis

- **Zero-config deployment** with Next.js
- **Automatic code splitting** via Next.js
- **Tree-shaking** enabled for production builds

---

## 🎯 Current Status

> **Part 1 Complete** — Foundation & Authentication

This project is actively under development. The following milestones have been completed:

- [x] Project setup with Next.js 16 and React 19
- [x] Tailwind CSS v4 configuration with custom theme
- [x] NextAuth.js integration with Spotify Provider
- [x] TypeScript type definitions for Spotify API
- [x] Authentication flow implementation

### Upcoming Features

- [ ] Full music player component
- [ ] Playlist management
- [ ] Search functionality
- [ ] Library management
- [ ] Real-time playback controls

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is for educational purposes. All Spotify trademarks and copyrights belong to Spotify AB.

---

## 🙏 Acknowledgments

- [Spotify](https://www.spotify.com) — For the inspiration and API
- [NextAuth.js](https://next-auth.js.org) — For authentication
- [Tailwind CSS](https://tailwindcss.com) — For styling
- [Framer](https://www.framer.com) — For animations

---

**Built with ❤️ using Next.js, React, and Tailwind CSS**
