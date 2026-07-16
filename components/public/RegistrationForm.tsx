'use client';

import { useState, type FormEvent } from 'react';
import {
  Calendar, MapPin, Users, CheckCircle2, AlertCircle, Loader2,
  User, Phone, Mail, Building2, Briefcase, TrendingUp, Tag,
  ChevronDown, Clock,
} from 'lucide-react';
import type { Training } from '@/components/admin/trainings/data';
import { formatDate } from '@/components/admin/trainings/data';
import {
  submitRegistration, validateRegistrationForm, isDuplicateRegistration,
  EXPERIENCE_OPTIONS, INDUSTRY_OPTIONS, GENDER_OPTIONS, INDIAN_STATES,
  type RegistrationFormData,
} from '@/lib/registrationService';

interface Props {
  training: Training;
}

const EMPTY_FORM: RegistrationFormData = {
  training_id:       '',
  full_name:         '',
  mobile:            '',
  email:             '',
  city:              '',
  state:             '',
  company:           '',
  designation:       '',
  experience:        '',
  industry:          '',
  gender:            '',
  date_of_birth:     '',
  emergency_contact: '',
  address:           '',
};

// ── Field wrapper ──────────────────────────────────────────────────────────────
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/70 text-sm font-medium">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = `
  w-full bg-white/[0.04] border border-white/[0.10] rounded-xl px-4 py-2.5 text-white text-sm
  placeholder:text-white/25 outline-none transition-all duration-200
  focus:border-gold-400/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.12)]
