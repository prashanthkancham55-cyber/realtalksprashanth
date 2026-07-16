'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface Props {
  value: number;
  onChange: (n: number) => void;
}

export default function StarPicker({ value, onChange }: Props) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
        >
          <Star className={`w-6 h-6 transition-colors ${n <= (hover || value) ? 'fill-gold-500 text-gold-500' : 'text-white/20'}`} />
        </button>
      ))}
    </div>
  );
}
