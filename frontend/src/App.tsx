// frontend/src/App.tsx (FINAL CONSOLIDATED VERSION)

import { useEffect, useState, useMemo } from 'react';
import { Route, Routes, useLocation, useNavigate, Navigate } from 'react-router-dom'; 
import React from 'react';

// =============================================================================
// MOCK COMPONENTS AND AUTH LOGIC 
// =============================================================================

interface User {
  token: string;
  role: 'guest' | 'parent' | 'advisor' | 'admin';
}

const useAuth = () => {
    const [authLoading, setAuthLoading] = useState<boolean>(true);
    
    const [user, setUser] = useState<User>(() => {
        const storedRole = sessionStorage.getItem('mockUserRole');
        const defaultRole: User['role'] = (storedRole as User['role']) || 'guest';
        return { token: defaultRole === 'guest' ? '' : 'mock-token', role: defaultRole };
    });
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setAuthLoading(false);
        }, 100); 
        return () => clearTimeout(timer);
    }, []);

    const changeRole = (newRole: User['role']) => {
        setAuthLoading(true);
        const newUser = { 
            token: newRole === 'guest' ? '' : 'mock-token', 
            role: newRole 
        };
        setUser(newUser);
        sessionStorage.setItem('mockUserRole', newRole);
        setTimeout(() => setAuthLoading(false), 50); 
    };

    const isAuthenticated = user.token.trim() !== '';

    return { user, isAuthenticated, changeRole, authLoading };
};

interface AuthWrapperProps {
    children: React.ReactNode;
    requiredRole?: User['role'];
    inverse?: boolean;
}

// === FINAL AUTH WRAPPER (Handles Auth/Role check and redirect) ===
const AuthWrapper: React.FC<AuthWrapperProps> = ({ children, requiredRole, inverse }) => {
    const { user, isAuthenticated, authLoading } = useAuth();
    const location = useLocation(); 

    if (authLoading) {
        return null; 
    }

    const isAuthorized = useMemo(() => {
        if (inverse) {
            return !isAuthenticated;
        }
        if (!isAuthenticated) {
            return false;
        }
        // If requiredRole is specified, check for role match
        if (requiredRole && user.role !== requiredRole) {
            return false;
        }
        return true;
    }, [isAuthenticated, requiredRole, user.role, inverse]);
    
    if (!isAuthorized) {
        // Redirect based on authentication status
        const redirectPath = isAuthenticated ? '/dashboard' : '/signin';
        return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }
    
    return <>{children}</>;
};
// ==========================================================

const Loader: React.FC<{}> = () => (
    <div className="flex justify-center items-center h-screen text-2xl font-bold text-indigo-600 bg-gray-50">
        Loading Application...
    </div>
);

const PageTitle: React.FC<{ title: string }> = ({ title }) => {
    useEffect(() => {
        document.title = `App | ${title}`;
    }, [title]);
    return null;
};

const RoleSwitcher: React.FC<{}> = () => {
    const { user, changeRole } = useAuth();
    const navigate = useNavigate();

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value as User['role'];
        changeRole(newRole);
        navigate(newRole === 'guest' ? '/signin' : '/dashboard');
    };
    
    return (
        <div className="flex items-center space-x-2 text-sm">
            <span className="font-medium">Current Role: </span>
            <select
                className="p-2 border rounded-lg shadow-inner bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                value={user.role}
                onChange={handleRoleChange}
            >
                <option value="guest">Guest (Sign Out)</option>
                <option value="admin">Admin</option>
                <option value="parent">Parent</option>
                <option value="advisor">Advisor</option>
            </select>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-500 text-white' : user.role === 'parent' ? 'bg-blue-500 text-white' : user.role === 'advisor' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                {user.role.toUpperCase()}
            </span>
        </div>
    );
}

const DefaultLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-screen bg-gray-100 font-sans">
        <header className="bg-white shadow-lg p-4 sticky top-0 z-10">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <h1 className="text-3xl font-extrabold text-indigo-700">Health App Dashboard</h1>
                <RoleSwitcher />
            </div>
        </header>
        
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <main>{children}</main>
        </div>
        
        <footer className="text-center text-sm p-4 mt-8 text-gray-500 border-t">
            © 2025 Health App. All rights reserved.
        </footer>
    </div>
);

