import { useState, useEffect, type ReactNode, type ChangeEvent, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  AlertCircle,
  Calendar,
  MapPin,
  Monitor,
  Users,
  Globe,
  Wifi,
  Loader2,
  CheckCircle,
  ArrowRight,
  User,
  Phone,
  Mail,
  Building,
  Briefcase,
} from 'lucide-react';
import type { Training }               from '../../types/training';
import { formatDate, formatPrice }     from '../../types/training';
import { getTrainingBySlug }           from '../../lib/trainingService';
import type { RegistrationFormData }   from '../../types/registration';
import {
  EMPTY_REG_FORM,
  EXPERIENCE_OPTIONS,
  INDUSTRY_OPTIONS,
  GENDER_OPTIONS,
  INDIAN_STATES,
  validateRegistrationForm,
}                                      from '../../types/registration';
import { submitRegistration, isDuplicateRegistration } from '../../lib/registrationService';

// ── Design tokens ─────────────────────────────────────────────────────────────
const GOLD  = '#d4af37';
const GOLD2 = '#f0c040';
const NAV   = '#020810';
const CARD_BG = 'rgba(13,22,48,0.85)';
const BORDER  = 'rgba(212,175,55,0.18)';
const FIELD_BG = 'rgba(255,255,255,0.04)';
const FIELD_BORDER = 'rgba(255,255,255,0.1)';
const FIELD_FOCUS  = 'rgba(212,175,55,0.5)';

// ── Animation variants ────────────────────────────────────────────────────────
const pageVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

// ── Reusable form field components ────────────────────────────────────────────
interface FieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
  hint?: string;
}

function Field({ label, required, children, hint }: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
        {label}
        {required && <span className="ml-1" style={{ color: GOLD }}>*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{hint}</p>}
    </div>
  );
}

const inputClass = 'w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none transition-all duration-200';
const inputStyle = {
  background: FIELD_BG,
  border: `1px solid ${FIELD_BORDER}`,
};

function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  name,
}: {
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={inputClass}
      style={{
        ...inputStyle,
        borderColor: focused ? FIELD_FOCUS : FIELD_BORDER,
        boxShadow: focused ? `0 0 0 3px rgba(212,175,55,0.12)` : 'none',
      }}
    />
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
  name,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder?: string;
  name?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={inputClass}
      style={{
        ...inputStyle,
        borderColor: focused ? FIELD_FOCUS : FIELD_BORDER,
        boxShadow: focused ? `0 0 0 3px rgba(212,175,55,0.12)` : 'none',
        color: value ? 'white' : 'rgba(255,255,255,0.35)',
      }}
    >
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {options.map(o => (
        <option key={o} value={o} style={{ background: '#0d1630', color: 'white' }}>{o}</option>
      ))}
    </select>
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
  name,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  name?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={`${inputClass} resize-none`}
      style={{
        ...inputStyle,
        borderColor: focused ? FIELD_FOCUS : FIELD_BORDER,
        boxShadow: focused ? `0 0 0 3px rgba(212,175,55,0.12)` : 'none',
      }}
    />
  );
}

// ── Section divider ───────────────────────────────────────────────────────────
function FormSection({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5 pt-2">
      <div
        className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
        style={{ background: 'rgba(212,175,55,0.1)', color: GOLD }}
      >
        {icon}
      </div>
      <h3 className="text-base font-bold text-white">{title}</h3>
      <div className="flex-1 h-px" style={{ background: BORDER }} />
    </div>
  );
}

// ── Mode badge ────────────────────────────────────────────────────────────────
function ModeBadge({ mode }: { mode: string }) {
  const cfg: Record<string, { color: string }> = {
    Online:  { color: '#60a5fa' },
    Offline: { color: '#a78bfa' },
    Hybrid:  { color: '#34d399' },
  };
  const c = cfg[mode] ?? cfg.Offline;
  return (
    <span className="text-sm font-semibold" style={{ color: c.color }}>{mode}</span>
  );
}

// ── Skeleton loader ───────────────────────────────────────────────────────────
function SkeletonLoader() {
  const pulse = { background: 'rgba(255,255,255,0.06)', borderRadius: '8px' };
  return (
    <div className="min-h-screen animate-pulse" style={{ background: NAV }}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            <div style={{ ...pulse, height: 32, width: '60%' }} />
            <div style={{ ...pulse, height: 400 }} />
            <div style={{ ...pulse, height: 300 }} />
          </div>
          <div style={{ ...pulse, height: 480 }} />
        </div>
      </div>
    </div>
  );
}

