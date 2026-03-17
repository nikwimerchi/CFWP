import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import DefaultLayout from './src/layout/DefaultLayout';
import SignIn from './pages/authentication/signin/index'; // Single dot for root
import AdminDashboardHome from './pages/admin/AdminDashboardHome';

export default function App() {
  return (
    <Routes>
      <Route path="/auth/signin" element={<SignIn />} />
      <Route element={<DefaultLayout><Outlet /></DefaultLayout>}>
        <Route path="/admin/dashboard" element={<AdminDashboardHome />} />
      </Route>
      <Route path="*" element={<Navigate to="/auth/signin" />} />
    </Routes>
  );
}