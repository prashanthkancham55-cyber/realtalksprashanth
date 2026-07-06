'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'What training programs do you offer?',
    a: "I offer a comprehensive range of programs including Sales Training, Leadership Development, Motivation & Mindset, Communication Skills, and Real Estate Sales Mastery. Each program can be delivered as standalone workshops or as part of a longer training series, customized to your organization's specific needs and goals.",
  },
  {
    q: 'Who can attend your sessions?',
    a: 'My sessions are designed for professionals at all levels — from fresh graduates entering the workforce to C-suite executives. Programs are tailored for corporate teams, sales professionals, entrepreneurs, real estate agents, and anyone committed to personal and professional growth.',
  },
  {
    q: 'Are programs customized for different industries?',
    a: "Absolutely. I believe one-size-fits-all training rarely delivers lasting results. Every program I deliver is thoroughly customized to your industry, team dynamics, organizational culture, and specific business challenges. We begin with a detailed discovery call to understand your needs before designing the curriculum.",
  },
  {
    q: 'How do I book a session?',
    a: 'Booking is simple! Fill out the contact form below or click the "Book a Free Discovery Call" button. We\'ll schedule a complimentary 30-minute discovery call to understand your requirements, discuss program options, and put together a tailored proposal for your team.',
  },
  {
    q: 'Do you provide online training?',
    a: 'Yes, I deliver both in-person and virtual training sessions. Online programs are conducted via Zoom or other platforms of your choice, with the same level of engagement and interactivity as in-person sessions. I also offer hybrid formats for geographically distributed teams.',
  },
];

function FAQItem({ question, answer, isOpen, onToggle }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? 'border-gold-500/30 bg-gold-500/5'
          : 'border-white/8 bg-white/3 hover:border-white/15'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className={`font-medium text-base transition-colors duration-300 ${isOpen ? 'text-gold-400' : 'text-white/90'}`}>
          {question}
        </span>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-gold-500 text-navy-900 rotate-0'
            : 'bg-white/8 text-white/60'
        }`}>
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-6">
              <div className="h-px mb-4" style={{ background: 'rgba(212,175,55,0.2)' }} />
              <p className="text-white/65 leading-relaxed text-base">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative section-padding overflow-hidden" style={{ background: 'linear-gradient(180deg, #0d1630 0%, #050b18 100%)' }}>
      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full blur-3xl opacity-8 pointer-events-none"
        style={{ background: 'rgba(212,175,55,0.3)' }} />

      <div className="container-max" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Header */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:sticky lg:top-28"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-gold-500" />
              <span className="section-label">FAQ</span>
            </div>
            <h2 className="heading-display text-4xl sm:text-5xl text-white mb-6 leading-tight">
              Frequently Asked{' '}
              <span className="gold-text">Questions</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-8">
              Have questions? Here are answers to the most common ones. Don&apos;t see what you&apos;re looking for?
            </p>
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-gold flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold"
            >
              Ask a Question
            </button>

            {/* Stats */}
            <div className="flex gap-8 mt-12">
              {[
                { value: '500+', label: 'Sessions Delivered' },
                { value: '100%', label: 'Customized Programs' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="heading-display text-3xl font-bold gold-text">{value}</div>
                  <div className="text-white/50 text-sm">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col gap-3"
          >
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                question={faq.q}
                answer={faq.a}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
