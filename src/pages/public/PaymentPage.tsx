import { useEffect, type ReactNode } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Home,
  LayoutGrid,
  Smartphone,
  Building2,
  Banknote,
  ChevronRight,
  Mail,
  Phone,
  Clock,
  CreditCard,
  Bell,
  Award,
} from 'lucide-react';
import type { StudentRegistration } from '../../types/registration';
import type { Training }            from '../../types/training';
import { formatDate, formatPrice }  from '../../types/training';

// ── Design tokens ─────────────────────────────────────────────────────────────
const GOLD  = '#d4af37';
const GOLD2 = '#f0c040';
const NAV   = '#020810';
const CARD_BG = 'rgba(13,22,48,0.85)';
const BORDER  = 'rgba(212,175,55,0.18)';

// ── Location state shape ──────────────────────────────────────────────────────
interface PageState {
  registration?: StudentRegistration;
  training?:     Training;
}

// ── Animation variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// ── Success checkmark animation ───────────────────────────────────────────────
function SuccessAnimation() {
  return (
    <div className="relative flex items-center justify-center mb-8">
      {/* Outer pulsing ring */}
      <motion.div
        className="absolute w-32 h-32 rounded-full"
        style={{ background: 'rgba(74,222,128,0.06)', border: '2px solid rgba(74,222,128,0.15)' }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.3, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Middle ring */}
      <motion.div
        className="absolute w-24 h-24 rounded-full"
        style={{ background: 'rgba(74,222,128,0.08)', border: '1.5px solid rgba(74,222,128,0.25)' }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 0.4, 0.8] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      />
      {/* Inner circle */}
      <motion.div
        className="relative w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)', boxShadow: '0 0 30px rgba(74,222,128,0.4)' }}
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
      >
        <CheckCircle className="w-8 h-8 text-white" />
      </motion.div>
    </div>
  );
}

// ── Payment method card ───────────────────────────────────────────────────────
function PaymentMethodCard({
  icon,
  title,
  description,
  color,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div
      className="flex items-start gap-3 p-4 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.08)` }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}33` }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{description}</p>
      </div>
    </div>
  );
}

