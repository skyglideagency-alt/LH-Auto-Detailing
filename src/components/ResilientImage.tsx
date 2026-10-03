import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ResilientImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  /** When true, renders the uploaded image 100% unmodified without any crop or filter */
  asIsUnmodified?: boolean;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  fallbackTitle,
  asIsUnmodified = false,
  className = '',
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#141720] via-[#0F1117] to-[#0A0B0E] text-neutral-400 p-8 text-center border border-white/10 ${className}`}
      >
        <Sparkles className="w-8 h-8 mb-3 text-[var(--brand-accent)] opacity-80" />
        <span className="text-sm font-medium text-neutral-200">
          {fallbackTitle || alt || 'Automotive Studio Visual'}
        </span>
      </div>
    );
  }

  if (asIsUnmodified) {
    // Strictly unmodified rendering: no cropping, no filters, natural geometry preserved
    return (
      <img
        src={src}
        alt={alt || 'Before and after detailing documentation'}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="block max-w-full h-auto mx-auto"
        {...rest}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt || 'Automotive detailing showcase'}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      {...rest}
    />
  );
};
