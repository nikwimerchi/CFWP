import { useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './src/hooks/useAuth'; // Standard relative path

// Import Layouts
import DefaultLayout from './src/layout/DefaultLayout';

// Import Admin Pages
import AdminDashboardHome from './pages/admin/AdminDashboardHome'; 
import AdminAdvisorList from './pages/admin/AdminAdvisorList';
import AdminParentList from './pages/admin/AdminParentList';
import AdminChildRecords from './pages/admin/AdminChildRecords';

// Import Auth Pages
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';

function App() {
  const { role, loading } = useAuth();
  const { pathname } = useLocation();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // 1. Show the blue spinner while Supabase checks the session
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-boxdark">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/auth/signin" element={<SignIn />} />
      <Route path="/auth/signup" element={<SignUp />} />

      {/* 2. Protected Admin Routes - Only allow if role is 'admin' */}
      <Route 
        element={
          role === 'admin' ? (
            <DefaultLayout />
          ) : (
            <Navigate to="/auth/signin" state={{ from: pathname }} replace />
          )
        }
      >
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboardHome />} />
        <Route path="/admin/advisors/list" element={<AdminAdvisorList />} />
        <Route path="/admin/parents/list" element={<AdminParentList />} />
        <Route path="/admin/children/records" element={<AdminChildRecords />} />
        <Route path="/admin/audit-logs" element={<div>Audit Logs Component</div>} />
      </Route>

      {/* 3. Potential Advisor/Parent Routes (Add these as you build them) */}
      {/* <Route element={role === 'advisor' ? <DefaultLayout /> : <Navigate to="/auth/signin" />}>
        <Route path="/advisor/dashboard" element={<AdvisorDashboard />} />
      </Route> 
      */}

      {/* Default Redirects */}
      <Route path="/" element={<Navigate to="/auth/signin" replace />} />
      <Route path="*" element={<Navigate to="/auth/signin" replace />} />
    </Routes>
  );
}

export default App;