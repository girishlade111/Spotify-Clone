'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  SettingsSection,
  SettingsRow,
  ToggleSwitch,
  SelectControl,
  SliderControl,
} from '@/components/settings/SettingsComponents';
import { showToast } from '@/lib/toasts';

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Português' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'zh', label: '中文' },
];

const QUALITY_OPTIONS = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'very_high', label: 'Very High' },
];

export default function SettingsPage() {
  const { data: session } = useSession();

  // Settings state
  const [streamingQuality, setStreamingQuality] = useState('automatic');
  const [normalizeVolume, setNormalizeVolume] = useState(false);
  const [monoAudio, setMonoAudio] = useState(false);
  const [hardwareAcceleration, setHardwareAcceleration] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [crossfade, setCrossfade] = useState(0);
  const [gaplessPlayback, setGaplessPlayback] = useState(true);
  const [allowExplicit, setAllowExplicit] = useState(true);
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [showAlbumArtNotifications, setShowAlbumArtNotifications] = useState(true);
  const [canvasEnabled, setCanvasEnabled] = useState(true);
  const [shareActivity, setShareActivity] = useState(false);
  const [showRecentlyPlayed, setShowRecentlyPlayed] = useState(true);
  const [privateSession, setPrivateSession] = useState(false);
  const [language, setLanguage] = useState('en');

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('spotify-settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        setStreamingQuality(settings.streamingQuality ?? 'automatic');
        setNormalizeVolume(settings.normalizeVolume ?? false);
        setMonoAudio(settings.monoAudio ?? false);
        setHardwareAcceleration(settings.hardwareAcceleration ?? true);
        setAutoplay(settings.autoplay ?? true);
        setCrossfade(settings.crossfade ?? 0);
        setGaplessPlayback(settings.gaplessPlayback ?? true);
        setAllowExplicit(settings.allowExplicit ?? true);
        setShowUnavailable(settings.showUnavailable ?? false);
        setShowAlbumArtNotifications(settings.showAlbumArtNotifications ?? true);
        setCanvasEnabled(settings.canvasEnabled ?? true);
        setShareActivity(settings.shareActivity ?? false);
        setShowRecentlyPlayed(settings.showRecentlyPlayed ?? true);
        setPrivateSession(settings.privateSession ?? false);
        setLanguage(settings.language ?? 'en');
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  const saveSettings = (updates: Record<string, unknown>) => {
    const current = {
      streamingQuality,
      normalizeVolume,
      monoAudio,
      hardwareAcceleration,
      autoplay,
      crossfade,
      gaplessPlayback,
      allowExplicit,
      showUnavailable,
      showAlbumArtNotifications,
      canvasEnabled,
      shareActivity,
      showRecentlyPlayed,
      privateSession,
      language,
      ...updates,
    };
    localStorage.setItem('spotify-settings', JSON.stringify(current));
  };

  const handleClearBrowsingHistory = () => {
    if (confirm('Are you sure you want to clear your browsing history?')) {
      showToast.success('Browsing history cleared');
    }
  };

  const handleClearCache = () => {
    if (confirm('Are you sure you want to clear the download cache?')) {
      showToast.success('Download cache cleared');
    }
  };

  const handleGoToAccount = () => {
    window.open('https://www.spotify.com/account', '_blank');
  };

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

      {/* Account Section */}
      <SettingsSection title="Account">
        <div className="space-y-4">
          <SettingsRow
            label="Username"
            control={
              <span className="text-white">
                {session?.user?.name || session?.user?.email || 'Unknown'}
              </span>
            }
          />
          {session?.user?.email && (
            <SettingsRow
              label="Email"
              control={<span className="text-[#A7A7A7]">{session.user.email}</span>}
            />
          )}
          <SettingsRow
            label="Plan"
            control={
              <span className="px-3 py-1 bg-[#1DB954] text-black text-sm font-medium rounded-full">
                Spotify Premium
              </span>
            }
          />
        </div>
        <div className="mt-4">
          <button
            onClick={handleGoToAccount}
            className="px-4 py-2 border border-white/30 text-white rounded-full hover:border-white transition-colors text-sm font-medium"
          >
            Go to your account
          </button>
        </div>
      </SettingsSection>

      {/* Audio Quality Section */}
      <SettingsSection title="Audio Quality">
        <SettingsRow
          label="Streaming quality"
          description="Choose the quality of music when streaming"
          control={
            <SelectControl
              value={streamingQuality}
              onChange={(value) => {
                setStreamingQuality(value);
                saveSettings({ streamingQuality: value });
              }}
              options={QUALITY_OPTIONS}
              aria-label="Streaming quality"
            />
          }
        />
        <SettingsRow
          label="Normalize volume"
          description="Adjust the volume so all songs play at the same level"
          control={
            <ToggleSwitch
              checked={normalizeVolume}
              onChange={(checked) => {
                setNormalizeVolume(checked);
                saveSettings({ normalizeVolume: checked });
              }}
              aria-label="Normalize volume"
            />
          }
        />
        <SettingsRow
          label="Mono audio"
          description="Combine left and right channels into one mono signal"
          control={
            <ToggleSwitch
              checked={monoAudio}
              onChange={(checked) => {
                setMonoAudio(checked);
                saveSettings({ monoAudio: checked });
              }}
              aria-label="Mono audio"
            />
          }
        />
        <SettingsRow
          label="Enable hardware acceleration"
          description="Use hardware acceleration when available (requires restart)"
          control={
            <ToggleSwitch
              checked={hardwareAcceleration}
              onChange={(checked) => {
                setHardwareAcceleration(checked);
                saveSettings({ hardwareAcceleration: checked });
              }}
              aria-label="Enable hardware acceleration"
            />
          }
        />
      </SettingsSection>

      {/* Playback Section */}
      <SettingsSection title="Playback">
        <SettingsRow
          label="Autoplay"
          description="Automatically play similar content when your music ends"
          control={
            <ToggleSwitch
              checked={autoplay}
              onChange={(checked) => {
                setAutoplay(checked);
                saveSettings({ autoplay: checked });
              }}
              aria-label="Autoplay"
            />
          }
        />
        <SettingsRow
          label="Crossfade songs"
          description="Seamlessly transition between tracks"
          control={
            <SliderControl
              value={crossfade}
              min={0}
              max={12}
              onChange={(value) => {
                setCrossfade(value);
                saveSettings({ crossfade: value });
              }}
              formatValue={(v) => `${v} sec`}
              aria-label="Crossfade duration"
            />
          }
        />
        <SettingsRow
          label="Gapless playback"
          description="Remove silence between tracks"
          control={
            <ToggleSwitch
              checked={gaplessPlayback}
              onChange={(checked) => {
                setGaplessPlayback(checked);
                saveSettings({ gaplessPlayback: checked });
              }}
              aria-label="Gapless playback"
            />
          }
        />
        <SettingsRow
          label="Allow explicit content"
          description="Show explicit content in search results and recommendations"
          control={
            <ToggleSwitch
              checked={allowExplicit}
              onChange={(checked) => {
                setAllowExplicit(checked);
                saveSettings({ allowExplicit: checked });
              }}
              aria-label="Allow explicit content"
            />
          }
        />
      </SettingsSection>

      {/* Display Section */}
      <SettingsSection title="Display">
        <SettingsRow
          label="Show unavailable songs"
          description="Display songs that are not available in your region"
          control={
            <ToggleSwitch
              checked={showUnavailable}
              onChange={(checked) => {
                setShowUnavailable(checked);
                saveSettings({ showUnavailable: checked });
              }}
              aria-label="Show unavailable songs"
            />
          }
        />
        <SettingsRow
          label="Show album art on notifications"
          control={
            <ToggleSwitch
              checked={showAlbumArtNotifications}
              onChange={(checked) => {
                setShowAlbumArtNotifications(checked);
                saveSettings({ showAlbumArtNotifications: checked });
              }}
              aria-label="Show album art on notifications"
            />
          }
        />
        <SettingsRow
          label="Canvas"
          description="Show animated visuals while listening to supported tracks"
          control={
            <ToggleSwitch
              checked={canvasEnabled}
              onChange={(checked) => {
                setCanvasEnabled(checked);
                saveSettings({ canvasEnabled: checked });
              }}
              aria-label="Canvas"
            />
          }
        />
      </SettingsSection>

      {/* Social Section */}
      <SettingsSection title="Social">
        <SettingsRow
          label="Share my listening activity"
          description="Let your followers see what you're listening to on Spotify"
          control={
            <ToggleSwitch
              checked={shareActivity}
              onChange={(checked) => {
                setShareActivity(checked);
                saveSettings({ shareActivity: checked });
              }}
              aria-label="Share listening activity"
            />
          }
        />
        <SettingsRow
          label="Show recently played artists"
          description="Display your recently played artists on your profile"
          control={
            <ToggleSwitch
              checked={showRecentlyPlayed}
              onChange={(checked) => {
                setShowRecentlyPlayed(checked);
                saveSettings({ showRecentlyPlayed: checked });
              }}
              aria-label="Show recently played artists"
            />
          }
        />
      </SettingsSection>

      {/* Privacy Section */}
      <SettingsSection title="Privacy">
        <SettingsRow
          label="Private session"
          description="Listen privately for this session. Your activity won't be shared."
          control={
            <ToggleSwitch
              checked={privateSession}
              onChange={(checked) => {
                setPrivateSession(checked);
                saveSettings({ privateSession: checked });
                if (checked) {
                  showToast.info('Private session enabled');
                }
              }}
              aria-label="Private session"
            />
          }
        />
        <div className="py-4 flex gap-4">
          <button
            onClick={handleClearBrowsingHistory}
            className="px-4 py-2 bg-[#3E3E3E] text-white rounded-full hover:bg-[#4E4E4E] transition-colors text-sm font-medium"
          >
            Clear browsing history
          </button>
          <button
            onClick={handleClearCache}
            className="px-4 py-2 bg-[#3E3E3E] text-white rounded-full hover:bg-[#4E4E4E] transition-colors text-sm font-medium"
          >
            Clear download cache
          </button>
        </div>
      </SettingsSection>

      {/* Language Section */}
      <SettingsSection title="Language">
        <SettingsRow
          label="Language"
          description="Choose your preferred language for the Spotify Web Player"
          control={
            <SelectControl
              value={language}
              onChange={(value) => {
                setLanguage(value);
                saveSettings({ language: value });
              }}
              options={LANGUAGE_OPTIONS}
              aria-label="Language"
            />
          }
        />
      </SettingsSection>
    </div>
  );
}
