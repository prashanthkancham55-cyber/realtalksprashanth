'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, TrendingUp, Crown, Flame, Building2, ArrowRight, CheckCircle2 } from 'lucide-react';

const programs = [
  {
    icon: GraduationCap,
    title: 'Freshers Training',
    description: 'Equip fresh graduates and early-career professionals with the essential skills to enter and thrive in the corporate world with confidence and clarity.',
    color: '#D4AF37',
    topics: [
      'Communication Skills',
      'Confidence Building',
      'Interview Preparation',
      'Personality Development',
      'Career Planning',
    ],
  },
  {
    icon: TrendingUp,
    title: 'Sales Training',
    description: 'Master proven sales frameworks that turn prospects into loyal clients. Covering every stage of the pipeline — from first contact to final close.',
    color: '#F7C948',
    topics: [
      'Prospecting & Lead Generation',
      'Objection Handling',
      'Negotiation Tactics',
      'Closing Techniques',
      'Follow-up Strategies',
    ],
  },
  {
    icon: Crown,
    title: 'Leadership Training',
    description: 'Build the leadership qualities that inspire teams, drive culture and produce extraordinary outcomes — from emerging managers to senior executives.',
    color: '#D4AF37',
    topics: [
      'Leadership Mindset',
      'Team Building',
      'Decision Making',
      'Accountability',
      'Performance Management',
    ],
  },
  {
    icon: Flame,
    title: 'Motivational Session',
    description: 'Unlock peak performance through mindset transformation. Learn the mental frameworks top performers use to stay driven, resilient and focused.',
    color: '#F7C948',
    topics: [
      'Self Confidence',
      'Positive Mindset',
      'Goal Achievement',
      'Discipline',
      'Personal Growth',
    ],
  },
  {
    icon: Building2,
    title: 'Corporate Training',
    description: 'High-impact workshops tailored for corporate teams of all sizes — designed to align with your organization\'s goals, culture and performance targets.',
    color: '#D4AF37',
    topics: [
      'Leadership Development',
      'Sales Excellence',
      'Employee Engagement',
      'Team Collaboration',
      'Productivity & Customer Experience',
    ],
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
};

export default function TrainingPrograms() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="programs" className="relative section-padding overflow-hidden" style={{ background: 'linear-gradient(180deg, #0d1630 0%, #050b18 100%)' }}>
      {/* Decorative blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'rgba(247,201,72,0.4)' }} />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 rounded-full blur-3xl opacity-8 pointer-events-none"
        style={{ background: 'rgba(124,58,237,0.3)' }} />

      <div className="container-max" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg, transparent, #F7C948)' }} />
            <span className="section-label">TRAINING PROGRAMS</span>
            <div className="h-px w-10" style={{ background: 'linear-gradient(90deg, #F7C948, transparent)' }} />
          </div>
          <h2 className="heading-display text-4xl sm:text-5xl text-white mb-4">
            Programs Built for{' '}
            <span className="gold-text">Excellence</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Each program is carefully designed to deliver measurable transformation — from individual contributors to entire organizations.
          </p>
        </motion.div>

        {/* Cards grid — 2 cols on md, 3 cols on lg, last card spans full in odd count */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {programs.map(({ icon: Icon, title, description, color, topics }, idx) => (
            <motion.div
              key={title}
              variants={cardVariants}
              className={`group program-card flex flex-col ${
                idx === programs.length - 1 && programs.length % 3 === 2
                  ? 'sm:col-span-2 lg:col-span-1'
                  : ''
              }`}
            >
              <div className="relative z-10 flex flex-col flex-1 gap-4">
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                >
                  <Icon className="w-7 h-7" style={{ color }} />
                </div>

                {/* Title & description */}
                <div>
                  <h3 className="text-white font-semibold text-xl mb-2 group-hover:text-gold-400 transition-colors duration-300">
                    {title}
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed">{description}</p>
                </div>

                {/* Divider */}
                <div className="h-px" style={{ background: `linear-gradient(90deg, ${color}40, transparent)` }} />

                {/* Topics bullet list */}
                <ul className="flex flex-col gap-2 flex-1">
                  {topics.map((topic) => (
                    <li key={topic} className="flex items-start gap-2.5">
                      <CheckCircle2
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        style={{ color }}
                      />
                      <span className="text-white/70 text-sm">{topic}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={scrollToContact}
                  className="btn-gold flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold mt-2"
                >
                  Book Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}

          {/* Custom program card */}
          <motion.div
            variants={cardVariants}
            className="group cursor-pointer"
            onClick={scrollToContact}
          >
            <div
              className="h-full min-h-[300px] rounded-2xl flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gold-500/25 transition-all duration-400 hover:border-gold-500/50 hover:bg-gold-500/5 p-8 text-center"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(247,201,72,0.1)', border: '1px solid rgba(247,201,72,0.25)' }}
              >
                <ArrowRight className="w-6 h-6 text-gold-400" />
              </div>
              <h3 className="text-gold-400 font-semibold text-lg">Custom Program</h3>
              <p className="text-white/50 text-sm">Need a tailored program for your team? Let&apos;s design one together.</p>
              <span className="text-gold-500 text-sm font-semibold underline underline-offset-2">Get in Touch</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
