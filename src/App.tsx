import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import PublicLayout from './components/public/PublicLayout';
import HomePage from './pages/public/HomePage';
import TrainingsList from './pages/public/TrainingsList';
import TrainingDetail from './pages/public/TrainingDetail';
import RegisterPage from './pages/public/RegisterPage';
import PaymentPage from './pages/public/PaymentPage';
import AdminShell from './components/admin/layout/AdminShell';
import Dashboard from './pages/admin/Dashboard';
import AdminTrainings from './pages/admin/AdminTrainings';
import AdminRegistrations from './pages/admin/AdminRegistrations';
import AdminGallery from './pages/admin/AdminGallery';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminVideos from './pages/admin/AdminVideos';
import VideosPage from './pages/public/VideosPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public routes ─────────────────────────────────────────── */}
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="trainings" element={<TrainingsList />} />
          <Route path="videos"    element={<VideosPage />} />
          <Route path="training/:slug" element={<TrainingDetail />} />
          <Route path="register/:slug" element={<RegisterPage />} />
        </Route>

        {/* ── Payment page (no public header/footer needed) ────────── */}
        <Route path="payment/:registrationId" element={<PaymentPage />} />

        {/* ── Admin routes ──────────────────────────────────────────── */}
        <Route path="admin" element={<AdminShell><Outlet /></AdminShell>}>
          <Route index element={<Dashboard />} />
          <Route path="trainings" element={<AdminTrainings />} />
          <Route path="registrations" element={<AdminRegistrations />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="videos"    element={<AdminVideos />} />
        </Route>

        {/* ── Catch-all ─────────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
