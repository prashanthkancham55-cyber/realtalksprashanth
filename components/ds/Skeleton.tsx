// ─── Base skeleton ─────────────────────────────────────────────────────────────
interface SkeletonProps {
  className?: string;
  style?:     React.CSSProperties;
  rounded?:   'sm' | 'md' | 'lg' | 'full';
}

const ROUNDED = { sm: 'rounded-lg', md: 'rounded-xl', lg: 'rounded-2xl', full: 'rounded-full' };

export function Skeleton({ className = '', style, rounded = 'md' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse ${ROUNDED[rounded]} ${className}`}
      style={{ background: 'rgba(255,255,255,0.04)', ...style }}
    />
  );
}

// ─── Card skeleton ─────────────────────────────────────────────────────────────
export function CardSkeleton({ rows = 3, className = '' }: { rows?: number; className?: string }) {
  return (
    <div
      className={`rounded-2xl p-5 ${className}`}
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-10 h-10" rounded="lg" />
        <Skeleton className="w-14 h-5" rounded="sm" />
      </div>
      <Skeleton className="w-20 h-7 mb-1.5" />
      {[...Array(rows)].map((_, i) => (
        <Skeleton key={i} className={`h-3 mt-2 ${i === 0 ? 'w-full' : i === 1 ? 'w-3/4' : 'w-1/2'}`} rounded="sm" />
      ))}
    </div>
  );
}

// ─── Stats grid skeleton ───────────────────────────────────────────────────────
export function StatsGridSkeleton({ cols = 3, count = 6 }: { cols?: number; count?: number }) {
  const colClass = cols === 4 ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-2 lg:grid-cols-3';
  return (
    <div className={`grid ${colClass} gap-4`}>
      {[...Array(count)].map((_, i) => <CardSkeleton key={i} rows={1} />)}
    </div>
  );
}

// ─── Table skeleton ─────────────────────────────────────────────────────────────
export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="px-5 py-3.5 border-b flex gap-6" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        {[...Array(cols)].map((_, i) => <Skeleton key={i} className="h-3 w-20" rounded="sm" />)}
      </div>
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className="px-5 py-4 border-b last:border-b-0 flex gap-6"
          style={{ borderColor: 'rgba(255,255,255,0.045)' }}
        >
          {[...Array(cols)].map((_, j) => (
            <Skeleton key={j} className={`h-4 ${j === 0 ? 'w-40' : j === cols - 1 ? 'w-16' : 'w-24'}`} rounded="sm" />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── List skeleton ─────────────────────────────────────────────────────────────
export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl p-5 flex items-start gap-4"
          style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <Skeleton className="w-10 h-10 flex-shrink-0" rounded="lg" />
          <div className="flex-1 flex flex-col gap-2">
            <Skeleton className="h-4 w-1/3" rounded="sm" />
            <Skeleton className="h-3 w-2/3" rounded="sm" />
            <Skeleton className="h-3 w-1/2" rounded="sm" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Image grid skeleton ───────────────────────────────────────────────────────
export function ImageGridSkeleton({ count = 8, cols = 4 }: { count?: number; cols?: number }) {
  const colClass = cols === 4 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-2 md:grid-cols-3';
  return (
    <div className={`grid ${colClass} gap-4`}>
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i} className="aspect-square" rounded="lg" />
      ))}
    </div>
  );
}
