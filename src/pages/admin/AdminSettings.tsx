import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Home, User, Mail, Share2, Palette, Search, BarChart3,
  Inbox, ToggleRight, FileText, PanelBottom,
  Save, RotateCcw, Eye, AlertCircle, CheckCircle, Loader2, X,
} from 'lucide-react';
import type { SiteSettings, SectionKey } from '../../types/settings';
import { SECTION_META } from '../../types/settings';
import { DEFAULT_SETTINGS } from '../../types/settings';
import { getSettings, saveSection, resetSection, validateSection } from '../../lib/settingsService';
import { SECTION_RENDERERS } from '../../components/admin/settings/sections';
import { Button } from '../../components/ds/Button';

const ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Settings, Home, User, Mail, Share2, Palette, Search, BarChart3,
  Inbox, ToggleRight, FileText, PanelBottom,
};

type Toast = { type: 'success' | 'error'; msg: string } | null;

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [active, setActive] = useState<SectionKey>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<Toast>(null);
  const [showPreview, setShowPreview] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(id);
  }, [toast]);

  const updateSection = <K extends SectionKey>(key: K, value: SiteSettings[K]) => {
    setSettings(prev => prev ? { ...prev, [key]: value } : prev);
  };

  const handleSave = async () => {
    if (!settings) return;
    const err = validateSection(active, settings[active]);
    if (err) { setToast({ type: 'error', msg: err }); setError(err); return; }
    setSaving(true);
    setError('');
    try {
      await saveSection(active, settings[active]);
      setToast({ type: 'success', msg: `${SECTION_META.find(s => s.key === active)?.label} saved successfully` });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Save failed';
      setToast({ type: 'error', msg });
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!settings) return;
    setResetting(true);
    try {
      const def = await resetSection(active);
      setSettings(prev => prev ? { ...prev, [active]: def } : prev);
      setToast({ type: 'success', msg: `${SECTION_META.find(s => s.key === active)?.label} reset to defaults` });
    } catch (e: unknown) {
      setToast({ type: 'error', msg: e instanceof Error ? e.message : 'Reset failed' });
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#d4af37' }} />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-white/40 text-sm">{error || 'Unable to load settings'}</p>
        <Button onClick={load} variant="outline" size="sm">Retry</Button>
      </div>
    );
  }

  const ActiveRenderer = SECTION_RENDERERS[active];
  const activeMeta = SECTION_META.find(s => s.key === active)!;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <Settings className="w-5 h-5" style={{ color: '#d4af37' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-display">Website Settings</h1>
            <p className="text-white/35 text-xs mt-0.5">Manage every aspect of your website</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={Eye} onClick={() => setShowPreview(true)}>Preview</Button>
          <Button variant="outline" size="sm" icon={RotateCcw} onClick={handleReset} disabled={resetting}>
            {resetting ? 'Resetting…' : 'Reset'}
          </Button>
          <Button size="sm" icon={Save} onClick={handleSave} disabled={saving}
            style={{ background: 'linear-gradient(135deg,#f0c040,#d4af37)', color: '#020810', border: 'none' }}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        {/* Section nav */}
        <aside className="lg:sticky lg:top-6 self-start">
          <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {SECTION_META.map((s) => {
              const Icon = ICONS[s.icon] ?? Settings;
              const isActive = s.key === active;
              return (
                <button
                  key={s.key}
                  onClick={() => setActive(s.key)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all whitespace-nowrap flex-shrink-0 lg:w-full text-left"
                  style={{
                    background: isActive ? 'linear-gradient(135deg,#f0c040,#d4af37)' : 'rgba(255,255,255,0.03)',
                    border: isActive ? 'none' : '1px solid rgba(255,255,255,0.06)',
                    color: isActive ? '#020810' : 'rgba(255,255,255,0.55)',
                  }}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline lg:inline">{s.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Active section form */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl p-6 md:p-8"
          style={{ background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center gap-3 mb-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.18)' }}>
              {(() => { const Icon = ICONS[activeMeta.icon] ?? Settings; return <Icon className="w-4 h-4" style={{ color: '#d4af37' }} />; })()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white font-display">{activeMeta.label}</h2>
              <p className="text-white/30 text-xs">Changes apply to your live website after saving</p>
            </div>
          </div>

          <ActiveRenderer
            value={settings[active]}
            onChange={(v) => updateSection(active, v)}
          />

          {/* Inline actions at bottom */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <Button variant="outline" size="sm" icon={RotateCcw} onClick={handleReset} disabled={resetting}>
              {resetting ? 'Resetting…' : 'Reset to Defaults'}
            </Button>
            <Button size="sm" icon={Save} onClick={handleSave} disabled={saving}
              style={{ background: 'linear-gradient(135deg,#f0c040,#d4af37)', color: '#020810', border: 'none' }}>
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl"
            style={{
              background: toast.type === 'success' ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
              border: `1px solid ${toast.type === 'success' ? 'rgba(74,222,128,0.25)' : 'rgba(248,113,113,0.25)'}`,
              backdropFilter: 'blur(12px)',
            }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            {toast.type === 'success'
              ? <CheckCircle className="w-4 h-4" style={{ color: '#4ade80' }} />
              : <AlertCircle className="w-4 h-4" style={{ color: '#f87171' }} />}
            <span className="text-sm font-medium" style={{ color: toast.type === 'success' ? '#4ade80' : '#f87171' }}>
              {toast.msg}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview modal */}
      {showPreview && settings && (
        <PreviewModal settings={settings} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}

// ── Preview modal ──────────────────────────────────────────────────────────────
function PreviewModal({ settings, onClose }: { settings: SiteSettings; onClose: () => void }) {
  const [tab, setTab] = useState<'general' | 'homepage' | 'branding' | 'contact'>('homepage');
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,8,16,0.88)', backdropFilter: 'blur(10px)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="w-full max-w-4xl max-h-[90vh] rounded-3xl flex flex-col overflow-hidden"
        style={{ background: '#070e1e', border: '1px solid rgba(255,255,255,0.09)' }}
        initial={{ scale: 0.94, y: 24 }} animate={{ scale: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5" style={{ color: '#d4af37' }} />
            <h2 className="text-white font-semibold font-display text-lg">Live Preview</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-7 pt-4">
          {(['homepage', 'general', 'branding', 'contact'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold capitalize transition-all"
              style={{
                background: tab === t ? 'linear-gradient(135deg,#f0c040,#d4af37)' : 'rgba(255,255,255,0.04)',
                border: tab === t ? 'none' : '1px solid rgba(255,255,255,0.08)',
                color: tab === t ? '#020810' : 'rgba(255,255,255,0.5)',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Preview body */}
        <div className="flex-1 overflow-y-auto p-7">
          {tab === 'homepage' && (
            <div className="flex flex-col gap-6">
              {settings.homepage.show_announcement && (
                <div className="px-4 py-2.5 rounded-xl text-center text-sm" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: '#d4af37' }}>
                  {settings.homepage.announcement_bar}
                </div>
              )}
              <div className="rounded-2xl p-8 text-center" style={{ background: settings.branding.secondary_color, border: '1px solid rgba(255,255,255,0.08)' }}>
                <h1 className="text-3xl font-bold font-display text-white">{settings.homepage.hero_title}</h1>
                <p className="text-white/50 mt-2">{settings.homepage.hero_subtitle}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Trainings',    show: settings.homepage.show_trainings },
                  { label: 'Testimonials', show: settings.homepage.show_testimonials },
                  { label: 'Gallery',       show: settings.homepage.show_gallery },
                  { label: 'Videos',        show: settings.homepage.show_videos },
                ].map(s => (
                  <div key={s.label} className="px-4 py-3 rounded-xl text-center text-xs font-semibold"
                    style={{ background: s.show ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${s.show ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.05)'}`, color: s.show ? '#4ade80' : 'rgba(255,255,255,0.3)' }}>
                    {s.label}: {s.show ? 'Visible' : 'Hidden'}
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === 'general' && (
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                ['Site Name', settings.general.site_name],
                ['Tagline', settings.general.tagline],
                ['URL', settings.general.site_url],
                ['Language', settings.general.language],
                ['Timezone', settings.general.timezone],
                ['Currency', settings.general.currency],
              ].map(([l, v]) => (
                <div key={l} className="px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-[10px] uppercase tracking-wider text-white/30">{l}</p>
                  <p className="text-sm text-white/80 mt-1">{v || '—'}</p>
                </div>
              ))}
            </div>
          )}
          {tab === 'branding' && (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-3 gap-4">
                {[
                  ['Logo', settings.branding.logo_url, 'aspect-[3/1]'],
                  ['Favicon', settings.branding.favicon_url, 'aspect-square'],
                  ['OG Image', settings.branding.og_image_url, 'aspect-[1.91/1]'],
                ].map(([label, url, asp]) => (
                  <div key={label as string} className="flex flex-col gap-2">
                    <span className="text-xs text-white/40 font-semibold">{label}</span>
                    <div className={`${asp} rounded-xl overflow-hidden`} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      {url ? <img src={url as string} alt={label as string} className="w-full h-full object-cover" /> : <div className="w-full h-full" />}
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  ['Primary', settings.branding.primary_color],
                  ['Secondary', settings.branding.secondary_color],
                  ['Accent', settings.branding.accent_color],
                ].map(([label, color]) => (
                  <div key={label as string} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="w-8 h-8 rounded-lg" style={{ background: color as string, border: '1px solid rgba(255,255,255,0.1)' }} />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-white/30">{label}</p>
                      <p className="text-xs text-white/70 font-mono">{color}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === 'contact' && (
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                ['Email', settings.contact.email],
                ['Phone', settings.contact.phone],
                ['Address', `${settings.contact.address}, ${settings.contact.city}, ${settings.contact.state}`],
                ['Hours', settings.contact.business_hours],
              ].map(([l, v]) => (
                <div key={l as string} className="px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-[10px] uppercase tracking-wider text-white/30">{l}</p>
                  <p className="text-sm text-white/80 mt-1">{v}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
