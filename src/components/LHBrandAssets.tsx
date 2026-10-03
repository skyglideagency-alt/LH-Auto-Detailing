import React from 'react';

export type VehicleTier = 'sedan' | 'suv' | 'truck';

const RAW_LH_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 210" fill="none">
  <rect width="680" height="210" rx="18" fill="#FFFFFF"/>
  <!-- Outer Tire Tread Arch (#353B49) -->
  <path d="M42 174 C44 74, 128 18, 218 28 C278 35, 326 76, 348 136 C322 92, 276 64, 222 64 C148 64, 108 110, 104 174 Z" fill="#353B49"/>
  <!-- White Tire Tread Chevrons -->
  <path d="M56 162 L72 149 L89 160" stroke="#FFFFFF" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M62 136 L81 124 L96 137" stroke="#FFFFFF" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M75 110 L96 100 L108 115" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M94 86 L116 79 L125 95" stroke="#FFFFFF" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M119 66 L141 62 L147 78" stroke="#FFFFFF" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M148 51 L169 50 L172 65" stroke="#FFFFFF" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M179 42 L198 44 L199 58" stroke="#FFFFFF" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M210 40 L227 44 L225 56" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M240 44 L254 50 L251 60" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M266 53 L278 60 L274 68" stroke="#FFFFFF" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Periwinkle Wheel Spoke Arches (#9AB3DF) -->
  <path d="M138 142 C152 108, 176 92, 196 89 L216 142" stroke="#9AB3DF" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M212 84 C236 80, 265 84, 286 96 L262 142" stroke="#9AB3DF" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M276 142 L302 106 C318 118, 329 132, 336 146" stroke="#9AB3DF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Two Periwinkle Sparkle Stars (#9AB3DF) -->
  <path d="M366 30 C372 62, 382 72, 412 78 C382 84, 372 94, 366 138 C360 94, 350 84, 320 78 C350 72, 360 62, 366 30 Z" fill="#9AB3DF"/>
  <path d="M406 96 C409 112, 414 117, 428 120 C414 123, 409 128, 406 146 C403 128, 398 123, 384 120 C398 117, 403 112, 406 96 Z" fill="#9AB3DF"/>
  <!-- LH Auto Detailing Bold Cobalt Typography (#33599E) -->
  <text x="128" y="175" fill="#33599E" font-family="'Syne', 'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="42" letter-spacing="1.5">LH Auto Detailing</text>
</svg>`;

export const LH_LOGO_SVG_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(
  RAW_LH_LOGO_SVG
)}`;

export const VehicleTierSilhouette: React.FC<{
  tier: VehicleTier;
  className?: string;
}> = ({ tier, className = 'w-14 h-6' }) => {
  if (tier === 'sedan') {
    return (
      <svg
        viewBox="0 0 120 44"
        fill="currentColor"
        className={className}
        aria-hidden="true"
      >
        <path d="M14 28 C18 20, 32 11, 52 11 L78 11 C92 11, 102 19, 108 24 L114 26 C116 27, 117 31, 115 33 L104 34 A10 10 0 0 0 84 34 L40 34 A10 10 0 0 0 20 34 L10 33 C8 32, 9 29, 14 28 Z" />
        <circle cx="30" cy="34" r="7" fill="currentColor" stroke="#080C14" strokeWidth="2.5" />
        <circle cx="94" cy="34" r="7" fill="currentColor" stroke="#080C14" strokeWidth="2.5" />
      </svg>
    );
  }
  if (tier === 'suv') {
    return (
      <svg
        viewBox="0 0 120 44"
        fill="currentColor"
        className={className}
        aria-hidden="true"
      >
        <path d="M12 29 L16 13 C18 9, 24 8, 34 8 L80 8 C92 8, 100 16, 106 22 L114 25 C116 26, 117 31, 114 33 L104 34 A10 10 0 0 0 84 34 L40 34 A10 10 0 0 0 20 34 L10 33 C8 32, 9 30, 12 29 Z" />
        <circle cx="30" cy="34" r="7.5" fill="currentColor" stroke="#080C14" strokeWidth="2.5" />
        <circle cx="94" cy="34" r="7.5" fill="currentColor" stroke="#080C14" strokeWidth="2.5" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 120 44"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 21 L44 21 L44 9 L76 9 C84 9, 91 15, 96 21 L113 23 C116 24, 117 30, 114 33 L104 34 A10 10 0 0 0 84 34 L40 34 A10 10 0 0 0 20 34 L8 33 Z" />
      <circle cx="30" cy="34" r="7.5" fill="currentColor" stroke="#080C14" strokeWidth="2.5" />
      <circle cx="94" cy="34" r="7.5" fill="currentColor" stroke="#080C14" strokeWidth="2.5" />
    </svg>
  );
};
