'use client';

import { X, User, Phone, Mail, MapPin, Briefcase, Calendar, Tag } from 'lucide-react';
import { type StudentRegistration, STATUS_BADGE, formatRegistrationDate } from '@/lib/registrationService';

interface Props {
  registration: StudentRegistration;
  onClose: () => void;
  onEdit:  (r: StudentRegistration) => void;
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex gap-3">
      <span className="text-white/30 text-xs w-32 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-white/75 text-sm break-words flex-1">{value}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p
        className="text-xs font-bold uppercase tracking-widest mb-3"
        style={{ color: '#d4af37', letterSpacing: '0.15em' }}
      >
        {title}
      </p>
      <div className="flex flex-col gap-2.5 pl-1">{children}</div>
    </div>
  );
}

export default function RegistrationViewModal({ registration: reg, onClose, onEdit }: Props) {
  const sb = STATUS_BADGE[reg.status] ?? STATUS_BADGE.Pending;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl flex flex-col"
        style={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-start justify-between gap-4 px-6 py-5"
          style={{ background: '#0a1628', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div>
            <p
              className="font-bold text-xl"
              style={{ color: '#d4af37', fontFamily: 'Cormorant Garamond, serif' }}
            >
              {reg.registration_id}
            </p>
            <p className="text-white/50 text-sm mt-0.5">{reg.full_name}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ color: sb.color, background: sb.bg, border: `1px solid ${sb.border}` }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: sb.color }} />
              {sb.label}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 flex flex-col gap-6">
          {/* Training info */}
          {reg.training_title && (
            <div
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}
            >
              <Tag className="w-4 h-4 flex-shrink-0" style={{ color: '#d4af37' }} />
              <div>
                <p className="text-white/80 text-sm font-semibold">{reg.training_title}</p>
                {reg.training_start && (
                  <p className="text-white/35 text-xs mt-0.5">
                    {new Date(reg.training_start).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {reg.training_mode && <> · {reg.training_mode}</>}
                  </p>
                )}
              </div>
            </div>
          )}

          <Section title="Personal Information">
            <Row label="Full Name"  value={reg.full_name} />
            <Row label="Gender"     value={reg.gender} />
            <Row label="Date of Birth" value={reg.date_of_birth
              ? new Date(reg.date_of_birth).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
              : null}
            />
          </Section>

          <Section title="Contact Details">
            <Row label="Mobile"             value={reg.mobile} />
            <Row label="Email"              value={reg.email} />
            <Row label="Emergency Contact"  value={reg.emergency_contact} />
          </Section>

          <Section title="Location">
            <Row label="City"    value={reg.city} />
            <Row label="State"   value={reg.state} />
            <Row label="Address" value={reg.address} />
          </Section>

          <Section title="Professional Details">
            <Row label="Company"     value={reg.company} />
            <Row label="Designation" value={reg.designation} />
            <Row label="Industry"    value={reg.industry} />
            <Row label="Experience"  value={reg.experience} />
          </Section>

          {reg.notes && (
            <Section title="Admin Notes">
              <p className="text-white/55 text-sm leading-relaxed pl-1">{reg.notes}</p>
            </Section>
          )}

          <div className="flex items-center gap-3 pt-2 text-xs text-white/25 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Registered {formatRegistrationDate(reg.registered_at)}</span>
          </div>
        </div>

        {/* Footer */}
        <div
          className="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4"
          style={{ background: '#0a1628', borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white/70 transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            Close
          </button>
          <button
            onClick={() => { onClose(); onEdit(reg); }}
            className="px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #f0c040, #d4af37)', color: '#020810' }}
          >
            Edit Registration
          </button>
        </div>
      </div>
    </div>
  );
}
