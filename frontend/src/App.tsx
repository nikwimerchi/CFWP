import { useEffect, useState, useMemo, createContext, useContext } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import React from 'react';




// Initialize Supabase Client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =============================================================================
// AUTH CONTEXT & PROVIDER (Supabase Real-Time Logic)
// =============================================================================

interface User {
  id: string;
  email?: string;
  role: 'guest' | 'parent' | 'advisor' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Helper to map Supabase metadata to our User interface
  const mapUser = (supabaseUser: any): User | null => {
    if (!supabaseUser) return null;
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      role: supabaseUser.user_metadata?.role || 'parent', // Default to parent
    };
  };

  useEffect(() => {
    // 1. Check for initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(mapUser(session?.user));
      setAuthLoading(false);
    });

    // 2. Listen for Auth State Changes (Sign In, Sign Out, Token Refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapUser(session?.user));
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, authLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

// =============================================================================
// AUTH WRAPPER (Route Guard)
// =============================================================================

interface AuthWrapperProps {
  children: React.ReactNode;
  requiredRole?: User['role'];
  inverse?: boolean;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children, requiredRole, inverse }) => {
  const { user, isAuthenticated, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) return <Loader />;

  const isAuthorized = useMemo(() => {
    if (inverse) return !isAuthenticated; // Used for Sign In / Sign Up pages
    if (!isAuthenticated) return false;
    if (requiredRole && user?.role !== requiredRole) return false;
    return true;
  }, [isAuthenticated, requiredRole, user?.role, inverse]);

  if (!isAuthorized) {
    const redirectPath = isAuthenticated ? '/dashboard' : '/signin';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// =============================================================================
// SIGN IN & SIGN UP (Logic)
// =============================================================================

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form onSubmit={handleSignIn} className="bg-white p-8 rounded-xl shadow-2xl w-96 border-t-4 border-indigo-600">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign In</h2>
        <input className="w-full p-3 mb-4 border rounded shadow-sm" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
        <input className="w-full p-3 mb-6 border rounded shadow-sm" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
        <button disabled={loading} className="w-full bg-indigo-600 text-white p-3 rounded font-bold hover:bg-indigo-700 transition">
          {loading ? 'Authenticating...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'parent' | 'advisor'>('parent');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } } // Saves role to user_metadata
    });
    if (error) alert(error.message);
    else alert('Check your email for the verification link!');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form onSubmit={handleSignUp} className="bg-white p-8 rounded-xl shadow-2xl w-96 border-t-4 border-green-500">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Register</h2>
        <input className="w-full p-3 mb-4 border rounded" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
        <input className="w-full p-3 mb-4 border rounded" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
        <select className="w-full p-3 mb-6 border rounded bg-white" value={role} onChange={e => setRole(e.target.value as any)}>
          <option value="parent">Parent</option>
          <option value="advisor">Advisor</option>
        </select>
        <button className="w-full bg-green-500 text-white p-3 rounded font-bold hover:bg-green-600 transition">Create Account</button>
      </form>
    </div>
  );
};

// =============================================================================
// LAYOUT & MOCK PAGES (Remaining unchanged)
// =============================================================================

const Loader: React.FC<{}> = () => (
  <div className="flex justify-center items-center h-screen text-2xl font-bold text-indigo-600 bg-gray-50">
    <div className="animate-pulse">Loading Application...</div>
  </div>
);

const PageTitle: React.FC<{ title: string }> = ({ title }) => {
  useEffect(() => { document.title = `App | ${title}`; }, [title]);
  return null;
};

const DefaultLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-lg p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold text-indigo-700">Health App Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-xs font-bold px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full uppercase">
              {user?.role}
            </span>
            <button onClick={signOut} className="text-sm text-red-600 font-semibold hover:underline">
              Sign Out
            </button>
          </div>
        </div>
      </header>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <main>{children}</main>
      </div>
    </div>
  );
};

const MockPage: React.FC<{ name: string; role?: string }> = ({ name, role }) => (
  <div className="p-6 bg-white rounded-xl shadow-2xl m-4 border-l-4 border-indigo-500">
    <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
    <p className="text-gray-600 mt-3">Authenticated session active. Role: {role || 'Standard User'}</p>
  </div>
);

const AdminPages = {
  ParentsList: () => <MockPage name="Parents List (Admin)" role="Admin" />,
  AdvisorsList: () => <MockPage name="Advisors List (Admin)" role="Admin" />,
};

// =============================================================================
// ROUTING LOGIC
// =============================================================================

function AppContent() {
  const { authLoading } = useAuth();
  const { pathname } = useLocation();

  const wrapProtected = (Component: React.FC<any>, title: string, requiredRole?: User['role']) => (
    <AuthWrapper requiredRole={requiredRole}>
      <DefaultLayout>
        <PageTitle title={title} />
        <Component />
      </DefaultLayout>
    </AuthWrapper>
  );

  const wrapUnprotected = (Component: React.FC<any>, title: string) => (
    <AuthWrapper inverse={true}>
      <PageTitle title={title} />
      <Component />
    </AuthWrapper>
  );

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  if (authLoading) return <Loader />;

  return (
    <Routes>
      <Route path="/signin" element={wrapUnprotected(SignIn, "Signin")} />
      <Route path="/signup" element={wrapUnprotected(SignUp, "Signup")} />
      
      <Route path="/dashboard" element={wrapProtected(() => <MockPage name="Main Dashboard" />, "Dashboard")} />
      
      {/* Admin Protected */}
      <Route path="/admin/parents" element={wrapProtected(AdminPages.ParentsList, "Parents List", 'admin')} />
      <Route path="/admin/advisors" element={wrapProtected(AdminPages.AdvisorsList, "Advisors List", 'admin')} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<div className="p-10 text-center">404 - Not Found</div>} />
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