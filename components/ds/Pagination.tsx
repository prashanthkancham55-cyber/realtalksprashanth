'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page:       number;
  totalPages: number;
  onPage:     (p: number) => void;
  showInfo?:  boolean;
  total?:     number;
  perPage?:   number;
}

export function Pagination({ page, totalPages, onPage, showInfo = true, total, perPage = 10 }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  const btnBase = 'w-8 h-8 flex items-center justify-center rounded-xl text-xs font-semibold transition-all duration-200';

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap mt-4">
      {showInfo && total !== undefined ? (
        <span className="text-white/30 text-xs">
          Showing {Math.min((page - 1) * perPage + 1, total)}–{Math.min(page * perPage, total)} of {total}
        </span>
      ) : <span />}

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className={`${btnBase} text-white/40 hover:text-white/70 disabled:opacity-30 disabled:cursor-not-allowed`}
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="w-8 text-center text-white/25 text-xs">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p as number)}
              className={`${btnBase} ${
                p === page
                  ? 'text-navy-900 font-bold'
                  : 'text-white/45 hover:text-white/70 hover:bg-white/6'
              }`}
              style={p === page
                ? { background: 'linear-gradient(135deg, #f0c040, #d4af37)' }
                : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }
              }
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className={`${btnBase} text-white/40 hover:text-white/70 disabled:opacity-30 disabled:cursor-not-allowed`}
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
