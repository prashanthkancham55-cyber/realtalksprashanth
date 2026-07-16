'use client';

import { useState, type FormEvent } from 'react';
import { X, Loader2, ChevronDown, AlertCircle } from 'lucide-react';
import {
  type StudentRegistration, type RegistrationStatus,
  updateRegistration, STATUS_BADGE,
  EXPERIENCE_OPTIONS, INDUSTRY_OPTIONS, GENDER_OPTIONS, INDIAN_STATES,
} from '@/lib/registrationService';

interface Props {
  registration: StudentRegistration;
  onClose:   () => void;
  onSaved:   () => void;
}

const inputCls = `
  w-full bg-white/[0.04] border border-white/[0.10] rounded-xl px-4 py-2.5 text-white text-sm
  placeholder:text-white/25 outline-none transition-all duration-200
  focus:border-gold-400/50 focus:bg-white/[0.06]
`.trim();

const selectCls = `${inputCls} appearance-none cursor-pointer`;

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/60 text-xs font-medium">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function SelectWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
    </div>
  );
}

export default function RegistrationEditModal({ registration: reg, onClose, onSaved }: Props) {
  const [fullName,          setFullName]          = useState(reg.full_name);
  const [mobile,            setMobile]            = useState(reg.mobile);
  const [email,             setEmail]             = useState(reg.email);
  const [city,              setCity]              = useState(reg.city);
  const [state,             setState]             = useState(reg.state);
  const [company,           setCompany]           = useState(reg.company ?? '');
  const [designation,       setDesignation]       = useState(reg.designation ?? '');
  const [experience,        setExperience]        = useState(reg.experience);
  const [industry,          setIndustry]          = useState(reg.industry);
  const [gender,            setGender]            = useState(reg.gender);
  const [emergencyContact,  setEmergencyContact]  = useState(reg.emergency_contact ?? '');
  const [address,           setAddress]           = useState(reg.address ?? '');
  const [status,            setStatus]            = useState<RegistrationStatus>(reg.status);
  const [notes,             setNotes]             = useState(reg.notes ?? '');
  const [loading,           setLoading]           = useState(false);
  const [error,             setError]             = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) { setError('Full name is required.'); return; }
    if (!mobile.trim())   { setError('Mobile is required.'); return; }
    if (!email.trim())    { setError('Email is required.'); return; }

    setLoading(true);
    setError(null);
    try {
      await updateRegistration(reg.id, {
        full_name:         fullName.trim(),
        mobile:            mobile.trim(),
        email:             email.trim().toLowerCase(),
        city:              city.trim(),
        state,
        company:           company.trim() || undefined,
        designation:       designation.trim() || undefined,
        experience,
        industry:          industry.trim(),
        gender,
        emergency_contact: emergencyContact.trim() || undefined,
        address:           address.trim() || undefined,
        status,
        notes:             notes.trim() || undefined,
      });
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl flex flex-col"
        style={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-5"
          style={{ background: '#0a1628', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div>
            <p className="text-white font-bold text-lg" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Edit Registration
            </p>
            <p className="text-white/40 text-sm mt-0.5">{reg.registration_id}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-6 py-6">
          {error && (
            <div
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}
            >
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Status */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#d4af37' }}>Status</p>
            <div className="flex gap-2 flex-wrap">
              {(['Pending', 'Confirmed', 'Cancelled'] as RegistrationStatus[]).map((s) => {
                const sb = STATUS_BADGE[s];
                const active = status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: active ? sb.bg : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${active ? sb.border : 'rgba(255,255,255,0.08)'}`,
                      color: active ? sb.color : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personal Info */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#d4af37' }}>Personal Information</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Full Name" required>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputCls}
                  required
                />
              </Field>
              <Field label="Mobile" required>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className={inputCls}
                  maxLength={10}
                  required
                />
              </Field>
              <Field label="Email" required>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputCls}
                  required
                />
              </Field>
              <Field label="Gender">
                <SelectWrap>
                  <select value={gender} onChange={(e) => setGender(e.target.value)} className={selectCls}>
                    <option value="">Select gender</option>
                    {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </SelectWrap>
              </Field>
              <Field label="City">
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} />
              </Field>
              <Field label="State">
                <SelectWrap>
                  <select value={state} onChange={(e) => setState(e.target.value)} className={selectCls}>
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </SelectWrap>
              </Field>
              <Field label="Emergency Contact">
                <input type="tel" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} className={inputCls} />
              </Field>
              <Field label="Address">
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls} />
              </Field>
            </div>
          </div>

          {/* Professional Info */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#d4af37' }}>Professional Details</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Company">
                <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className={inputCls} />
              </Field>
              <Field label="Designation">
                <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} className={inputCls} />
              </Field>
              <Field label="Experience">
                <SelectWrap>
                  <select value={experience} onChange={(e) => setExperience(e.target.value)} className={selectCls}>
                    <option value="">Select experience</option>
                    {EXPERIENCE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </SelectWrap>
              </Field>
              <Field label="Industry">
                <SelectWrap>
                  <select value={industry} onChange={(e) => setIndustry(e.target.value)} className={selectCls}>
                    <option value="">Select industry</option>
                    {INDUSTRY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </SelectWrap>
              </Field>
            </div>
          </div>

          {/* Admin Notes */}
          <Field label="Admin Notes">
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Internal notes about this registration..."
              className={`${inputCls} resize-none`}
            />
          </Field>
        </form>

        {/* Footer */}
        <div
          className="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4"
          style={{ background: '#0a1628', borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white/70 transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            form=""
            disabled={loading}
            onClick={handleSubmit as unknown as React.MouseEventHandler}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #f0c040, #d4af37)', color: '#020810' }}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