// ── Next-step item ────────────────────────────────────────────────────────────
function NextStep({
  step,
  icon,
  title,
  description,
}: {
  step: number;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      {/* Step number */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
        style={{
          background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 100%)`,
          color: NAV,
          boxShadow: '0 0 12px rgba(212,175,55,0.3)',
        }}
      >
        {step}
      </div>
      <div className="flex-1 pt-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span style={{ color: GOLD }}>{icon}</span>
          <p className="text-sm font-semibold text-white">{title}</p>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
          {description}
        </p>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PaymentPage() {
  const { registrationId } = useParams<{ registrationId: string }>();
  const location           = useLocation();
  const navigate           = useNavigate();

  const state: PageState = (location.state as PageState) || {};
  const { registration, training } = state;

  useEffect(() => {
    document.title = 'Registration Confirmed | RealTalks';
    return () => { document.title = 'RealTalks | Prashanth Kumar'; };
  }, []);

  // Derive display ID — prefer state, fall back to URL param
  const displayId = registration?.registration_id ?? registrationId ?? 'N/A';

  return (
    <div style={{ background: NAV, minHeight: '100vh' }}>
      {/* ── Simple header ─────────────────────────────────────────────────── */}
      <div
        className="h-14 flex items-center px-4 sm:px-6 lg:px-8"
        style={{ borderBottom: `1px solid ${BORDER}` }}
      >
        <Link to="/" className="flex items-center gap-2">
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
            className="text-sm font-semibold text-white"
            style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
          >
            RealTalks
          </span>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── Success section ──────────────────────────────────────────────── */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center mb-10"
        >
          <SuccessAnimation />

          <h1
            className="text-3xl sm:text-4xl font-bold text-white mb-2"
            style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
          >
            Registration Confirmed!
          </h1>
          <p className="text-base" style={{ color: 'rgba(255,255,255,0.55)' }}>
            You've successfully registered. Our team will contact you shortly.
          </p>
        </motion.div>

        {/* ── Registration ID card ─────────────────────────────────────────── */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="p-6 rounded-2xl text-center mb-6"
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(13,22,48,0.9) 100%)',
            border: `1px solid ${BORDER}`,
            backdropFilter: 'blur(12px)',
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Your Registration ID
          </p>
          <p
            className="text-3xl sm:text-4xl font-bold tracking-wider mb-3"
            style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 50%, ${GOLD} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {displayId}
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Save this ID for future reference
          </p>
        </motion.div>

        {/* ── Training details ─────────────────────────────────────────────── */}
        {training && (
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="p-5 rounded-2xl mb-6"
            style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
          >
            <div className="flex items-start gap-4">
              {training.banner_url && (
                <div className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={training.banner_url}
                    alt={training.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3
                  className="text-base font-bold text-white leading-snug mb-1"
                  style={{ fontFamily: 'Cormorant Garamond, Georgia, serif' }}
                >
                  {training.title}
                </h3>
                <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  by {training.trainer_name}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {training.start_date && (
                    <span>{formatDate(training.start_date)}</span>
                  )}
                  <span style={{ color: GOLD }}>{training.mode}</span>
                  {training.price > 0 && (
                    <span className="font-semibold" style={{ color: GOLD }}>
                      {formatPrice(training.price)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Registrant details ───────────────────────────────────────────── */}
        {registration && (
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="p-5 rounded-2xl mb-6"
            style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
          >
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" style={{ color: GOLD }} />
              Registered Participant
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {[
                { icon: <span className="text-xs">👤</span>, label: registration.full_name },
                { icon: <Mail    className="w-3.5 h-3.5" />, label: registration.email    },
                { icon: <Phone   className="w-3.5 h-3.5" />, label: registration.mobile   },
                { icon: <span className="text-xs">📍</span>,  label: `${registration.city}, ${registration.state}` },
              ].map(({ icon, label }, i) => (
                <div key={i} className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  <span style={{ color: GOLD }}>{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Payment info banner ──────────────────────────────────────────── */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="p-5 rounded-2xl mb-6"
          style={{
            background: 'rgba(96,165,250,0.06)',
            border: '1px solid rgba(96,165,250,0.2)',
          }}
        >
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#60a5fa' }} />
            <div>
              <p className="text-sm font-semibold text-white mb-1">Payment Collection</p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Payment will be collected via{' '}
                <strong style={{ color: 'white' }}>bank transfer</strong> /{' '}
                <strong style={{ color: 'white' }}>UPI</strong>. Our team will contact you
                within <strong style={{ color: 'white' }}>24 hours</strong> with payment details.
              </p>
              <p className="text-xs mt-2 font-medium" style={{ color: '#60a5fa' }}>
                ✓ Payment integration coming soon — Your registration is saved
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Payment methods ──────────────────────────────────────────────── */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="p-5 rounded-2xl mb-6"
          style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
        >
          <h4 className="text-sm font-semibold text-white mb-4">Accepted Payment Methods</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <PaymentMethodCard
              icon={<Smartphone className="w-4 h-4" />}
              title="UPI"
              description="PhonePe, GPay, Paytm, BHIM"
              color="#a78bfa"
            />
            <PaymentMethodCard
              icon={<Building2 className="w-4 h-4" />}
              title="Bank Transfer"
              description="NEFT / RTGS / IMPS"
              color="#60a5fa"
            />
            <PaymentMethodCard
              icon={<Banknote className="w-4 h-4" />}
              title="Cash"
              description="In-person at venue"
              color="#4ade80"
            />
          </div>
        </motion.div>

        {/* ── What happens next ────────────────────────────────────────────── */}
        <motion.div
          custom={6}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="p-5 rounded-2xl mb-8"
          style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
        >
          <h4 className="text-sm font-semibold text-white mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4" style={{ color: GOLD }} />
            What Happens Next
          </h4>

          <div className="space-y-5">
            <NextStep
              step={1}
              icon={<Phone className="w-3.5 h-3.5" />}
              title="Team Contacts You"
              description="Our team will call or WhatsApp you within 24 hours to confirm your seat and share payment details."
            />
            <div className="h-px ml-4" style={{ background: BORDER }} />
            <NextStep
              step={2}
              icon={<CreditCard className="w-3.5 h-3.5" />}
              title="Complete Payment"
              description="Transfer the program fee via UPI or bank transfer as per the details shared by our team."
            />
            <div className="h-px ml-4" style={{ background: BORDER }} />
            <NextStep
              step={3}
              icon={<Bell className="w-3.5 h-3.5" />}
              title="Receive Confirmation"
              description="You will receive a confirmation email and WhatsApp message with all training details."
            />
            <div className="h-px ml-4" style={{ background: BORDER }} />
            <NextStep
              step={4}
              icon={<Award className="w-3.5 h-3.5" />}
              title="Join the Training"
              description="Attend the program, learn from Prashanth Kumar, and earn your completion certificate."
            />
          </div>
        </motion.div>

        {/* ── CTA buttons ──────────────────────────────────────────────────── */}
        <motion.div
          custom={7}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            onClick={() => navigate('/trainings')}
            className="flex-1 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 50%, ${GOLD} 100%)`,
              color: NAV,
              boxShadow: '0 0 20px rgba(212,175,55,0.3)',
            }}
            whileHover={{ scale: 1.02, boxShadow: '0 0 32px rgba(212,175,55,0.5)' }}
            whileTap={{ scale: 0.98 }}
          >
            <LayoutGrid className="w-4 h-4" />
            Browse More Programs
          </motion.button>

          <motion.button
            onClick={() => navigate('/')}
            className="flex-1 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
            style={{
              background: 'transparent',
              border: `1px solid ${BORDER}`,
              color: 'rgba(255,255,255,0.7)',
            }}
            whileHover={{ borderColor: GOLD, color: GOLD }}
            whileTap={{ scale: 0.98 }}
          >
            <Home className="w-4 h-4" />
            Go to Home
          </motion.button>
        </motion.div>

        {/* ── Footer note ──────────────────────────────────────────────────── */}
        <motion.p
          custom={8}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-center text-xs mt-8"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          Questions? Contact us at{' '}
          <a href="mailto:info@realtalks.in" style={{ color: GOLD }}>
            info@realtalks.in
          </a>
          {' '}or WhatsApp us.
        </motion.p>
      </div>
    </div>
  );
}
