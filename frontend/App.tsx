import { createContext, useContext, useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import DefaultLayout from './src/layout/DefaultLayout';
import SignIn from './pages/authentication/signin/index';
import AdminDashboardHome from './pages/admin/AdminDashboardHome';
import Parents from './pages/admin/Parents';
import ChildRecords from './pages/admin/ChildRecords';
import Advisors from './pages/admin/Advisors';
import AuditLogs from './pages/admin/AuditLogs';
import Profile from './pages/Profile';
import PageTitle from './PageTitle';

// Auth Context for handling session state
export const AuthContext = createContext<any>(null);
export const useAuth = () => useContext(AuthContext);

export default function App() {
  // Static user for now - this will be replaced by Supabase Auth state later
  const [user] = useState({ role: 'admin', email: 'admin@cwfp.gov.rw' }); 

  return (
    <AuthContext.Provider value={{ user }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/auth/signin" element={<SignIn />} />

        {/* Protected Admin Routes */}
        <Route element={<DefaultLayout><Outlet /></DefaultLayout>}>
          {/* Dashboard Home */}
          <Route 
            path="/admin/dashboard" 
            element={<><PageTitle title="Dashboard | CFWP" /><AdminDashboardHome /></>} 
          />
          
          {/* Directory Management */}
          <Route 
            path="/admin/advisors/list" 
            element={<><PageTitle title="Advisors | CFWP" /><Advisors /></>} 
          />
          <Route 
            path="/admin/families/list" 
            element={<><PageTitle title="Parents | CFWP" /><Parents /></>} 
          />
          <Route 
            path="/admin/children/records" 
            element={<><PageTitle title="Child Records | CFWP" /><ChildRecords /></>} 
          />

          {/* System Security */}
          <Route 
            path="/admin/audit-logs" 
            element={<><PageTitle title="Audit Logs | CFWP" /><AuditLogs /></>} 
          />
          
          {/* User Settings */}
          <Route 
            path="/profile" 
            element={<><PageTitle title="My Profile | CFWP" /><Profile /></>} 
          />

          {/* Redirect root to dashboard if logged in */}
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        {/* Catch-all redirect to Login */}
        <Route path="*" element={<Navigate to="/auth/signin" replace />} />
      </Routes>
    </AuthContext.Provider>
  );
}