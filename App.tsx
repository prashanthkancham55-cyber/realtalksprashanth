import { Routes, Route, Navigate } from 'react-router-dom';
import AdminShell from './components/admin/layout/AdminShell';
import Dashboard from './pages/admin/Dashboard';
import AdminSettings from './pages/admin/AdminSettings';
import HomePage from './pages/public/HomePage';

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminShell />}>
        <Route index element={<Dashboard />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
