'use client';

import { useState, useEffect } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { useSpotifyPlayer } from '@/hooks/useSpotifyPlayer';
import { Slider } from '@/components/ui/Slider';
import { transferPlayback } from '@/services/spotify';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface DeviceMenuProps {
  onClose: () => void;
}

interface Device {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number | null;
}

export function DeviceMenu({ onClose }: DeviceMenuProps) {
  const player = useSpotifyPlayer();
  const playerStore = usePlayerStore();

  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch available devices
    const fetchDevices = async () => {
      try {
        const response = await fetch('/api/devices');
        if (response.ok) {
          const data = await response.json();
          setDevices(data.devices || []);
        }
      } catch (error) {
        console.error('Failed to fetch devices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const handleVolumeChange = (value: number) => {
    player.setVolume(value / 100);
    if (playerStore.isMuted && value > 0) {
      playerStore.setVolume(value);
    }
  };

  const handleDeviceClick = async (device: Device) => {
    if (device.is_active) return;

    try {
      await transferPlayback(device.id, false);
      playerStore.setDeviceId(device.id);
      toast.success(`Listening on ${device.name}`);
      onClose();
    } catch (error) {
      console.error('Failed to transfer playback:', error);
      toast.error('Failed to connect to device');
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'computer':
        return (
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
            <path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v7A1.5 1.5 0 0 0 2.5 11h11a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 13.5 1h-11zM2 2.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-7zM0 12.5A1.5 1.5 0 0 1 1.5 11h13a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-1z" />
          </svg>
        );
      case 'smartphone':
        return (
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
            <path d="M5.5 0a2.5 2.5 0 0 0-2.5 2.5v11A2.5 2.5 0 0 0 5.5 16h5a2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 10.5 0h-5zM4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-11zm4 12.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
          </svg>
        );
      case 'speaker':
        return (
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
            <path d="M8 1.5A6.5 6.5 0 1 0 14.5 8 6.507 6.507 0 0 0 8 1.5zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z" />
            <path d="M8 3a5 5 0 1 0 0 10A5 5 0 0 0 8 3zM1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0z" />
          </svg>
        );
      case 'tv':
        return (
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
            <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H9v2.5a.5.5 0 0 1-1 0V11H2a1 1 0 0 1-1-1V3zm1 0v7h12V3H2z" />
          </svg>
        );
      case 'game_console':
        return (
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
            <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm11 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-9 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm2.5 2a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z" />
          </svg>
        );
      case 'automobile':
        return (
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
            <path d="M2.5 3a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-11zM1 3.5A1.5 1.5 0 0 1 2.5 2h11A1.5 1.5 0 0 1 15 3.5v2A1.5 1.5 0 0 1 13.5 7h-11A1.5 1.5 0 0 1 1 5.5v-2zM3 9a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm10 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
            <path d="M8 1.5A6.5 6.5 0 1 0 14.5 8 6.507 6.507 0 0 0 8 1.5zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z" />
            <path d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z" />
          </svg>
        );
    }
  };

  const currentVolume = playerStore.isMuted ? 0 : playerStore.volumePercent;
  const activeDevice = devices.find((d) => d.is_active);

  return (
    <div
      className={cn(
        'absolute bottom-12 right-0 w-72 bg-[#282828] rounded-lg shadow-xl',
        'overflow-hidden z-50'
      )}
      style={{
        boxShadow: '0 16px 24px rgba(0,0,0,0.3)',
      }}
    >
      <div className="p-4">
        {/* Title */}
        <h3 className="text-base font-bold text-white mb-4">Connect to a device</h3>

        {/* Volume Slider */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5 text-[#A7A7A7]">
              <path d="M9.741.589a.75.75 0 0 1 .385.658v5.5a.75.75 0 0 1-.242.553l-3.182 3.182a3.25 3.25 0 0 1-4.495 0L.664 8.939A.75.75 0 0 1 .45 8.41V3.25A3.25 3.25 0 0 1 3.7 0h1.679a.75.75 0 0 1 .53.22l2.364 2.364a.75.75 0 0 1 .22.53v.425l.718-.718a.75.75 0 0 1 .53-.222ZM5.379 1.5a1.75 1.75 0 0 0-1.75 1.75v4.844l1.31 1.31a1.75 1.75 0 0 0 2.475 0l2.715-2.715V3.561L7.67 1.5H5.38Zm6.34 3.28a5.23 5.23 0 0 1 0 7.66l-1.22-1.22a3.73 3.73 0 0 0 0-5.22l1.22-1.22Z" />
            </svg>
            <Slider
              value={currentVolume}
              max={100}
              onChange={handleVolumeChange}
              color="#1DB954"
              height={4}
            />
          </div>
        </div>

        {/* Current Device */}
        {activeDevice ? (
          <div className="mb-3">
            <p className="text-xs text-[#A7A7A7] mb-2">Current device</p>
            <div className="flex items-center gap-3 p-2 rounded hover:bg-white/10 cursor-pointer">
              <span className="text-[#1DB954]">{getDeviceIcon(activeDevice.type)}</span>
              <div className="flex-1">
                <p className="text-sm text-white font-medium">{activeDevice.name}</p>
                <p className="text-xs text-[#1DB954]">This Web Browser</p>
              </div>
              <span className="w-2 h-2 bg-[#1DB954] rounded-full" />
            </div>
          </div>
        ) : null}

        {/* Other Devices */}
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="w-5 h-5 border-2 border-[#A7A7A7] border-t-white rounded-full animate-spin" />
          </div>
        ) : devices.filter((d) => !d.is_active).length > 0 ? (
          <div>
            <p className="text-xs text-[#A7A7A7] mb-2">Other devices</p>
            {devices
              .filter((d) => !d.is_active)
              .map((device) => (
                <button
                  key={device.id}
                  onClick={() => handleDeviceClick(device)}
                  className="w-full flex items-center gap-3 p-2 rounded hover:bg-white/10 transition-colors text-left"
                >
                  <span className="text-[#A7A7A7]">{getDeviceIcon(device.type)}</span>
                  <span className="text-sm text-white">{device.name}</span>
                </button>
              ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-12 h-12 text-[#A7A7A7] mb-3">
              <path d="M9.741.589a.75.75 0 0 1 .385.658v5.5a.75.75 0 0 1-.242.553l-3.182 3.182a3.25 3.25 0 0 1-4.495 0L.664 8.939A.75.75 0 0 1 .45 8.41V3.25A3.25 3.25 0 0 1 3.7 0h1.679a.75.75 0 0 1 .53.22l2.364 2.364a.75.75 0 0 1 .22.53v.425l.718-.718a.75.75 0 0 1 .53-.222ZM5.379 1.5a1.75 1.75 0 0 0-1.75 1.75v4.844l1.31 1.31a1.75 1.75 0 0 0 2.475 0l2.715-2.715V3.561L7.67 1.5H5.38Zm6.34 3.28a5.23 5.23 0 0 1 0 7.66l-1.22-1.22a3.73 3.73 0 0 0 0-5.22l1.22-1.22Z" />
            </svg>
            <p className="text-sm text-[#A7A7A7]">
              Open Spotify on another device to connect
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
