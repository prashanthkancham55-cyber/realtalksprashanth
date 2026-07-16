'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';
import { IconButton } from '@/components/ds/Button';
import { type StudentRegistration, STATUS_BADGE, formatRegistrationDate } from '@/lib/registrationService';

interface Props {
  registrations: StudentRegistration[];
  onView:        (r: StudentRegistration) => void;
  onEdit:        (r: StudentRegistration) => void;
  onDelete:      (r: StudentRegistration) => void;
}

// ── Th ────────────────────────────────────────────────────────────────────────
function Th({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <th
      className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-white/35 whitespace-nowrap ${className}`}
      style={style}
    >
      {children}
    </th>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
      {children}
    </thead>
  );
}

const STICKY_TD: React.CSSProperties = {
  position: 'sticky',
  right: 0,
  background: 'rgba(4,9,22,0.97)',
  borderLeft: '1px solid rgba(255,255,255,0.06)',
  zIndex: 2,
};

export default function RegistrationTable({ registrations, onView, onEdit, onDelete }: Props) {
  if (registrations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}
        >
          <Eye className="w-6 h-6" style={{ color: '#d4af37' }} />
        </div>
        <p className="text-white/60 text-base font-semibold" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          No registrations found
        </p>
        <p className="text-white/25 text-sm mt-1">Registrations will appear here once students sign up.</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-x-auto min-w-0"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
    >
      <table className="w-full border-collapse" style={{ minWidth: '640px' }}>
        <TableHead>
          <tr>
            <Th style={{ width: '160px' }}>Reg. ID</Th>
            <Th>Student</Th>
            <Th className="hidden lg:table-cell" style={{ width: '200px' }}>Training</Th>
            <Th className="hidden md:table-cell" style={{ width: '110px' }}>Registered</Th>
            <Th style={{ width: '100px' }}>Status</Th>
            <Th className="text-right" style={{ ...STICKY_TD, width: '116px', position: 'sticky' }}>Actions</Th>
          </tr>
        </TableHead>

        <tbody>
          {registrations.map((reg, idx) => {
            const sb = STATUS_BADGE[reg.status] ?? STATUS_BADGE.Pending;
            const isLast = idx === registrations.length - 1;
            const rowBorder = isLast ? undefined : { borderBottom: '1px solid rgba(255,255,255,0.04)' };

            return (
              <tr
                key={reg.id}
                className="group hover:bg-white/[0.018] transition-colors duration-150"
                style={rowBorder}
              >
                {/* Registration ID */}
                <td className="px-4 py-3.5">
                  <p
                    className="text-sm font-bold tracking-wider"
                    style={{ color: '#d4af37', fontFamily: 'Cormorant Garamond, serif' }}
                  >
                    {reg.registration_id}
                  </p>
                  <p className="text-white/25 text-[10px] mt-0.5">{reg.city}, {reg.state}</p>
                </td>

                {/* Student */}
                <td className="px-4 py-3.5" style={{ minWidth: '160px' }}>
                  <p className="text-white/85 text-sm font-semibold leading-snug truncate">{reg.full_name}</p>
                  <p className="text-white/35 text-xs mt-0.5 truncate">{reg.email}</p>
                  <p className="text-white/25 text-[10px] mt-0.5">{reg.mobile}</p>
                </td>

                {/* Training */}
                <td className="px-4 py-3.5 hidden lg:table-cell">
                  <p className="text-white/70 text-sm font-medium truncate max-w-[180px]">
                    {reg.training_title ?? '—'}
                  </p>
                  {reg.training_start && (
                    <p className="text-white/30 text-[11px] mt-0.5">
                      {new Date(reg.training_start).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </td>

                {/* Registered at */}
                <td className="px-4 py-3.5 hidden md:table-cell">
                  <p className="text-white/45 text-xs">{formatRegistrationDate(reg.registered_at)}</p>
                </td>

                {/* Status */}
                <td className="px-4 py-3.5">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap"
                    style={{ color: sb.color, background: sb.bg, border: `1px solid ${sb.border}` }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: sb.color }} />
                    {sb.label}
                  </span>
                </td>

                {/* Actions (sticky) */}
                <td className="px-3 py-3.5 text-right" style={STICKY_TD}>
                  <div className="flex items-center justify-end gap-1.5">
                    <IconButton
                      icon={Eye}
                      variant="default"
                      size="sm"
                      label="View registration"
                      onClick={() => onView(reg)}
                    />
                    <IconButton
                      icon={Pencil}
                      variant="gold"
                      size="sm"
                      label="Edit registration"
                      onClick={() => onEdit(reg)}
                    />
                    <IconButton
                      icon={Trash2}
                      variant="danger"
                      size="sm"
                      label="Delete registration"
                      onClick={() => onDelete(reg)}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
