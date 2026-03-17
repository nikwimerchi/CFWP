import { createContext, useContext, useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import DefaultLayout from './src/layout/DefaultLayout';
import SignIn from './pages/authentication/signin/index';
import AdminDashboardHome from './pages/admin/AdminDashboardHome';

// 1. You MUST export these for the Sidebar to work
export const AuthContext = createContext<any>(null);
export const useAuth = () => useContext(AuthContext);

const AdvisorList = () => <div className="p-4 text-white">Advisor List Component</div>;
const FamilyDirectory = () => <div className="p-4 text-white">Family Directory Component</div>;
const ChildRecords = () => <div className="p-4 text-white">Child Records Component</div>;

export default function App() {
  // Set the initial role so you can see the sidebar working immediately
  const [user] = useState({ role: 'admin' }); 

  return (
    <AuthContext.Provider value={{ user }}>
      <Routes>
        <Route path="/auth/signin" element={<SignIn />} />

        {/* Protected Routes wrapped in the Layout */}
        <Route element={<DefaultLayout><Outlet /></DefaultLayout>}>
          <Route path="/admin/dashboard" element={<AdminDashboardHome />} />
          <Route path="/admin/advisors/list" element={<AdvisorList />} />
          <Route path="/admin/families/list" element={<FamilyDirectory />} />
          <Route path="/admin/children/records" element={<ChildRecords />} />
        </Route>

        <Route path="*" element={<Navigate to="/auth/signin" />} />
      </Routes>
    </AuthContext.Provider>
  );
}