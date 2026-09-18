import React, { useState } from 'react';
import { Download, Share2, X, Smartphone, Check } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Do not display if already in standalone mode or dismissed
  if (isInstalled || dismissed) {
    return null;
  }

  // If not on iOS and install prompt is not available yet, still offer a soft prompt or hide
  if (!isInstallable && !isIOS) {
    return null;
  }

  return (
    <>
      <div 
        id="pwa-install-banner"
        className="bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs sm:text-sm sticky top-0 z-40"
      >
        <div className="flex items-center gap-2.5 max-w-[75%] sm:max-w-none">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0">
            <Smartphone className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <p className="font-semibold text-white leading-tight">
              Install Tenzo Cafe App
            </p>
            <p className="text-amber-200/80 text-[11px] sm:text-xs hidden xs:block">
              Fast loading, offline menu, and 1-tap ordering
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isInstallable && (
            <button
              id="btn-pwa-install"
              onClick={install}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-3 py-1.5 rounded-lg shadow transition text-xs whitespace-nowrap active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          )}

          {isIOS && (
            <button
              id="btn-pwa-ios-guide"
              onClick={() => setShowIOSModal(true)}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-3 py-1.5 rounded-lg shadow transition text-xs whitespace-nowrap active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          )}

          <button
            id="btn-pwa-dismiss"
            onClick={() => setDismissed(true)}
            className="p-1 rounded-md text-amber-300/70 hover:text-white hover:bg-white/10 transition ml-1"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showIOSModal && (
        <div 
          id="ios-install-modal"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in"
          onClick={() => setShowIOSModal(false)}
        >
          <div 
            className="bg-[#FAF7F2] text-stone-900 w-full max-w-sm rounded-2xl p-5 shadow-2xl border border-amber-900/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <img src="/logo.jpg" alt="Tenzo" className="w-9 h-9 rounded-xl object-cover shadow-xs" />
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">Install Tenzo App on iPhone</h3>
                  <p className="text-[11px] text-stone-500">Run directly from your home screen</p>
                </div>
              </div>
              <button 
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-stone-700">
              <div className="flex items-start gap-3 bg-white p-2.5 rounded-xl border border-stone-100">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                <div>
                  Tap the <strong className="text-stone-900">Share</strong> button <Share2 className="w-3.5 h-3.5 inline mx-1 text-sky-600" /> at the bottom of Safari.
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-2.5 rounded-xl border border-stone-100">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                <div>
                  Scroll down the share sheet and select <strong className="text-stone-900">Add to Home Screen</strong>.
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-2.5 rounded-xl border border-stone-100">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                <div>
                  Tap <strong className="text-stone-900">Add</strong> at the top right to complete.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
