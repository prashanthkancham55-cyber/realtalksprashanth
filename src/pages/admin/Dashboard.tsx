import { motion } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)' }}>
          <LayoutDashboard className="w-5 h-5" style={{ color: '#d4af37' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Dashboard</h1>
          <p className="text-white/35 text-xs mt-0.5">Welcome back to the RealTalks admin panel</p>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-10 text-center"
        style={{ background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <p className="text-white/40 text-sm">Select a module from the sidebar to get started.</p>
      </motion.div>
    </div>
  );
}
