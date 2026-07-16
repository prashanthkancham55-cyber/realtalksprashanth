// ─── Types ────────────────────────────────────────────────────────────────────
interface TableProps {
  children:  React.ReactNode;
  className?: string;
}

interface ThProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

interface TdProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children:  React.ReactNode;
  muted?:    boolean;
  mono?:     boolean;
}

interface TrProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children:  React.ReactNode;
  hoverable?: boolean;
  disabled?:  boolean;
}

// ─── TableContainer ───────────────────────────────────────────────────────────
export function TableContainer({ children, className = '' }: TableProps) {
  return (
    <div
      className={`rounded-2xl overflow-hidden ${className}`}
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">{children}</table>
      </div>
    </div>
  );
}

// ─── TableHead ────────────────────────────────────────────────────────────────
export function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead
      style={{ background: 'rgba(255,255,255,0.025)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      {children}
    </thead>
  );
}

// ─── Th ──────────────────────────────────────────────────────────────────────
export function Th({ children, className = '', ...rest }: ThProps) {
  return (
    <th
      className={`px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-widest text-white/30 whitespace-nowrap ${className}`}
      {...rest}
    >
      {children}
    </th>
  );
}

// ─── TableBody ────────────────────────────────────────────────────────────────
export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

// ─── Tr ──────────────────────────────────────────────────────────────────────
export function Tr({ children, hoverable = true, disabled = false, className = '', ...rest }: TrProps) {
  return (
    <tr
      className={`
        border-b last:border-b-0 transition-colors duration-150
        ${hoverable && !disabled ? 'hover:bg-white/[0.018] cursor-default' : ''}
        ${disabled ? 'opacity-40' : ''}
        ${className}
      `}
      style={{ borderColor: 'rgba(255,255,255,0.045)' }}
      {...rest}
    >
      {children}
    </tr>
  );
}

// ─── Td ──────────────────────────────────────────────────────────────────────
export function Td({ children, muted = false, mono = false, className = '', ...rest }: TdProps) {
  return (
    <td
      className={`
        px-5 py-4 text-sm align-middle
        ${muted ? 'text-white/40' : 'text-white/75'}
        ${mono ? 'font-mono' : ''}
        ${className}
      `}
      {...rest}
    >
      {children}
    </td>
  );
}
