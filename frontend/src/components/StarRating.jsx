import { useState } from 'react';

/**
 * If `onChange` is provided, renders an interactive 1-5 star picker.
 * Otherwise renders a read-only star display for `value`.
 */
export default function StarRating({ value = 0, onChange, size = 'md' }) {
  const [hovered, setHovered] = useState(0);
  const interactive = typeof onChange === 'function';
  const sizes = { sm: 'text-sm', md: 'text-xl', lg: 'text-3xl' };

  return (
    <div className={`inline-flex gap-0.5 ${sizes[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={`leading-none transition-colors ${
              interactive ? 'cursor-pointer' : 'cursor-default'
            } ${filled ? 'text-amber-500' : 'text-gray-300'}`}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
