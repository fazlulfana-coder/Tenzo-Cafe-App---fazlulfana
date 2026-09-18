import React from 'react';

interface TenzoLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  showTextLabel?: boolean;
  showBadge?: boolean;
}

export const TenzoLogo: React.FC<TenzoLogoProps> = ({
  className = '',
  size = 'md',
  showTextLabel = false,
}) => {
  const sizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-36 h-36',
    full: 'w-full h-full',
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className={`relative shrink-0 rounded-full overflow-hidden shadow-2xs ${sizeMap[size]}`}>
        <img
          src="/images/tenzo-logo.svg"
          alt="New Tenzo Cafe & Bakers - Enrich Every Moment"
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>

      {showTextLabel && (
        <div className="leading-tight">
          <span className="block text-[10px] uppercase font-bold tracking-[0.2em] text-[#8B5E3C]">
            New
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif-bakery text-xl sm:text-2xl font-bold tracking-tight text-[#2D241E]">
              Tenzo
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B5E3C]">
              Cafe &amp; Bakers
            </span>
          </div>
          <span className="block text-[9px] font-medium tracking-widest text-[#9A8C73] uppercase mt-0.5">
            Enrich Every Moment
          </span>
        </div>
      )}
    </div>
  );
};
