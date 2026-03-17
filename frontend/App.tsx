import { createContext, useContext, useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import DefaultLayout from './src/layout/DefaultLayout';
import SignIn from './pages/authentication/signin/index';
import AdminDashboardHome from './pages/admin/AdminDashboardHome';
import Profile from './pages/Profile';
import Parents from './pages/admin/Parents';
import Child from './pages/admin/ChildRecords';
 import Advisors from './pages/admin/Advisors';


export const AuthContext = createContext<any>(null);
export const useAuth = () => useContext(AuthContext);

const AdvisorList = () => <div className="p-4 text-white uppercase font-bold">Advisor Management</div>;
const ChildRecords = () => <div className="p-4 text-white uppercase font-bold">Child Welfare Records</div>;

export default function App() {
  const [user] = useState({ role: 'admin', email: 'admin@cwfp.gov.rw' }); 

  return (
    <AuthContext.Provider value={{ user }}>
      <Routes>
        <Route path="/auth/signin" element={<SignIn />} />

        {/* Protected Routes wrapped in DefaultLayout */}
        <Route element={<DefaultLayout><Outlet /></DefaultLayout>}>
          <Route path="/admin/dashboard" element={<AdminDashboardHome />} />
          <Route path="/admin/advisors/list" element={<AdvisorList />} />
          <Route path="/admin/children/records" element={<ChildRecords />} />
          <Route path="/admin/families/list" element={<Parents />} />
          <Route path="/admin/children/records" element={<ChildRecords />} />
       
          <Route path="/admin/advisors/list" element={<Advisors />} />
          
          {/* Profile and Settings */}
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/auth/signin" />} />
      </Routes>
    </AuthContext.Provider>
  );
}