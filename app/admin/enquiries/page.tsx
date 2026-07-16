'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Eye, EyeOff, Phone, Building2, MessageCircle, CheckCheck } from 'lucide-react';
import { supabase, type ContactEnquiry } from '@/lib/supabase';
import PageHeader from '@/components/admin/PageHeader';
import {
  Button, IconButton, Badge, EmptyState, ListSkeleton,
  SectionHeader, ConfirmDialog, Tabs, type TabItem,
} from '@/components/ds';
import { Trash2 } from 'lucide-react';

const FILTER_TABS: TabItem[] = [
  { id: 'all',    label: 'All' },
  { id: 'unread', label: 'Unread' },
  { id: 'read',   label: 'Read' },
];

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [flash, setFlash] = useState('');

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('contact_enquiries').select('*').order('created_at', { ascending: false });
    setEnquiries(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchEnquiries(); }, [fetchEnquiries]);

  const notify = (msg: string) => { setFlash(msg); setTimeout(() => setFlash(''), 3000); };

  const handleToggleRead = async (e: ContactEnquiry) => {
    setTogglingId(e.id);
    await supabase.from('contact_enquiries').update({ is_read: !e.is_read }).eq('id', e.id);
    setEnquiries((prev) => prev.map((item) => item.id === e.id ? { ...item, is_read: !e.is_read } : item));
    setTogglingId(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await supabase.from('contact_enquiries').delete().eq('id', deleteTarget);
    setDeleteTarget(null);
    setDeleting(false);
    notify('Enquiry deleted.');
    fetchEnquiries();
  };

  const handleMarkAllRead = async () => {
    await supabase.from('contact_enquiries').update({ is_read: true }).eq('is_read', false);
    fetchEnquiries();
    notify('All enquiries marked as read.');
  };

  const unreadCount = enquiries.filter((e) => !e.is_read).length;

  const tabsWithBadge: TabItem[] = FILTER_TABS.map((t) => ({
    ...t,
    badge: t.id === 'unread' ? unreadCount || undefined
         : t.id === 'all'    ? enquiries.length || undefined
         : undefined,
  }));

  const filtered = enquiries.filter((e) => {
    if (filter === 'unread') return !e.is_read;
    if (filter === 'read') return e.is_read;
    return true;
  });

  const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

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
            <Button variant="secondary" icon={CheckCheck} onClick={handleMarkAllRead}>
              Mark All Read
            </Button>
          ) : undefined
        }
      />

      {/* Flash */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="px-4 py-3 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', color: '#86efac' }}
          >
            {flash}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats row + filter tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-wrap">
        {/* Mini stats */}
        <div className="flex items-center gap-3">
          {[
            { label: 'Total', value: enquiries.length, color: 'rgba(255,255,255,0.6)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)' },
            { label: 'Unread', value: unreadCount, color: '#fb923c', bg: 'rgba(251,146,60,0.06)', border: 'rgba(251,146,60,0.18)' },
            { label: 'Read', value: enquiries.length - unreadCount, color: '#4ade80', bg: 'rgba(74,222,128,0.05)', border: 'rgba(74,222,128,0.15)' },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center px-4 py-2.5 rounded-xl min-w-[64px]" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
              <span className="text-lg font-bold leading-none" style={{ color: s.color, fontFamily: 'Cormorant Garamond, serif' }}>{s.value}</span>
              <span className="text-[10px] font-medium uppercase tracking-wider mt-1" style={{ color: `${s.color}80` }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filter */}
        <Tabs items={tabsWithBadge} active={filter} onChange={setFilter} variant="segment" size="sm" />
      </div>

      {/* List */}
      <div>
        <SectionHeader
          title={filter === 'all' ? 'All Enquiries' : filter === 'unread' ? 'Unread Enquiries' : 'Read Enquiries'}
          description={`${filtered.length} enquir${filtered.length !== 1 ? 'ies' : 'y'}`}
        />

        {loading ? (
          <ListSkeleton rows={5} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Mail}
            iconColor="#fb923c"
            title={filter === 'all' ? 'No enquiries yet' : `No ${filter} enquiries`}
            description={filter === 'all' ? 'Contact form submissions will appear here.' : undefined}
          />
        ) : (
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {filtered.map((enq, i) => (
                <motion.div
                  key={enq.id}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.04 }}
                  className="relative flex flex-col md:flex-row md:items-start gap-4 p-5 rounded-2xl group transition-colors duration-150"
                  style={{
                    background: enq.is_read ? 'rgba(255,255,255,0.018)' : 'rgba(251,146,60,0.04)',
                    border: `1px solid ${enq.is_read ? 'rgba(255,255,255,0.06)' : 'rgba(251,146,60,0.14)'}`,
                  }}
                >
                  {/* Unread indicator */}
                  {!enq.is_read && (
                    <div
                      className="absolute top-5 left-4 w-2 h-2 rounded-full"
                      style={{ background: '#fb923c', boxShadow: '0 0 8px rgba(251,146,60,0.6)' }}
                    />
                  )}

                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.06)', marginLeft: !enq.is_read ? '12px' : '0' }}
                  >
                    <span className="text-white/60 text-sm font-bold">{enq.name.charAt(0).toUpperCase()}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-sm font-semibold ${enq.is_read ? 'text-white/70' : 'text-white'}`}>{enq.name}</span>
                      {!enq.is_read && <Badge variant="warning" size="xs" dot>New</Badge>}
                      <span className="ml-auto text-white/22 text-[10px]">{fmtDate(enq.created_at)}</span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
                      {enq.email && (
                        <span className="flex items-center gap-1 text-xs text-white/40">
                          <Mail className="w-3 h-3" />{enq.email}
                        </span>
                      )}
                      {enq.phone && (
                        <span className="flex items-center gap-1 text-xs text-white/40">
                          <Phone className="w-3 h-3" />{enq.phone}
                        </span>
                      )}
                      {enq.company && (
                        <span className="flex items-center gap-1 text-xs text-white/40">
                          <Building2 className="w-3 h-3" />{enq.company}
                        </span>
                      )}
                    </div>

                    <div className="flex items-start gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-white/22 flex-shrink-0 mt-0.5" />
                      <p className="text-white/50 text-sm leading-relaxed">{enq.message}</p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <IconButton
                      icon={enq.is_read ? EyeOff : Eye}
                      variant="default"
                      size="sm"
                      loading={togglingId === enq.id}
                      onClick={() => handleToggleRead(enq)}
                      label={enq.is_read ? 'Mark unread' : 'Mark read'}
                    />
                    <IconButton
                      icon={Trash2}
                      variant="danger"
                      size="sm"
                      onClick={() => setDeleteTarget(enq.id)}
                      label="Delete enquiry"
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this enquiry?"
        description="This will permanently remove the enquiry from your records."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
