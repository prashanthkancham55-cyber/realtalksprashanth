'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Trash2, Eye, EyeOff, Loader2, Phone, Building2, MessageCircle, CheckCheck } from 'lucide-react';
import { supabase, type ContactEnquiry } from '@/lib/supabase';
import PageHeader from '@/components/admin/PageHeader';

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [success, setSuccess] = useState('');

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('contact_enquiries').select('*').order('created_at', { ascending: false });
    setEnquiries(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchEnquiries(); }, [fetchEnquiries]);

  const flash = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };

  const handleToggleRead = async (e: ContactEnquiry) => {
    setTogglingId(e.id);
    await supabase.from('contact_enquiries').update({ is_read: !e.is_read }).eq('id', e.id);
    setEnquiries((prev) => prev.map((item) => item.id === e.id ? { ...item, is_read: !e.is_read } : item));
    setTogglingId(null);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await supabase.from('contact_enquiries').delete().eq('id', id);
    flash('Enquiry deleted.');
    fetchEnquiries();
    setDeletingId(null);
  };

  const handleMarkAllRead = async () => {
    await supabase.from('contact_enquiries').update({ is_read: true }).eq('is_read', false);
    fetchEnquiries();
    flash('All enquiries marked as read.');
  };

  const filtered = enquiries.filter((e) => {
    if (filter === 'unread') return !e.is_read;
    if (filter === 'read') return e.is_read;
    return true;
  });

  const unreadCount = enquiries.filter((e) => !e.is_read).length;

  const fmtDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        icon={Mail}
        iconColor="#fb923c"
        iconBg="rgba(251,146,60,0.1)"
        title="Enquiries"
        description="Contact form submissions from website visitors."
        breadcrumbs={[{ label: 'Enquiries' }]}
        actions={
          unreadCount > 0 ? (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border border-white/10 text-white/60 hover:text-white/80 hover:border-white/20 transition-all"
            >
              <CheckCheck className="w-4 h-4" />
              Mark All Read
            </button>
          ) : undefined
        }
      />

      {/* Flash */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="px-4 py-3 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', color: '#86efac' }}
          >
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats + Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-white font-bold text-lg leading-none">{enquiries.length}</p>
            <p className="text-white/35 text-[10px] mt-0.5 uppercase tracking-wider">Total</p>
          </div>
          <div className="px-4 py-2 rounded-xl text-center" style={{ background: 'rgba(251,146,60,0.06)', border: '1px solid rgba(251,146,60,0.15)' }}>
            <p className="text-orange-300 font-bold text-lg leading-none">{unreadCount}</p>
            <p className="text-orange-300/50 text-[10px] mt-0.5 uppercase tracking-wider">Unread</p>
          </div>
          <div className="px-4 py-2 rounded-xl text-center" style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.12)' }}>
            <p className="text-green-300 font-bold text-lg leading-none">{enquiries.length - unreadCount}</p>
            <p className="text-green-300/50 text-[10px] mt-0.5 uppercase tracking-wider">Read</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium transition-all capitalize ${
                filter === f ? 'text-navy-900 rounded-lg mx-0.5 my-0.5' : 'text-white/40 hover:text-white/60'
              }`}
              style={filter === f ? { background: 'linear-gradient(135deg, #f0c040, #d4af37)' } : {}}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.025)' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
          <Mail className="w-10 h-10 text-white/15 mb-3" />
          <p className="text-white/35 text-sm">{filter === 'all' ? 'No enquiries yet.' : `No ${filter} enquiries.`}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {filtered.map((enq, i) => (
              <motion.div
                key={enq.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.04 }}
                className="relative flex flex-col md:flex-row md:items-start gap-4 p-5 rounded-2xl group transition-all"
                style={{
                  background: enq.is_read ? 'rgba(255,255,255,0.018)' : 'rgba(251,146,60,0.04)',
                  border: `1px solid ${enq.is_read ? 'rgba(255,255,255,0.06)' : 'rgba(251,146,60,0.12)'}`,
                }}
              >
                {/* Unread dot */}
                {!enq.is_read && (
                  <div className="absolute top-5 left-5 w-2 h-2 rounded-full bg-orange-400" style={{ boxShadow: '0 0 6px rgba(251,146,60,0.6)' }} />
                )}

                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${!enq.is_read ? 'mt-0' : ''}`}
                  style={{ background: 'rgba(255,255,255,0.06)', marginLeft: !enq.is_read ? '12px' : '0' }}
                >
                  <span className="text-white/60 text-sm font-bold">{enq.name.charAt(0).toUpperCase()}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <span className={`text-sm font-semibold ${enq.is_read ? 'text-white/70' : 'text-white'}`}>{enq.name}</span>
                      {!enq.is_read && <span className="ml-2 text-[9px] font-bold uppercase tracking-wider text-orange-400 border border-orange-400/25 px-1.5 py-0.5 rounded-md bg-orange-400/8">New</span>}
                    </div>
                    <span className="text-white/25 text-xs">{fmtDate(enq.created_at)}</span>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-3">
                    {enq.email && (
                      <span className="flex items-center gap-1.5 text-xs text-white/40">
                        <Mail className="w-3 h-3" />{enq.email}
                      </span>
                    )}
                    {enq.phone && (
                      <span className="flex items-center gap-1.5 text-xs text-white/40">
                        <Phone className="w-3 h-3" />{enq.phone}
                      </span>
                    )}
                    {enq.company && (
                      <span className="flex items-center gap-1.5 text-xs text-white/40">
                        <Building2 className="w-3 h-3" />{enq.company}
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-white/25 flex-shrink-0 mt-0.5" />
                    <p className="text-white/50 text-sm leading-relaxed">{enq.message}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleToggleRead(enq)}
                    disabled={togglingId === enq.id}
                    title={enq.is_read ? 'Mark unread' : 'Mark read'}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border transition-all text-white/40 hover:text-white/70 border-white/10 hover:border-white/20"
                  >
                    {togglingId === enq.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : enq.is_read ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleDelete(enq.id)}
                    disabled={deletingId === enq.id}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    {deletingId === enq.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
