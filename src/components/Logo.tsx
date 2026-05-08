import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ className = "", size = 'md' }: LogoProps) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`relative flex items-center justify-center bg-primary rounded-2xl overflow-hidden shadow-lg border border-primary-light ${sizeMap[size]} ${className}`}>
      {/* Decorative SVG */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-2"
      >
        {/* Book Shape */}
        <path
          d="M20 25C20 22.2386 22.2386 20 25 20H75C77.7614 20 80 22.2386 80 25V75C80 77.7614 77.7614 80 75 80H25C22.2386 80 20 77.7614 20 75V25Z"
          fill="var(--color-primary)"
        />
        {/* Gold Details */}
        <path
          d="M35 35H65"
          stroke="var(--color-gold)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M35 50H65"
          stroke="var(--color-gold)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M35 65H50"
          stroke="var(--color-gold)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Abstract leaf shape for Pumpkin/Knowledge feel */}
        <path
          d="M70 65C70 65 72 60 75 60C78 60 80 65 80 65C80 65 78 70 75 70C72 70 70 65 70 65Z"
          fill="var(--color-gold)"
        />
      </svg>
    </div>
  );
}
