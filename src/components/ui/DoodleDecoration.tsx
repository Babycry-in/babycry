import React from 'react';

type DoodleType = 'star' | 'heart' | 'sparkle' | 'wave' | 'cloud' | 'flower';

interface DoodleDecorationProps {
  type: DoodleType;
  className?: string;
  color?: string;
  size?: number;
}

export function DoodleDecoration({
  type,
  className = '',
  color = '#4E8A73',
  size = 24,
}: DoodleDecorationProps) {
  if (type === 'star') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`inline-block ${className}`}
      >
        <path d="M12 2L14.4 8.6L21.5 9.1L16 13.8L17.7 20.8L12 17.1L6.3 20.8L8 13.8L2.5 9.1L9.6 8.6L12 2Z" />
      </svg>
    );
  }

  if (type === 'heart') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`inline-block ${className}`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    );
  }

  if (type === 'sparkle') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`inline-block ${className}`}
      >
        <path d="M12 3v18M3 12h18M6.5 6.5l11 11M17.5 6.5l-11 11" />
      </svg>
    );
  }

  if (type === 'cloud') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 24"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`inline-block ${className}`}
      >
        <path d="M7 19a5 5 0 0 1-1-9.9 7 7 0 0 1 13.7-2.1 6 6 0 0 1 7.3 6.9A5 5 0 0 1 25 19H7z" />
      </svg>
    );
  }

  if (type === 'wave') {
    return (
      <svg
        width={size * 2}
        height={size / 2}
        viewBox="0 0 60 12"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        className={`inline-block ${className}`}
      >
        <path d="M2 6 Q 15 0 30 6 T 58 6" />
      </svg>
    );
  }

  // flower default
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      className={`inline-block ${className}`}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2a4 4 0 0 0-4 4c0 3 4 6 4 6s4-3 4-6a4 4 0 0 0-4-4z" />
      <path d="M12 22a4 4 0 0 0 4-4c0-3-4-6-4-6s-4 3-4 6a4 4 0 0 0 4 4z" />
      <path d="M2 12a4 4 0 0 0 4 4c3 0 6-4 6-4s-3-4-6-4a4 4 0 0 0-4 4z" />
      <path d="M22 12a4 4 0 0 0-4-4c-3 0-6 4-6 4s3 4 6 4a4 4 0 0 0 4-4z" />
    </svg>
  );
}