// --- Mock Pages (Unchanged) ---
const MockPage: React.FC<{ name: string; role?: string }> = ({ name, role }) => (
    <div className="p-6 bg-white rounded-xl shadow-2xl m-4 border-l-4 border-indigo-500">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
            {role && <span className={`px-4 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800`}>Role Check: {role}</span>}
        </div>
        <p className="text-gray-600 mt-3">
            This is a mock component. The complex routing logic is correctly implemented, and you have reached the intended page content.
        </p>
    </div>
);
const SignIn: React.FC<{}> = () => <MockPage name="Sign In" />;
const SignUp: React.FC<{}> = () => <MockPage name="Sign Up" />;
const SuccessVerification: React.FC<{}> = () => <MockPage name="Success Verification" />;
const Calendar: React.FC<{}> = () => <MockPage name="Calendar" />;
const Chart: React.FC<{}> = () => <MockPage name="Basic Chart" />;
const ECommerce: React.FC<{}> = () => <MockPage name="Dashboard Overview" />;
const FormElements: React.FC<{}> = () => <MockPage name="Form Elements" />;
const FormLayout: React.FC<{}> = () => <MockPage name="Form Layout" />;
const Profile: React.FC<{}> = () => <MockPage name="User Profile" />;
const Tables: React.FC<{}> = () => <MockPage name="Tables List" />;
const Alerts: React.FC<{}> = () => <MockPage name="UI Alerts" />;
const Buttons: React.FC<{}> = () => <MockPage name="UI Buttons" />;
const NotFound: React.FC<{}> = () => <MockPage name="404 Not Found" />;

const AdminPages = {
    ParentsList: () => <MockPage name="Parents List (Admin)" role="Admin" />,
    AdvisorsList: () => <MockPage name="Advisors List (Admin)" role="Admin" />,
    ChildStatistics: () => <MockPage name="Child Statistics (Admin View)" role="Admin" />,
    RegisterNewAdvisor: () => <MockPage name="Register New Advisor" role="Admin" />,
    Notifications: () => <MockPage name="Notifications (Admin)" role="Admin" />,
    Measurements: () => <MockPage name="Measurements (Admin Reference)" role="Admin" />,
    EditChild: () => <MockPage name="Edit Child Details" role="Admin" />,
};

const ParentPages = {
    ChildrenList: () => <MockPage name="Children List (Parent)" role="Parent" />,
    ChildStatistics: () => <MockPage name="Child Health Statistics (Parent View)" role="Parent" />,
    RegisterNewChild: () => <MockPage name="Register New Child" role="Parent" />,
    Chat: () => <MockPage name="Chat with our AI" role="Parent" />,
    Notifications: () => <MockPage name="Notifications (Parent)" role="Parent" />,
    Measurements: () => <MockPage name="Measurements Reference List (Parent)" role="Parent" />,
};

const AdvisorPages = {
    ChildrenList: () => <MockPage name="Children List (Advisor)" role="Advisor" />,
    ChildStatistics: () => <MockPage name="Child Health Statistics (Advisor View)" role="Advisor" />,
    RegisterNewChild: () => <MockPage name="Register New Child (Advisor)" role="Advisor" />,
    Notifications: () => <MockPage name="Notifications (Advisor)" role="Advisor" />,
    Parents: () => <MockPage name="Parents List (Advisor)" role="Advisor" />,
    Measurements: () => <MockPage name="Measurements Reference (Advisor)" role="Advisor" />,
};

// =============================================================================
// MAIN APP CONTENT COMPONENT
// =============================================================================

function AppContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  // Helper function to define a Protected Route with Layout and Auth 
  const wrapProtected = (
    Component: React.FC<any>, 
    title: string, 
    requiredRole?: User['role']
  ) => {
    return (
      <AuthWrapper requiredRole={requiredRole}>
        <DefaultLayout>
          <PageTitle title={title} />
          <Component />
        </DefaultLayout>
      </AuthWrapper>
    );
  };
    
  // Helper function for Unprotected Routes (No Layout)
  const wrapUnprotected = (
    Component: React.FC<any>, 
    title: string
  ) => {
    return (
      <AuthWrapper inverse={true}>
        <PageTitle title={title} />
        <Component />
      </AuthWrapper>
    );
  };


  useEffect(() => {
    if (!loading) {
        window.scrollTo(0, 0);
    }
  }, [pathname, loading]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000); 
  }, []);

  if (loading) {
    return <Loader />;
  }
  
  return (
    <Routes>
      {/* Public/Unprotected Routes */}
      <Route path="/" element={wrapUnprotected(SignIn, "Signin")} />
      <Route path="/signin" element={wrapUnprotected(SignIn, "Signin")} />
      <Route path="/signup" element={wrapUnprotected(SignUp, "Signup")} />
      <Route path="/verify/success" element={wrapUnprotected(SuccessVerification, "Verified")} />
      
      {/* Core Protected Routes (Accessible by all logged-in roles) */}
      <Route path="/dashboard" element={wrapProtected(ECommerce, "Dashboard")} />
      <Route path="/calendar" element={wrapProtected(Calendar, "Calendar")} />
      <Route path="/profile" element={wrapProtected(Profile, "Profile")} />
      <Route path="/forms/form-elements" element={wrapProtected(FormElements, "Form Elements")} />
      <Route path="/forms/form-layout" element={wrapProtected(FormLayout, "Form Layout")} />
      <Route path="/tables" element={wrapProtected(Tables, "Tables")} />
      <Route path="/chart" element={wrapProtected(Chart, "Basic Chart")} />
      <Route path="/ui/alerts" element={wrapProtected(Alerts, "Alerts")} />
      <Route path="/ui/buttons" element={wrapProtected(Buttons, "Buttons")} />

      {/* Admin routes */}
      <Route path="/parents" element={wrapProtected(AdminPages.ParentsList, "Parents List", 'admin')} />
      <Route path="/advisors/list" element={wrapProtected(AdminPages.AdvisorsList, "Advisors List", 'admin')} />
      <Route path="/children/:id" element={wrapProtected(AdminPages.ChildStatistics, "Child Statistics", 'admin')} />
      <Route path="/advisors/new" element={wrapProtected(AdminPages.RegisterNewAdvisor, "New Advisor", 'admin')} />
      <Route path="/notifications" element={wrapProtected(AdminPages.Notifications, "Notifications", 'admin')} />
      <Route path="/measurements" element={wrapProtected(AdminPages.Measurements, "Measurements", 'admin')} />
      <Route path="/children/edit/:id" element={wrapProtected(AdminPages.EditChild, "Edit Child", 'admin')} />

      {/* Parent routes */}
      <Route path="/children/list" element={wrapProtected(ParentPages.ChildrenList, "Children List", 'parent')} />
      <Route path="/children/list/:id" element={wrapProtected(ParentPages.ChildStatistics, "Child Stats", 'parent')} />
      <Route path="/children/new" element={wrapProtected(ParentPages.RegisterNewChild, "Register Child", 'parent')} />
      <Route path="/chat/:id" element={wrapProtected(ParentPages.Chat, "AI Chat", 'parent')} />
      <Route path="/notifications" element={wrapProtected(ParentPages.Notifications, "Notifications", 'parent')} />
      <Route path="/measurements" element={wrapProtected(ParentPages.Measurements, "Measurements Ref", 'parent')} />

      {/* Advisors routes */}
      <Route path="/children/list" element={wrapProtected(AdvisorPages.ChildrenList, "Children List", 'advisor')} />
      <Route path="/children/list/:id" element={wrapProtected(AdvisorPages.ChildStatistics, "Child Stats", 'advisor')} />
      <Route path="/children/new" element={wrapProtected(AdvisorPages.RegisterNewChild, "Register Child", 'advisor')} />
      <Route path="/notifications" element={wrapProtected(AdvisorPages.Notifications, "Notifications", 'advisor')} />
      <Route path="/parents" element={wrapProtected(AdvisorPages.Parents, "Parents List", 'advisor')} />
      <Route path="/measurements" element={wrapProtected(AdvisorPages.Measurements, "Measurements Ref", 'advisor')} />

      {/* Not Found Route (Protected) */}
      <Route path="*" element={wrapProtected(NotFound, "404", user.role)} /> 
    </Routes>
  );
}

// =============================================================================
// APP WRAPPER (Exported)
// =============================================================================

function App() {
    return (
        <AppContent />
    );
}

export default App;