// ── Training summary sidebar ──────────────────────────────────────────────────
function TrainingSummary({ training }: { training: Training }) {
  return (
    <div
      className="rounded-2xl overflow-hidden sticky top-6"
      style={{ background: CARD_BG, border: `1px solid ${BORDER}`, backdropFilter: 'blur(12px)' }}
    >
      {/* Banner */}
      {training.banner_url && (
        <div className="h-44 overflow-hidden relative">
          <img
            src={training.banner_url}
            alt={training.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(2,8,16,0.8))' }} />
        </div>
      )}

      <div className="p-5">
        <h3
          className="text-lg font-bold text-white leading-snug mb-1"
          style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
        >
          {training.title}
        </h3>
        <p className="text-xs mb-5" style={{ color: 'rgba(255,255,255,0.45)' }}>
          by {training.trainer_name}
        </p>

        {/* Details */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
            <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: GOLD }} />
            <span>{formatDate(training.start_date)}</span>
            {training.session_time && (
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>• {training.session_time}</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
            <Monitor className="w-4 h-4 flex-shrink-0" style={{ color: GOLD }} />
            <ModeBadge mode={training.mode} />
          </div>
          {training.location && (
            <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
              <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: GOLD }} />
              <span className="truncate">{training.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
            <Globe className="w-4 h-4 flex-shrink-0" style={{ color: GOLD }} />
            <span>{training.language || 'English'}</span>
          </div>
          {training.available_seats > 0 && (
            <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
              <Users className="w-4 h-4 flex-shrink-0" style={{ color: GOLD }} />
              <span>{training.available_seats} seats remaining</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div
          className="p-3 rounded-xl border-t pt-4"
          style={{ borderColor: BORDER }}
        >
          {training.price === 0 ? (
            <span
              className="text-2xl font-bold"
              style={{ color: '#4ade80', fontFamily: 'Cormorant Garamond, Georgia, serif' }}
            >
              Free
            </span>
          ) : (
            <>
              <span
                className="text-2xl font-bold block"
                style={{
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 50%, ${GOLD} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {formatPrice(training.price)}
              </span>
              <p className="text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Payment instructions shared after confirmation
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [training, setTraining] = useState<Training | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [form,     setForm]     = useState<RegistrationFormData>(EMPTY_REG_FORM);
  const [agreed,   setAgreed]   = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ── Fetch training ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!slug) { navigate('/trainings'); return; }
    setLoading(true);
    getTrainingBySlug(slug)
      .then((data) => {
        if (!data) { navigate('/trainings'); return; }
        setTraining(data);
        setForm(f => ({ ...f, training_id: data.id }));
        document.title = `Register: ${data.title} | RealTalks`;
      })
      .catch(() => navigate('/trainings'))
      .finally(() => setLoading(false));

    return () => { document.title = 'RealTalks | Prashanth Kumar'; };
  }, [slug, navigate]);

  // ── Form field handler ──────────────────────────────────────────────────────
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (error) setError(null);
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Validate
    const validationError = validateRegistrationForm(form);
    if (validationError) { setError(validationError); return; }

    // 2. Terms
    if (!agreed) { setError('Please agree to the terms and conditions to proceed.'); return; }

    setSubmitting(true);
    try {
      // 3. Duplicate check
      const dup = await isDuplicateRegistration(form.training_id, form.mobile);
      if (dup) {
        setError('You have already registered for this training with this mobile number.');
        setSubmitting(false);
        return;
      }

      // 4. Submit
      const registration = await submitRegistration(form);

      // 5. Redirect to payment page with state
      navigate(`/payment/${registration.registration_id}`, {
        state: { registration, training },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
      setSubmitting(false);
    }
  };

  // ── Early returns ───────────────────────────────────────────────────────────
  if (loading)   return <SkeletonLoader />;
  if (!training) return null;

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      style={{ background: NAV, minHeight: '100vh' }}
    >
      {/* ── Simple nav header ─────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-40 h-14 flex items-center px-4 sm:px-6 lg:px-8"
        style={{
          background: 'rgba(2,8,16,0.92)',
          borderBottom: `1px solid ${BORDER}`,
          backdropFilter: 'blur(16px)',
        }}
      >
        <button
          onClick={() => navigate(`/training/${slug}`)}
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Training
        </button>

        <div className="ml-auto flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 100%)`,
              color: NAV,
            }}
          >
            RT
          </div>
          <span
            className="text-sm font-semibold text-white hidden sm:block"
            style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
          >
            RealTalks
          </span>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── Form (left 2/3) ───────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            {/* Heading */}
            <div className="mb-8">
              <p
                className="text-xs font-semibold uppercase tracking-[0.25em] mb-2"
                style={{ color: GOLD }}
              >
                Student Registration
              </p>
              <h1
                className="text-2xl sm:text-3xl font-bold text-white leading-tight"
                style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
              >
                {training.title}
              </h1>
            </div>

            {/* Error alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-start gap-3 p-4 rounded-xl mb-6"
                  style={{
                    background: 'rgba(248,113,113,0.08)',
                    border: '1px solid rgba(248,113,113,0.3)',
                  }}
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#f87171' }} />
                  <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} noValidate>
              <div
                className="p-6 rounded-2xl space-y-6 mb-6"
                style={{ background: CARD_BG, border: `1px solid ${BORDER}`, backdropFilter: 'blur(12px)' }}
              >
                {/* ── Personal Info ─────────────────────────────────────── */}
                <FormSection icon={<User className="w-4 h-4" />} title="Personal Information" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Full Name" required>
                    <Input
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  </Field>

                  <Field label="Mobile Number" required hint="10-digit Indian mobile number">
                    <Input
                      type="tel"
                      name="mobile"
                      value={form.mobile}
                      onChange={handleChange}
                      placeholder="9876543210"
                    />
                  </Field>

                  <Field label="Email Address" required>
                    <Input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                    />
                  </Field>

                  <Field label="Gender" required>
                    <Select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      options={GENDER_OPTIONS}
                      placeholder="Select gender"
                    />
                  </Field>

                  <Field label="City" required>
                    <Input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Your city"
                    />
                  </Field>

                  <Field label="State" required>
                    <Select
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      options={INDIAN_STATES}
                      placeholder="Select state"
                    />
                  </Field>

                  <Field label="Date of Birth">
                    <Input
                      type="date"
                      name="date_of_birth"
                      value={form.date_of_birth}
                      onChange={handleChange}
                    />
                  </Field>

                  <Field label="Emergency Contact">
                    <Input
                      type="tel"
                      name="emergency_contact"
                      value={form.emergency_contact}
                      onChange={handleChange}
                      placeholder="Alternate mobile number"
                    />
                  </Field>
                </div>

                <Field label="Address">
                  <Textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Your full address (optional)"
                    rows={2}
                  />
                </Field>
              </div>

              {/* ── Professional Info ────────────────────────────────────── */}
              <div
                className="p-6 rounded-2xl space-y-6 mb-6"
                style={{ background: CARD_BG, border: `1px solid ${BORDER}`, backdropFilter: 'blur(12px)' }}
              >
                <FormSection icon={<Briefcase className="w-4 h-4" />} title="Professional Information" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Company / Organisation">
                    <Input
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Where do you work? (optional)"
                    />
                  </Field>

                  <Field label="Designation / Role">
                    <Input
                      name="designation"
                      value={form.designation}
                      onChange={handleChange}
                      placeholder="Your job title (optional)"
                    />
                  </Field>

                  <Field label="Experience" required>
                    <Select
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      options={EXPERIENCE_OPTIONS}
                      placeholder="Years of experience"
                    />
                  </Field>

                  <Field label="Industry" required>
                    <Select
                      name="industry"
                      value={form.industry}
                      onChange={handleChange}
                      options={INDUSTRY_OPTIONS}
                      placeholder="Your industry"
                    />
                  </Field>
                </div>
              </div>

              {/* ── Terms & Submit ───────────────────────────────────────── */}
              <div
                className="p-6 rounded-2xl space-y-5"
                style={{ background: CARD_BG, border: `1px solid ${BORDER}`, backdropFilter: 'blur(12px)' }}
              >
                {/* Terms checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  {/* Custom styled checkbox */}
                  <div
                    className="relative flex-shrink-0 w-5 h-5 mt-0.5 rounded transition-all duration-200"
                    style={{
                      background: agreed ? `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 100%)` : FIELD_BG,
                      border: `2px solid ${agreed ? GOLD : FIELD_BORDER}`,
                      boxShadow: agreed ? `0 0 10px rgba(212,175,55,0.3)` : 'none',
                    }}
                    onClick={() => setAgreed(v => !v)}
                  >
                    <AnimatePresence>
                      {agreed && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{   scale: 0, opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <CheckCircle className="w-3.5 h-3.5" style={{ color: NAV }} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={e => setAgreed(e.target.checked)}
                      className="sr-only"
                    />
                  </div>
                  <span className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    I agree to the{' '}
                    <span style={{ color: GOLD, cursor: 'pointer' }}>Terms & Conditions</span>
                    {' '}and{' '}
                    <span style={{ color: GOLD, cursor: 'pointer' }}>Privacy Policy</span>.
                    I understand that my registration is subject to confirmation and payment.
                  </span>
                </label>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                  style={{
                    background: submitting
                      ? 'rgba(212,175,55,0.4)'
                      : `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 50%, ${GOLD} 100%)`,
                    color: NAV,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    boxShadow: submitting ? 'none' : '0 0 24px rgba(212,175,55,0.3)',
                  }}
                  whileHover={submitting ? {} : { scale: 1.02, boxShadow: '0 0 36px rgba(212,175,55,0.5)' }}
                  whileTap={submitting ? {} : { scale: 0.98 }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting Registration…
                    </>
                  ) : (
                    <>
                      Complete Registration
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

                <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Your data is secure and will only be used for registration purposes.
                </p>
              </div>
            </form>
          </div>

          {/* ── Sidebar (right 1/3) ───────────────────────────────────────── */}
          <div>
            <TrainingSummary training={training} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
