import React from 'react';

interface CloudDividerProps {
  position?: 'top' | 'bottom';
  fillColor?: string; // e.g. '#FAF7F2' or '#EBF7F1'
  className?: string;
  flip?: boolean;
}

export function CloudDivider({
  position = 'bottom',
  fillColor = '#FAF7F2',
  className = '',
  flip = false,
}: CloudDividerProps) {
  return (
    <div
      className={`w-full overflow-hidden leading-none pointer-events-none select-none ${
        position === 'top' ? '-mb-1' : '-mt-1'
      } ${className}`}
      style={{
        transform: `${position === 'top' ? 'rotate(180deg)' : ''} ${flip ? 'scaleX(-1)' : ''}`,
      }}
    >
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-12 md:h-20 lg:h-24 block preserve-3d"
        preserveAspectRatio="none"
      >
        <path
          d="M0 60C80 40 180 20 280 45C380 70 480 95 600 80C720 65 820 30 940 40C1060 50 1160 85 1280 80C1360 75 1420 55 1440 45V120H0V60Z"
          fill={fillColor}
        />
        <path
          d="M0 80C120 65 240 75 360 90C480 105 600 90 720 70C840 50 960 60 1080 85C1200 110 1320 85 1440 70V120H0V80Z"
          fill={fillColor}
          fillOpacity="0.5"
        />
      </svg>
    </div>
  );
}
