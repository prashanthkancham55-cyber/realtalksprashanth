'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Globe, MessageCircle, Send, CheckCircle, Loader2, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const contactInfo = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 81430 62777',
    href: 'tel:+918143062777',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'speakers@realtalksprashanth.in',
    href: 'mailto:speakers@realtalksprashanth.in',
  },
  {
    icon: Globe,
    label: 'Website',
    value: 'www.realtalksprashanth.in',
    href: 'https://www.realtalksprashanth.in',
  },
];

interface FormState {
  name: string;
  phone: string;
  email: string;
  company: string;
  message: string;
}

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [form, setForm] = useState<FormState>({ name: '', phone: '', email: '', company: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const { error } = await supabase
        .from('contact_enquiries')
        .insert({
          name: form.name,
          phone: form.phone || null,
          email: form.email || null,
          company: form.company || null,
          message: form.message,
        });
      if (error) throw error;
      setStatus('success');
      setForm({ name: '', phone: '', email: '', company: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section id="contact" className="relative section-padding overflow-hidden" style={{ background: 'linear-gradient(180deg, #050b18 0%, #0a0f1e 100%)' }}>
      {/* BG glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full blur-3xl opacity-8 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(212,175,55,0.3) 0%, transparent 70%)' }}
      />

      <div className="container-max" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-gold-500" />
            <span className="section-label">CONTACT</span>
            <div className="h-px w-10 bg-gold-500" />
          </div>
          <h2 className="heading-display text-4xl sm:text-5xl text-white mb-4">
            Let&apos;s{' '}
            <span className="gold-text">Connect</span>
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Ready to elevate your team? Reach out and let&apos;s explore how we can create transformation together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            <div className="glass-card rounded-2xl p-8 flex flex-col gap-6">
              <h3 className="heading-display text-2xl text-white">Get In Touch</h3>
              <div className="divider-gold" />

              <div className="flex flex-col gap-5">
                {contactInfo.map(({ icon: Icon, label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-start gap-4 group"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                      style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}
                    >
                      <Icon className="w-5 h-5 text-gold-500" />
                    </div>
                    <div>
                      <div className="text-white/50 text-xs font-medium uppercase tracking-wider mb-0.5">{label}</div>
                      <div className="text-white/85 text-sm group-hover:text-gold-400 transition-colors duration-200 break-all">{value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA — green button */}
            <a
              href="https://wa.me/918143062777"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95"
              style={{ background: '#25D366' }}
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              Chat on WhatsApp
            </a>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 flex flex-col gap-5">
              <h3 className="heading-display text-2xl text-white mb-1">Send a Message</h3>
              <div className="divider-gold mb-2" />

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/60 text-sm font-medium">Full Name *</label>
                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-gold-500/50 focus:bg-white/8 transition-all duration-200"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-white/60 text-sm font-medium">Phone Number *</label>
                  <input
                    required
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 81430 62777"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-gold-500/50 focus:bg-white/8 transition-all duration-200"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-white/60 text-sm font-medium">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-gold-500/50 focus:bg-white/8 transition-all duration-200"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-white/60 text-sm font-medium">Company Name</label>
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Your company or organization"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-gold-500/50 focus:bg-white/8 transition-all duration-200"
                  />
                </div>

                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-white/60 text-sm font-medium">Message *</label>
                  <textarea
                    required
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell me about your team's training needs, goals, and any specific requirements..."
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-gold-500/50 focus:bg-white/8 transition-all duration-200 resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-base mt-1 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
                style={
                  status === 'success'
                    ? { background: '#22c55e', color: '#fff' }
                    : { background: 'linear-gradient(135deg, #f0c040 0%, #d4af37 50%, #c9a84c 100%)', color: '#0a0f1e' }
                }
              >
                {status === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
                {status === 'success' && <CheckCircle className="w-5 h-5" />}
                {status === 'idle' && <Send className="w-5 h-5" />}
                {status === 'loading' && 'Sending...'}
                {status === 'success' && "Message Sent! We'll be in touch soon."}
                {status === 'idle' && 'Send Message'}
                {status === 'error' && 'Try Again'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
