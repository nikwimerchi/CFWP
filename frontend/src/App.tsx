import React, { useEffect, useState, createContext, useContext } from 'react';
import { Route, Routes, useLocation, Navigate, Link, Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// Utilities
import { supabase } from './utils/supabaseClient';
import { setUser } from './redux/actions/user';
import { errorHandler } from './utils/toast';

// Page Imports
import AdminAdvisorsList from './pages/admin/advisors/list';
import AdvisorChildStats from './pages/advisor/child-statistics';
import ParentChat from './pages/parent/chat';
import PageTitle from './components/PageTitle';

// =============================================================================
// AUTH CONTEXT & TYPES
// =============================================================================

interface User {
  id: string;
  _id: string; 
  email?: string;
  role: 'parent' | 'advisor' | 'admin';
  names?: string;
}

interface AuthContextType {
  user: User | null;
  authLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  const fetchProfileAndSync = async (supabaseUser: any) => {
    if (!supabaseUser) {
      setUserState(null);
      dispatch(setUser(null));
      setAuthLoading(false);
      return;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      const userData: User = {
        _id: supabaseUser.id,
        id: supabaseUser.id,
        email: supabaseUser.email,
        role: profile?.role || 'parent',
        names: profile?.names || '',
      };

      setUserState(userData);
      dispatch(setUser(userData)); 
    } catch (err) {
      console.error("Auth sync error:", err);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchProfileAndSync(session?.user);
    });

    // This listener handles the redirect automatically when signOut is called anywhere
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchProfileAndSync(session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// EXPORTED so you can use it in your Header component
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// =============================================================================
// ROUTE GUARDS
// =============================================================================

const AuthWrapper: React.FC<{ children?: React.ReactNode; requiredRole?: User['role']; inverse?: boolean }> = ({ children, requiredRole, inverse }) => {
  const { user, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (inverse && user) {
    const dashboard = user.role === 'admin' ? '/admin/advisors/list' : user.role === 'advisor' ? '/advisor/child-statistics' : '/parent/chat';
    return <Navigate to={dashboard} replace />;
  }

  if (!inverse && !user) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

// =============================================================================
// PAGES & LAYOUT
// =============================================================================

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(formData);
    if (error) errorHandler(error);
    setLoading(false);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 p-4 font-satoshi">
      <form onSubmit={handleSignIn} className="w-full max-w-[400px] rounded-2xl bg-white p-8 shadow-xl border border-stroke">
        <h2 className="mb-6 text-3xl font-bold text-black">Sign In</h2>
        <div className="space-y-4">
          <input className="w-full rounded-xl border border-stroke p-4 outline-none focus:ring-4 focus:ring-primary/10 text-black" type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} required />
          <input className="w-full rounded-xl border border-stroke p-4 outline-none focus:ring-4 focus:ring-primary/10 text-black" type="password" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} required />
          <button disabled={loading} className="w-full rounded-xl bg-primary p-4 font-bold text-white shadow-lg hover:bg-opacity-90 transition">
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </div>
      </form>
    </div>
  );
};

const Unauthorized = () => (
  <div className="flex h-screen flex-col items-center justify-center text-center font-satoshi">
    <h1 className="text-4xl font-bold text-red-500 mb-2">Access Denied</h1>
    <Link to="/" className="rounded-xl bg-primary px-8 py-3 font-bold text-white">Return Home</Link>
  </div>
);

const DefaultLayout = () => {
  return (
    <div className="min-h-screen bg-[#F1F5F9]">
        <Outlet /> 
    </div>
  );
};

// =============================================================================
// MAIN ROUTER
// =============================================================================

function AppContent() {
  return (
    <Routes>
      <Route path="/auth/signin" element={<AuthWrapper inverse><PageTitle title="Signin" /><SignIn /></AuthWrapper>} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<AuthWrapper><DefaultLayout /></AuthWrapper>}>
        <Route path="/admin/advisors/list" element={<AuthWrapper requiredRole="admin"><PageTitle title="Admin | Advisors" /><AdminAdvisorsList /></AuthWrapper>} />
        <Route path="/advisor/child-statistics" element={<AuthWrapper requiredRole="advisor"><PageTitle title="Advisor | Statistics" /><AdvisorChildStats /></AuthWrapper>} />
        <Route path="/parent/chat" element={<AuthWrapper requiredRole="parent"><PageTitle title="Parent | Chat" /><ParentChat /></AuthWrapper>} />
      </Route>

      <Route path="/" element={<Navigate to="/auth/signin" replace />} />
      <Route path="*" element={<div className="p-10 text-center font-bold">404 - Not Found</div>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}