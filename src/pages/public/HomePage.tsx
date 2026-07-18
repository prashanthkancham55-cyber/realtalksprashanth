'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, TrendingUp, Crown, Flame, Building2, ArrowRight, CheckCircle2, Star, Award, Users, Quote, ChevronDown, Phone, Mail, MapPin, Send, Loader2, Play, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Training } from '../../types/training';
import { getPublicTrainings, getHeroTraining } from '../../lib/trainingService';
import { getHomepageVideos } from '../../lib/videoService';
import type { Video } from '../../types/video';
import { buildEmbedUrl } from '../../types/video';
import { supabase } from '../../lib/supabase';
import DynamicHero from '../../components/public/DynamicHero';
import UpcomingTrainings from '../../components/public/UpcomingTrainings';
import TrainingPopup from '../../components/public/TrainingPopup';

// ── Static program types ───────────────────────────────────────────────────────
const PROGRAMS = [
  { icon: GraduationCap, title: 'Freshers Training',      color: '#D4AF37', topics: ['Communication Skills','Confidence Building','Interview Preparation','Personality Development','Career Planning'] },
  { icon: TrendingUp,    title: 'Sales Training',          color: '#F7C948', topics: ['Prospecting & Lead Generation','Objection Handling','Negotiation Tactics','Closing Techniques','Follow-up Strategies'] },
  { icon: Crown,         title: 'Leadership Training',     color: '#D4AF37', topics: ['Leadership Mindset','Team Building','Decision Making','Accountability','Performance Management'] },
  { icon: Flame,         title: 'Motivational Session',    color: '#F7C948', topics: ['Self Confidence','Positive Mindset','Goal Achievement','Discipline','Personal Growth'] },
  { icon: Building2,     title: 'Corporate Training',      color: '#D4AF37', topics: ['Leadership Development','Sales Excellence','Employee Engagement','Team Collaboration','Productivity'] },
];

const STATS = [
  { value: '500+', label: 'Professionals Trained' },
  { value: '50+',  label: 'Corporate Clients' },
  { value: '15+',  label: 'Years Experience' },
  { value: '98%',  label: 'Satisfaction Rate' },
];

const WHY_CHOOSE = [
  { icon: Award,  title: 'Certified Trainer',       desc: 'NLP Practitioner and internationally certified corporate trainer with decades of real-world experience.' },
  { icon: Users,  title: 'Proven Track Record',     desc: '500+ professionals transformed across industries — from freshers to C-suite executives.' },
  { icon: Star,   title: 'Customized Programs',     desc: 'Every program is tailored to your industry, team size, and specific performance challenges.' },
  { icon: TrendingUp, title: 'Measurable Results',  desc: 'ROI-focused training with before-and-after assessment, follow-up coaching, and performance metrics.' },
];

const FAQS = [
  { q: 'What types of training programs do you offer?', a: 'We offer Sales Training, Leadership Training, Corporate Training, Freshers Training, and Motivational Sessions. All programs can be customized to suit your organization\'s specific needs.' },
  { q: 'Can training be conducted online?', a: 'Yes! We offer both online and offline training programs. Online sessions are conducted via video conferencing tools, ensuring the same quality and engagement as in-person training.' },
  { q: 'How long are the training programs?', a: 'Program duration varies from half-day workshops (4 hours) to multi-day intensive programs (5+ days). Duration is customized based on the scope and depth required.' },
  { q: 'Do you provide corporate training?', a: 'Absolutely. We specialize in corporate training for teams of all sizes. We work with your HR team to design programs aligned with your business goals and culture.' },
  { q: 'What is the batch size?', a: 'We recommend 15–30 participants per batch for optimal interaction and learning outcomes. Larger batches can be accommodated for keynote or motivational sessions.' },
  { q: 'Is there a certification provided?', a: 'Yes, participants receive a certificate of completion from RealTalks Prashanth upon successful completion of the training program.' },
];

// ── Testimonials (fetched from DB) ────────────────────────────────────────────
interface Testimonial {
  id: string;
  name: string;
  designation: string;
  company: string;
  photo_url: string;
  review: string;
  rating: number;
}

// ── Gallery ───────────────────────────────────────────────────────────────────
interface GalleryImage {
  id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
}

