import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/usePWAInstall';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div 
      id="pwa-offline-indicator"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-800 text-amber-100 px-3.5 py-2 text-xs font-medium shadow-2xl border border-amber-700/50 animate-bounce"
    >
      <WifiOff className="w-4 h-4 text-amber-300 shrink-0" />
      <span>Offline Mode – Cached bakery catalog is active.</span>
    </div>
  );
};
