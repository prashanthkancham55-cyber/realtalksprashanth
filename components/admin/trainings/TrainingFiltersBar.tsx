'use client';

import { SearchInput, Select } from '@/components/ds';
import { STATUS_OPTIONS, CATEGORY_OPTIONS, MODE_OPTIONS } from './data';

interface Props {
  search:      string;
  status:      string;
  category:    string;
  mode:        string;
  onSearch:    (v: string) => void;
  onStatus:    (v: string) => void;
  onCategory:  (v: string) => void;
  onMode:      (v: string) => void;
  onReset:     () => void;
  hasFilters:  boolean;
}

export default function TrainingFiltersBar({
  search, status, category, mode,
  onSearch, onStatus, onCategory, onMode,
  onReset, hasFilters,
}: Props) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap lg:flex-nowrap">
        {/* Search — grows to fill available space */}
        <div className="flex-1 min-w-0">
          <SearchInput
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search trainings, trainer, location..."
          />
        </div>

        {/* Status filter */}
        <div className="w-full sm:w-36 lg:w-32 flex-shrink-0">
          <Select
            value={status}
            onChange={(e) => onStatus(e.target.value)}
            options={STATUS_OPTIONS}
          />
        </div>

        {/* Category filter */}
        <div className="w-full sm:w-40 lg:w-36 flex-shrink-0">
          <Select
            value={category}
            onChange={(e) => onCategory(e.target.value)}
            options={CATEGORY_OPTIONS}
          />
        </div>

        {/* Mode filter */}
        <div className="w-full sm:w-32 lg:w-28 flex-shrink-0">
          <Select
            value={mode}
            onChange={(e) => onMode(e.target.value)}
            options={MODE_OPTIONS}
          />
        </div>

        {/* Reset */}
        {hasFilters && (
          <button
            onClick={onReset}
            className="text-white/35 text-xs hover:text-white/60 transition-colors px-2 whitespace-nowrap flex-shrink-0 self-center"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