export default function HomePage() {
  const [heroTraining, setHeroTraining] = useState<Training | null>(null);
  const [trainings,    setTrainings]    = useState<Training[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [gallery,      setGallery]      = useState<GalleryImage[]>([]);
  const [videos,       setVideos]       = useState<Video[]>([]);
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
  const [openFaq,      setOpenFaq]      = useState<number | null>(null);

  // Contact form
  const [contact, setContact] = useState({ name: '', phone: '', email: '', company: '', message: '' });
  const [sending,  setSending]  = useState(false);
  const [sent,     setSent]     = useState(false);
  const [sendErr,  setSendErr]  = useState('');

  useEffect(() => {
    Promise.all([
      getHeroTraining(),
      getPublicTrainings(),
      supabase.from('testimonials').select('*').order('created_at', { ascending: false }).limit(6),
      supabase.from('gallery_images').select('*').order('display_order').limit(12),
      getHomepageVideos(),
    ]).then(([hero, pubs, { data: tests }, { data: imgs }, vids]) => {
      setHeroTraining(hero);
      setTrainings(pubs);
      setTestimonials((tests ?? []) as Testimonial[]);
      setGallery((imgs ?? []) as GalleryImage[]);
      setVideos(vids as Video[]);
    });
  }, []);

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.name.trim() || !contact.message.trim()) return;
    setSending(true);
    setSendErr('');
    try {
      const { error } = await supabase.from('contact_enquiries').insert({
        name: contact.name.trim(),
        phone: contact.phone.trim(),
        email: contact.email.trim(),
        company: contact.company.trim(),
        message: contact.message.trim(),
      });
      if (error) throw error;
      setSent(true);
      setContact({ name: '', phone: '', email: '', company: '', message: '' });
    } catch {
      setSendErr('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#020810' }}>
      <TrainingPopup />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section id="hero">
        <DynamicHero heroTraining={heroTraining} />
      </section>

      {/* ── About ─────────────────────────────────────────────────────── */}
      <section id="about" className="section-padding" style={{ background: 'linear-gradient(180deg,#020810 0%,#050b18 100%)' }}>
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
              <span className="section-label">ABOUT PRASHANTH</span>
              <h2 className="heading-display text-4xl sm:text-5xl text-white mt-4 mb-6">
                India's Premier<br /><span className="gold-text">Corporate Trainer</span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                With over 15 years of experience transforming professionals across industries, Prashanth Kumar is a certified NLP Practitioner, motivational speaker, and corporate trainer who has impacted 500+ lives.
              </p>
              <p className="text-white/50 leading-relaxed mb-8">
                His journey from a sales professional to becoming one of India's most sought-after trainers is a testament to the power of continuous learning and authentic leadership. Every program he delivers is backed by real-world experience and a passion for human potential.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {STATS.map((s) => (
                  <div key={s.label} className="glass-card rounded-2xl p-5">
                    <p className="heading-display text-3xl text-white mb-1" style={{ color: '#d4af37' }}>{s.value}</p>
                    <p className="text-white/50 text-sm">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} viewport={{ once: true }} className="relative">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5]">
                <img
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
                  alt="Prashanth Kumar training"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,8,16,0.6) 0%, transparent 50%)' }} />
              </div>
              <div className="absolute -bottom-6 -right-6 glass-card rounded-2xl p-5 max-w-xs" style={{ border: '1px solid rgba(212,175,55,0.25)' }}>
                <p className="text-white font-semibold text-sm">"Transforming Careers,<br />Inspiring Greatness"</p>
                <p className="text-white/40 text-xs mt-2">— Prashanth Kumar</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Me ─────────────────────────────────────────────── */}
      <section className="section-padding" style={{ background: '#050b18' }}>
        <div className="container-max">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="section-label">WHY CHOOSE US</span>
            <h2 className="heading-display text-4xl sm:text-5xl text-white mt-4 mb-4">
              What Sets Us <span className="gold-text">Apart</span>
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} className="glass-card rounded-2xl p-6 group hover:border-gold-500/30 transition-all"
                  initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.6 }} viewport={{ once: true }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <Icon className="w-5 h-5" style={{ color: '#d4af37' }} />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Programs ──────────────────────────────────────────────────── */}
      <section id="programs" className="section-padding" style={{ background: 'linear-gradient(180deg,#0d1630 0%,#050b18 100%)' }}>
        <div className="container-max">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-10" style={{ background: 'linear-gradient(90deg,transparent,#F7C948)' }} />
              <span className="section-label">TRAINING PROGRAMS</span>
              <div className="h-px w-10" style={{ background: 'linear-gradient(90deg,#F7C948,transparent)' }} />
            </div>
            <h2 className="heading-display text-4xl sm:text-5xl text-white mb-4">Programs Built for <span className="gold-text">Excellence</span></h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">Each program is carefully designed to deliver measurable transformation.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {PROGRAMS.map(({ icon: Icon, title, color, topics }, idx) => (
              <motion.div key={title} className="program-card flex flex-col"
                initial={{ opacity: 0, y: 48 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1, duration: 0.6 }} viewport={{ once: true }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                  <Icon className="w-7 h-7" style={{ color }} />
                </div>
                <h3 className="text-white font-semibold text-xl mb-2">{title}</h3>
                <div className="h-px mb-4" style={{ background: `linear-gradient(90deg,${color}40,transparent)` }} />
                <ul className="flex flex-col gap-2 flex-1 mb-4">
                  {topics.map((t) => (
                    <li key={t} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color }} />
                      <span className="text-white/70 text-sm">{t}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/trainings" className="btn-gold flex items-center justify-center gap-2 py-3 rounded-xl text-sm mt-auto">
                  Book Now <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Upcoming Trainings (Dynamic from DB) ──────────────────────── */}
      {trainings.length > 0 && (
        <section id="upcoming" className="section-padding" style={{ background: '#020810' }}>
          <div className="container-max">
            <UpcomingTrainings trainings={trainings} />
          </div>
        </section>
      )}

      {/* ── Gallery ───────────────────────────────────────────────────── */}
      {gallery.length > 0 && (
        <section id="gallery" className="section-padding" style={{ background: '#050b18' }}>
          <div className="container-max">
            <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="section-label">GALLERY</span>
              <h2 className="heading-display text-4xl text-white mt-4">Training in <span className="gold-text">Action</span></h2>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {gallery.map((img, i) => (
                <motion.div key={img.id} className="group relative overflow-hidden rounded-2xl aspect-square"
                  initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                  <img src={img.image_url} alt={img.alt_text} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(212,175,55,0.15)' }} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Videos ────────────────────────────────────────────────────── */}
      {videos.length > 0 && (
        <section id="videos" className="section-padding" style={{ background: 'linear-gradient(180deg,#050b18 0%,#020810 100%)' }}>
          <div className="container-max">
            <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="section-label">VIDEO LIBRARY</span>
              <h2 className="heading-display text-3xl sm:text-4xl text-white mt-4 mb-4">
                Watch Us <span className="gold-text">In Action</span>
              </h2>
              <p className="text-white/50 max-w-lg mx-auto">
                Training sessions, client testimonials, motivational talks and more.
              </p>
            </motion.div>

            {/* Featured video */}
            {(() => {
              const feat = videos.find(v => v.featured);
              return feat ? (
                <motion.div
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className="rounded-3xl p-6 md:p-8 mb-10 grid lg:grid-cols-[1fr_360px] gap-8 items-center"
                  style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}
                >
                  <div
                    className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group"
                    onClick={() => setPlayingVideo(feat)}
                  >
                    {feat.thumbnail_url && (
                      <img src={feat.thumbnail_url} alt={feat.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ background: 'rgba(2,8,16,0.5)' }}>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.9)', boxShadow: '0 8px 32px rgba(212,175,55,0.5)' }}>
                        <Play className="w-7 h-7 ml-1" style={{ color: '#020810' }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#d4af37' }}>★ Featured</span>
                    <h3 className="heading-display text-2xl text-white">{feat.title}</h3>
                    {feat.description && <p className="text-white/50 text-sm leading-relaxed">{feat.description}</p>}
                    <div className="flex gap-3">
                      <button onClick={() => setPlayingVideo(feat)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ background: 'linear-gradient(135deg,#f0c040,#d4af37)', color: '#020810' }}>
                        <Play className="w-4 h-4" /> Watch Now
                      </button>
                      <Link to="/videos" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
                        All Videos
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ) : null;
            })()}

            {/* Grid of remaining videos */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.filter(v => !v.featured).slice(0, 6).map((v, i) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex flex-col rounded-2xl overflow-hidden group cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                  onClick={() => setPlayingVideo(v)}
                >
                  <div className="relative aspect-video flex-shrink-0">
                    {v.thumbnail_url
                      ? <img src={v.thumbnail_url} alt={v.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      : <div className="w-full h-full flex items-center justify-center" style={{ background: '#000' }}><Youtube className="w-8 h-8 text-white/20" /></div>
                    }
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ background: 'rgba(2,8,16,0.55)' }}>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.9)' }}>
                        <Play className="w-5 h-5 ml-0.5" style={{ color: '#020810' }} />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-white/85 text-sm font-semibold line-clamp-2">{v.title}</p>
                    {v.description && <p className="text-white/40 text-xs mt-1 line-clamp-2">{v.description}</p>}
                  </div>
                </motion.div>
              ))}
            </div>

            {videos.length > 6 && (
              <div className="text-center mt-10">
                <Link to="/videos" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#d4af37' }}>
                  View All Videos <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Inline embed modal */}
          {playingVideo && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: 'rgba(2,8,16,0.92)', backdropFilter: 'blur(12px)' }}
              onClick={() => setPlayingVideo(null)}
            >
              <div className="w-full max-w-3xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold text-sm line-clamp-1 mr-4">{playingVideo.title}</h3>
                  <button onClick={() => setPlayingVideo(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/8 transition-all flex-shrink-0">✕</button>
                </div>
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden" style={{ background: '#000' }}>
                  <iframe
                    src={buildEmbedUrl(playingVideo.youtube_id)}
                    title={playingVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── Testimonials ──────────────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section id="testimonials" className="section-padding" style={{ background: 'linear-gradient(180deg,#020810 0%,#050b18 100%)' }}>
          <div className="container-max">
            <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="section-label">TESTIMONIALS</span>
              <h2 className="heading-display text-4xl text-white mt-4">What Our <span className="gold-text">Students Say</span></h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div key={t.id} className="glass-card rounded-2xl p-6 flex flex-col gap-4"
                  initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                  <Quote className="w-8 h-8 opacity-30" style={{ color: '#d4af37' }} />
                  <p className="text-white/70 text-sm leading-relaxed flex-1">"{t.review}"</p>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className={`w-3.5 h-3.5 ${j < t.rating ? 'fill-current' : 'opacity-30'}`} style={{ color: '#d4af37' }} />
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                    {t.photo_url ? (
                      <img src={t.photo_url} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37' }}>
                        {t.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-white font-semibold text-sm">{t.name}</p>
                      <p className="text-white/40 text-xs">{[t.designation, t.company].filter(Boolean).join(', ')}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section id="faq" className="section-padding" style={{ background: '#050b18' }}>
        <div className="container-max max-w-3xl">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="section-label">FAQ</span>
            <h2 className="heading-display text-4xl text-white mt-4">Frequently Asked <span className="gold-text">Questions</span></h2>
          </motion.div>
          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <motion.div key={i} className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} viewport={{ once: true }}>
                <button className="w-full flex items-center justify-between p-5 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="text-white font-medium text-sm pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} style={{ color: '#d4af37' }} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-white/60 text-sm leading-relaxed">{faq.a}</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ───────────────────────────────────────────────────── */}
      <section id="contact" className="section-padding" style={{ background: 'linear-gradient(180deg,#020810 0%,#050b18 100%)' }}>
        <div className="container-max">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="section-label">CONTACT</span>
            <h2 className="heading-display text-4xl text-white mt-4">Get in <span className="gold-text">Touch</span></h2>
            <p className="text-white/60 mt-4 max-w-xl mx-auto">Ready to transform your career or team? Let's start a conversation.</p>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact info */}
            <div className="flex flex-col gap-6">
              {[
                { icon: Phone, label: 'Call Us', value: '+91 98765 43210' },
                { icon: Mail,  label: 'Email', value: 'prashanth@realtalks.in' },
                { icon: MapPin, label: 'Location', value: 'Hyderabad, Telangana, India' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <Icon className="w-5 h-5" style={{ color: '#d4af37' }} />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-white font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Contact form */}
            <form onSubmit={handleContact} className="flex flex-col gap-4">
              {sent ? (
                <div className="flex flex-col items-center justify-center p-10 text-center rounded-2xl" style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.2)' }}>
                  <CheckCircle2 className="w-12 h-12 text-green-400 mb-3" />
                  <p className="text-white font-semibold">Message Sent!</p>
                  <p className="text-white/50 text-sm mt-1">We'll get back to you within 24 hours.</p>
                  <button type="button" onClick={() => setSent(false)} className="mt-4 text-gold-400 text-sm underline underline-offset-2">Send another message</button>
                </div>
              ) : (
                <>
                  {sendErr && <p className="text-red-400 text-sm">{sendErr}</p>}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input required placeholder="Your Name *" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} className="admin-input" />
                    <input placeholder="Phone Number" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className="admin-input" />
                    <input type="email" placeholder="Email Address" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className="admin-input" />
                    <input placeholder="Company / Organization" value={contact.company} onChange={(e) => setContact({ ...contact, company: e.target.value })} className="admin-input" />
                  </div>
                  <textarea required rows={4} placeholder="Your Message *" value={contact.message} onChange={(e) => setContact({ ...contact, message: e.target.value })} className="admin-input resize-none" />
                  <button type="submit" disabled={sending} className="btn-gold flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold disabled:opacity-60">
                    {sending ? <><Loader2 className="w-4 h-4 animate-spin" />Sending...</> : <><Send className="w-4 h-4" />Send Message</>}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
