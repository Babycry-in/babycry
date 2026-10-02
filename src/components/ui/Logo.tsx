import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const dims = {
    sm: { h: 52, w: 52 },
    md: { h: 68, w: 68 },
    lg: { h: 88, w: 88 },
  };

  const { h, w } = dims[size];

  return (
    <Link href="/" className={`inline-flex items-center group ${className}`}>
      <div
        className="relative transition-transform duration-300 group-hover:scale-105"
        style={{ width: w, height: h }}
      >
        <Image
          src="/images/babycry-logo-transparent.png"
          alt="Baby Cry.in - Baby & Kids Store"
          fill
          priority
          sizes="88px"
          className="object-contain"
        />
      </div>
    </Link>
  );
}