`.trim();

const selectCls = `${inputCls} appearance-none cursor-pointer`;

function SelectWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
    </div>
  );
}

export default function RegistrationForm({ training }: Props) {
  const [form, setForm] = useState<RegistrationFormData>({ ...EMPTY_FORM, training_id: training.id });
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); // registration_id on success

  const set = (field: keyof RegistrationFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateRegistrationForm(form);
    if (validationError) { setError(validationError); return; }

    if (!terms) { setError('Please accept the Terms & Conditions to proceed.'); return; }

    setLoading(true);
    try {
      // Duplicate check
      const duplicate = await isDuplicateRegistration(form.training_id, form.mobile);
      if (duplicate) {
        setError('A registration with this mobile number already exists for this training.');
        return;
      }

      const reg = await submitRegistration(form);
      setSuccess(reg.registration_id);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Submission failed. Please try again.';
      // Supabase unique-constraint violation
      if (msg.includes('unique') || msg.includes('duplicate')) {
        setError('A registration with this mobile number already exists for this training.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6 py-12">
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{ background: 'rgba(74,222,128,0.1)', border: '2px solid rgba(74,222,128,0.3)' }}
        >
          <CheckCircle2 className="w-12 h-12 text-green-400" />
        </div>
        <div>
          <h2
            className="text-white font-bold text-3xl mb-2"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Registration Successful!
          </h2>
          <p className="text-white/50 text-sm max-w-md mx-auto leading-relaxed">
            You have been registered for <span className="text-white/80 font-medium">{training.title}</span>.
            Please save your registration ID for future reference.
          </p>
        </div>
        <div
          className="px-8 py-5 rounded-2xl flex flex-col items-center gap-1"
          style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}
        >
          <p className="text-white/40 text-xs uppercase tracking-widest font-semibold">Your Registration ID</p>
          <p
            className="font-bold text-2xl tracking-wider"
            style={{ color: '#d4af37', fontFamily: 'Cormorant Garamond, serif' }}
          >
            {success}
          </p>
        </div>
        <p className="text-white/30 text-xs max-w-sm">
          Our team will contact you shortly with further details. Check your email for a confirmation.
        </p>
        <a
          href="/trainings"
          className="px-6 py-3 rounded-xl text-sm font-semibold transition-all"
          style={{ background: 'linear-gradient(135deg, #f0c040, #d4af37)', color: '#020810' }}
        >
          Browse More Programs
        </a>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
      {/* ── FORM ───────────────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Page heading */}
        <div>
          <p
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: '#d4af37', letterSpacing: '0.2em' }}
          >
            Student Registration
          </p>
          <h1
            className="text-white font-bold text-3xl sm:text-4xl leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            {training.title}
          </h1>
        </div>

        {/* Error */}
        {error && (
          <div
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}
          >
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* ── Section: Personal Info ─────────────────────────────────────── */}
        <fieldset className="flex flex-col gap-5">
          <legend
            className="text-white font-semibold text-base mb-3 flex items-center gap-2"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem' }}
          >
            <User className="w-4 h-4" style={{ color: '#d4af37' }} />
            Personal Information
          </legend>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full Name" required>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={form.full_name}
                  onChange={(e) => set('full_name', e.target.value)}
                  className={`${inputCls} pl-10`}
                  required
                />
              </div>
            </Field>

            <Field label="Mobile Number" required>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={form.mobile}
                  onChange={(e) => set('mobile', e.target.value)}
                  className={`${inputCls} pl-10`}
                  maxLength={10}
                  required
                />
              </div>
            </Field>

            <Field label="Email Address" required>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  className={`${inputCls} pl-10`}
                  required
                />
              </div>
            </Field>

            <Field label="Gender" required>
              <SelectWrap>
                <select
                  value={form.gender}
                  onChange={(e) => set('gender', e.target.value)}
                  className={selectCls}
                  required
                >
                  <option value="">Select gender</option>
                  {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </SelectWrap>
            </Field>

            <Field label="City" required>
              <input
                type="text"
                placeholder="Your city"
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                className={inputCls}
                required
              />
            </Field>

            <Field label="State" required>
              <SelectWrap>
                <select
                  value={form.state}
                  onChange={(e) => set('state', e.target.value)}
                  className={selectCls}
                  required
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </SelectWrap>
            </Field>

            <Field label="Date of Birth">
              <input
                type="date"
                value={form.date_of_birth}
                onChange={(e) => set('date_of_birth', e.target.value)}
                className={inputCls}
                max={new Date().toISOString().split('T')[0]}
              />
            </Field>

            <Field label="Emergency Contact">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type="tel"
                  placeholder="Emergency contact number"
                  value={form.emergency_contact}
                  onChange={(e) => set('emergency_contact', e.target.value)}
                  className={`${inputCls} pl-10`}
                />
              </div>
            </Field>
          </div>

          <Field label="Address">
            <textarea
              rows={2}
              placeholder="Your full address (optional)"
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              className={`${inputCls} resize-none`}
            />
          </Field>
        </fieldset>

        {/* ── Section: Professional Info ─────────────────────────────────── */}
        <fieldset className="flex flex-col gap-5">
          <legend
            className="text-white font-semibold text-base mb-3 flex items-center gap-2"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem' }}
          >
            <Briefcase className="w-4 h-4" style={{ color: '#d4af37' }} />
            Professional Information
          </legend>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Company / Organization">
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type="text"
                  placeholder="Your company name"
                  value={form.company}
                  onChange={(e) => set('company', e.target.value)}
                  className={`${inputCls} pl-10`}
                />
              </div>
            </Field>

            <Field label="Designation">
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type="text"
                  placeholder="Your current role"
                  value={form.designation}
                  onChange={(e) => set('designation', e.target.value)}
                  className={`${inputCls} pl-10`}
                />
              </div>
            </Field>

            <Field label="Experience" required>
              <SelectWrap>
                <select
                  value={form.experience}
                  onChange={(e) => set('experience', e.target.value)}
                  className={selectCls}
                  required
                >
                  <option value="">Select experience</option>
                  {EXPERIENCE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </SelectWrap>
            </Field>

            <Field label="Industry" required>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <select
                  value={form.industry}
                  onChange={(e) => set('industry', e.target.value)}
                  className={`${selectCls} pl-10`}
                  required
                >
                  <option value="">Select industry</option>
                  {INDUSTRY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              </div>
            </Field>
          </div>
        </fieldset>

        {/* ── Terms & Conditions ─────────────────────────────────────────── */}
        <div
          className="p-4 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5 flex-shrink-0">
              <input
                type="checkbox"
                className="sr-only"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
              />
              <div
                className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200"
                style={{
                  background: terms ? 'linear-gradient(135deg, #f0c040, #d4af37)' : 'transparent',
                  borderColor: terms ? '#d4af37' : 'rgba(255,255,255,0.2)',
                }}
              >
                {terms && <CheckCircle2 className="w-3.5 h-3.5 text-navy-900" />}
              </div>
            </div>
            <span className="text-white/55 text-sm leading-relaxed">
              I agree to the{' '}
              <span className="text-gold-400 underline underline-offset-2 cursor-pointer">Terms & Conditions</span>
              {' '}and confirm that the information I have provided is accurate. I consent to being contacted by RealTalks Prashanth regarding this registration.
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-base font-bold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg, #f0c040, #d4af37)',
            color: '#020810',
            boxShadow: '0 8px 32px rgba(212,175,55,0.3)',
          }}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting Registration...
            </>
          ) : (
            'Complete Registration'
          )}
        </button>
      </form>

      {/* ── TRAINING SUMMARY CARD ──────────────────────────────────────────── */}
      <div className="lg:sticky lg:top-24">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
          }}
        >
          {/* Banner */}
          {training.banner_url ? (
            <div className="h-40 overflow-hidden">
              <img src={training.banner_url} alt={training.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div
              className="h-40 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(96,165,250,0.05))' }}
            >
              <span className="text-white/10 text-6xl font-bold" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                {training.title.charAt(0)}
              </span>
            </div>
          )}

          <div className="p-5 flex flex-col gap-4">
            {/* Title */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: '#d4af37' }}>
                You are registering for
              </p>
              <h3
                className="text-white font-bold text-xl leading-snug"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {training.title}
              </h3>
              <p className="text-white/40 text-xs mt-1">by {training.trainer_name}</p>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-2.5">
              {[
                { icon: Calendar, label: 'Start Date',   value: formatDate(training.start_date) },
                { icon: Calendar, label: 'End Date',     value: formatDate(training.end_date) },
                { icon: Clock,    label: 'Duration',     value: training.duration || '—' },
                { icon: MapPin,   label: 'Mode',         value: training.mode },
                { icon: MapPin,   label: 'Location',     value: training.location || '—' },
                { icon: Users,    label: 'Seats Left',   value: training.available_seats > 0 ? String(training.available_seats) : 'Full' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <Icon className="w-3.5 h-3.5 text-white/25 flex-shrink-0" />
                  <span className="text-white/35 text-xs w-20 flex-shrink-0">{label}</span>
                  <span className="text-white/70 text-xs font-medium">{value}</span>
                </div>
              ))}
            </div>

            {/* Price */}
            <div
              className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}
            >
              <span className="text-white/50 text-sm">Program Fee</span>
              <span
                className="font-bold text-xl"
                style={{ color: '#d4af37', fontFamily: 'Cormorant Garamond, serif' }}
              >
                {training.price > 0 ? `₹${training.price.toLocaleString('en-IN')}` : 'Free'}
              </span>
            </div>

            <p className="text-white/25 text-[10px] text-center">
              Payment instructions will be shared after registration confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
