import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Eye,
  Trash2,
  CheckCheck,
  X,
  AlertCircle,
  Inbox,
  Phone,
  Building2,
  Clock,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ds/Button';
import { IconButton } from '../../components/ds/Button';

/* ── Types ───────────────────────────────────────────────────────────────────── */
interface Enquiry {
  id:         string;
  name:       string;
  email:      string;
  phone:      string | null;
  company:    string | null;
  message:    string;
  is_read:    boolean;
  created_at: string;
}

/* ── Helpers ─────────────────────────────────────────────────────────────────── */
function formatDate(iso: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return formatDate(iso);
}

/* ── Skeleton ─────────────────────────────────────────────────────────────────── */
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-lg animate-pulse ${className ?? ''}`}
      style={{ background: 'rgba(255,255,255,0.06)' }}
    />
  );
}

/* ── View Message Modal ───────────────────────────────────────────────────────── */
function ViewModal({
  enquiry,
  onClose,
  onMarkRead,
  onDelete,
  marking,
  deleting,
}: {
  enquiry: Enquiry;
  onClose: () => void;
  onMarkRead: () => void;
  onDelete: () => void;
  marking: boolean;
  deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0"
        style={{ background: 'rgba(2,8,16,0.8)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        className="relative w-full max-w-lg"
        style={{ maxHeight: '90vh' }}
      >
        <div
          className="rounded-2xl overflow-hidden flex flex-col"
          style={{
            background: '#0d1630',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
            maxHeight: '90vh',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{ background: 'rgba(212,175,55,0.12)', color: '#d4af37' }}
              >
                {enquiry.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">{enquiry.name}</h3>
                <a
                  href={`mailto:${enquiry.email}`}
                  className="text-xs hover:opacity-70 transition-opacity"
                  style={{ color: '#d4af37' }}
                >
                  {enquiry.email}
                </a>
              </div>
            </div>
            <IconButton icon={X} variant="default" size="sm" label="Close" onClick={onClose} />
          </div>

          {/* Meta */}
          <div
            className="px-6 py-3 flex flex-wrap gap-x-5 gap-y-2 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.015)' }}
          >
            {enquiry.phone && (
              <div className="flex items-center gap-1.5 text-xs text-white/40">
                <Phone className="w-3.5 h-3.5" />
                {enquiry.phone}
              </div>
            )}
            {enquiry.company && (
              <div className="flex items-center gap-1.5 text-xs text-white/40">
                <Building2 className="w-3.5 h-3.5" />
                {enquiry.company}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <Clock className="w-3.5 h-3.5" />
              {formatDate(enquiry.created_at)}
            </div>
            {!enquiry.is_read && (
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)' }}
              >
                Unread
              </span>
            )}
          </div>

          {/* Message */}
          <div className="px-6 py-5 overflow-y-auto flex-1">
            <div
              className="text-sm text-white/75 leading-relaxed whitespace-pre-wrap rounded-xl p-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              {enquiry.message}
            </div>
          </div>

          {/* Footer actions */}
          <div
            className="flex items-center justify-between gap-3 px-6 py-4 flex-shrink-0"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              loading={deleting}
              onClick={onDelete}
            >
              Delete
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={onClose}>
                Close
              </Button>
              {!enquiry.is_read && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={CheckCheck}
                  loading={marking}
                  onClick={onMarkRead}
                >
                  Mark as Read
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── AdminEnquiries ───────────────────────────────────────────────────────────── */
export default function AdminEnquiries() {
  const [enquiries, setEnquiries]   = useState<Enquiry[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [selected, setSelected]     = useState<Enquiry | null>(null);
  const [filter, setFilter]         = useState<'all' | 'unread' | 'read'>('all');
  const [marking, setMarking]       = useState(false);
  const [deleting, setDeleting]     = useState(false);
  const [deleteId, setDeleteId]     = useState<string | null>(null);
  const [inlineDeleting, setInlineDeleting] = useState(false);

  async function fetchEnquiries() {
    try {
      setLoading(true);
      let q = supabase
        .from('contact_enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter === 'unread') q = q.eq('is_read', false);
      if (filter === 'read')   q = q.eq('is_read', true);

      const { data, error: err } = await q;
      if (err) throw new Error(err.message);
      setEnquiries(data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load enquiries.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchEnquiries(); }, [filter]);

  async function handleMarkRead(id: string) {
    try {
      setMarking(true);
      const { error: err } = await supabase
        .from('contact_enquiries')
        .update({ is_read: true })
        .eq('id', id);
      if (err) throw new Error(err.message);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, is_read: true } : e))
      );
      if (selected?.id === id) setSelected((prev) => prev ? { ...prev, is_read: true } : null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update enquiry.');
    } finally {
      setMarking(false);
    }
  }

  async function handleDelete(id: string, fromModal = false) {
    try {
      if (fromModal) setDeleting(true);
      else setInlineDeleting(true);

      const { error: err } = await supabase
        .from('contact_enquiries')
        .delete()
        .eq('id', id);
      if (err) throw new Error(err.message);
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      if (selected?.id === id) setSelected(null);
      setDeleteId(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete enquiry.');
      setDeleteId(null);
    } finally {
      setDeleting(false);
      setInlineDeleting(false);
    }
  }

  const unreadCount = enquiries.filter((e) => !e.is_read).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1
            className="text-3xl font-semibold text-white"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Enquiries
          </h1>
          <p className="text-sm text-white/40 mt-1">
            View and manage contact enquiries from your website.
            {unreadCount > 0 && (
              <span className="ml-2 font-medium" style={{ color: '#f0c040' }}>
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>

        {/* Filter pills */}
        <div
          className="flex rounded-xl p-1 gap-1"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
              style={
                filter === f
                  ? { background: 'linear-gradient(135deg,#f0c040,#d4af37)', color: '#020810' }
                  : { color: 'rgba(255,255,255,0.45)' }
              }
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div
          className="rounded-xl px-4 py-3 text-sm flex items-center gap-2"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(13,22,48,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* Column headers (desktop) */}
        <div
          className="hidden md:grid grid-cols-[2fr_2fr_1.5fr_3fr_1fr_auto] gap-4 px-5 py-3 text-[11px] font-semibold tracking-wider uppercase text-white/30"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span>Contact</span>
          <span>Email</span>
          <span>Phone</span>
          <span>Message</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {loading ? (
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="w-20 h-6 rounded-full" />
                <Skeleton className="w-16 h-8 rounded-xl" />
              </div>
            ))}
          </div>
        ) : enquiries.length === 0 ? (
          <div className="p-16 text-center">
            <Inbox className="w-10 h-10 text-white/15 mx-auto mb-3" />
            <div className="text-white/30 text-sm">
              {filter === 'all' ? 'No enquiries yet.' : `No ${filter} enquiries.`}
            </div>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <AnimatePresence initial={false}>
              {enquiries.map((enq) => (
                <motion.div
                  key={enq.id}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.18 }}
                  className={[
                    'grid grid-cols-1 md:grid-cols-[2fr_2fr_1.5fr_3fr_1fr_auto] gap-4 px-5 py-4 items-center transition-colors',
                    !enq.is_read ? 'bg-blue-500/[0.02]' : '',
                    'hover:bg-white/[0.02]',
                  ].join(' ')}
                >
                  {/* Contact */}
                  <div className="flex items-center gap-3 min-w-0">
                    {!enq.is_read && (
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: '#60a5fa', boxShadow: '0 0 6px rgba(96,165,250,0.5)' }}
                      />
                    )}
                    <div
                      className={[
                        'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
                        enq.is_read ? '' : '',
                      ].join(' ')}
                      style={{
                        background: enq.is_read ? 'rgba(255,255,255,0.06)' : 'rgba(96,165,250,0.12)',
                        color: enq.is_read ? 'rgba(255,255,255,0.4)' : '#60a5fa',
                      }}
                    >
                      {enq.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className={`text-sm font-medium truncate ${enq.is_read ? 'text-white/70' : 'text-white'}`}>
                        {enq.name}
                      </div>
                      {enq.company && (
                        <div className="text-xs text-white/35 truncate">{enq.company}</div>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <a
                    href={`mailto:${enq.email}`}
                    className="text-sm text-white/55 hover:text-white/80 truncate transition-colors block"
                  >
                    {enq.email}
                  </a>

                  {/* Phone */}
                  <div className="text-sm text-white/45 truncate">
                    {enq.phone ? (
                      <a href={`tel:${enq.phone}`} className="hover:text-white/70 transition-colors">
                        {enq.phone}
                      </a>
                    ) : (
                      <span className="text-white/20">—</span>
                    )}
                  </div>

                  {/* Message excerpt */}
                  <div className="min-w-0">
                    <div className="text-xs text-white/45 line-clamp-2 leading-relaxed">
                      {enq.message}
                    </div>
                    <div className="text-[10px] text-white/25 mt-1">{timeAgo(enq.created_at)}</div>
                  </div>

                  {/* Read status */}
                  <div>
                    {enq.is_read ? (
                      <span
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}
                      >
                        Read
                      </span>
                    ) : (
                      <span
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)' }}
                      >
                        Unread
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    {/* View */}
                    <IconButton
                      icon={Eye}
                      variant="gold"
                      size="sm"
                      label="View message"
                      onClick={() => { setSelected(enq); }}
                    />

                    {/* Mark read */}
                    {!enq.is_read && (
                      <IconButton
                        icon={CheckCheck}
                        variant="default"
                        size="sm"
                        label="Mark as read"
                        onClick={() => handleMarkRead(enq.id)}
                        loading={marking && selected?.id === enq.id}
                      />
                    )}

                    {/* Delete (inline confirm) */}
                    {deleteId === enq.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          className="text-[11px] text-white/40 hover:text-white/70 px-1.5 py-1 rounded-lg transition-colors"
                          onClick={() => setDeleteId(null)}
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <Button
                          variant="danger"
                          size="xs"
                          loading={inlineDeleting}
                          onClick={() => handleDelete(enq.id, false)}
                        >
                          Delete
                        </Button>
                      </div>
                    ) : (
                      <IconButton
                        icon={Trash2}
                        variant="danger"
                        size="sm"
                        label="Delete"
                        onClick={() => setDeleteId(enq.id)}
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Stats footer */}
      {!loading && enquiries.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-white/30">
          <Mail className="w-3.5 h-3.5" />
          {enquiries.length} enquiries shown
          {unreadCount > 0 && ` · ${unreadCount} unread`}
        </div>
      )}

      {/* View Modal */}
      <AnimatePresence>
        {selected && (
          <ViewModal
            enquiry={selected}
            onClose={() => setSelected(null)}
            onMarkRead={() => handleMarkRead(selected.id)}
            onDelete={() => handleDelete(selected.id, true)}
            marking={marking}
            deleting={deleting}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
