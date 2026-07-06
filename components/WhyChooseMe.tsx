'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, Crown, Building2, Home, TrendingUp, Target } from 'lucide-react';

const reasons = [
  {
    icon: Zap,
    title: 'Practical Training',
    description: 'Every session is hands-on and immediately actionable. Participants leave with real skills they can apply the very next day — no fluff, just results.',
    accent: '#D4AF37',
  },
  {
    icon: Crown,
    title: 'Leadership Development',
    description: 'Proven frameworks that build visionary, confident leaders who inspire their teams, drive culture and deliver extraordinary business outcomes.',
    accent: '#7C3AED',
  },
  {
    icon: Building2,
    title: 'Corporate Workshops',
    description: 'Engaging, high-impact workshops tailored for corporate teams of all sizes. Designed to align with your organization\'s goals and culture.',
    accent: '#D4AF37',
  },
  {
    icon: Home,
    title: 'Real Estate Expertise',
    description: 'Deep industry-specific knowledge in real estate sales, client acquisition, negotiations and closing — relevant for agents and developers alike.',
    accent: '#7C3AED',
  },
  {
    icon: TrendingUp,
    title: 'Business Growth',
    description: 'Strategic training that directly links to revenue growth. Sales methodologies, business development and performance mindsets that move the needle.',
    accent: '#D4AF37',
  },
  {
    icon: Target,
    title: 'Results Driven',
    description: 'Every program is engineered around measurable outcomes. KPIs, follow-up coaching and performance tracking ensure your investment pays off.',
    accent: '#7C3AED',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' as const } },
};

export default function WhyChooseMe() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      className="relative section-padding overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #061326 0%, #0B1E3A 100%)' }}
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(212,175,55,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.6) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="container-max" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg, transparent, #7C3AED)' }} />
            <span className="section-label">WHY CHOOSE ME</span>
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg, #D4AF37, transparent)' }} />
          </div>
          <h2 className="heading-display text-4xl sm:text-5xl text-white mb-4">
            The RealTalks{' '}
            <span className="gold-text">Difference</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#8a95a6' }}>
            Six pillars of excellence that make every training experience truly transformative.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {reasons.map(({ icon: Icon, title, description, accent }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              className="group program-card cursor-default"
            >
              <div className="relative z-10 flex flex-col gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-400 group-hover:scale-110"
                  style={{
                    background: `${accent}14`,
                    border: `1px solid ${accent}30`,
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: accent }} />
                </div>

                <div>
                  <h3
                    className="font-semibold text-lg mb-2 transition-colors duration-300"
                    style={{ color: '#FFFFFF' }}
                  >
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#8a95a6' }}>{description}</p>
                </div>

                {/* Animated underline */}
                <div
                  className="h-px w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
