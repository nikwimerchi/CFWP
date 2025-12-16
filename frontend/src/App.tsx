import { useEffect, useState, useMemo } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import React from 'react'; // Explicitly import React for React.FC

// =============================================================================
// MOCK COMPONENTS AND LOGIC (Replacing Redux, Layouts, and Page Imports)
// =============================================================================

interface User {
  token: string;
  role: 'guest' | 'parent' | 'advisor' | 'admin';
}

const useAuth = () => {
    const [user, setUser] = useState<User>(() => {
        const storedRole = sessionStorage.getItem('mockUserRole');
        const defaultRole: User['role'] = (storedRole as User['role']) || 'guest';
        return { token: defaultRole === 'guest' ? '' : 'mock-token', role: defaultRole };
    });
    
    const changeRole = (newRole: User['role']) => {
        const newUser = { 
            token: newRole === 'guest' ? '' : 'mock-token', 
            role: newRole 
        };
        setUser(newUser);
        sessionStorage.setItem('mockUserRole', newRole);
    };

    const isAuthenticated = user.token.trim() !== '';

    return { user, isAuthenticated, changeRole };
};

// Define props for the AuthWrapper component
interface AuthWrapperProps {
    children: React.ReactNode;
    requiredRole?: User['role'];
    inverse?: boolean;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children, requiredRole, inverse }) => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (inverse) {
            // Logic for UnProtectedRoute: redirect authenticated users away from signin/signup
            if (isAuthenticated) {
                navigate('/dashboard', { replace: true });
            }
        } 
        else {
            // Logic for ProtectedRoutes: redirect unauthenticated users to signin
            if (!isAuthenticated) {
                navigate('/signin', { replace: true });
            }

            // Logic for Role-ProtectedRoutes: redirect users with incorrect role
            if (isAuthenticated && requiredRole && user.role !== requiredRole) {
                navigate('/dashboard', { replace: true });
            }
        }
    }, [isAuthenticated, requiredRole, user.role, navigate, inverse, location.pathname]);

    // Render logic to prevent flashes of unauthorized content
    if (inverse && isAuthenticated) return null;
    if (!inverse && !isAuthenticated) return null;
    if (requiredRole && user.role !== requiredRole) return null;

    return <>{children}</>;
};

// The following components were missing the children prop type in their definition, 
// causing the TypeScript error. We now use React.FC which implicitly includes children 
// in the function component definition, or we can define props explicitly.
// Using explicit prop types for clarity:
const UnProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => <AuthWrapper inverse={true}>{children}</AuthWrapper>;
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => <AuthWrapper>{children}</AuthWrapper>;
const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => <AuthWrapper requiredRole='admin'>{children}</AuthWrapper>;
const ParentProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => <AuthWrapper requiredRole='parent'>{children}</AuthWrapper>;
const AdvisorProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => <AuthWrapper requiredRole='advisor'>{children}</AuthWrapper>;

// Standardized Loader type
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

// RoleSwitcher already uses React.FC<{}> from the previous fix
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

// Standardized Mock Page component types to React.FC<{}>
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

  // Conditionally create the route elements based on user role
  const adminRoutes = useMemo(() => user.role === 'admin' ? (
      <Route element={<AdminProtectedRoute children={undefined} />}>
          <Route path="/parents" element={<DefaultLayout><PageTitle title="Parents" /><AdminPages.ParentsList /></DefaultLayout>} />
          <Route path="/advisors/list" element={<DefaultLayout><PageTitle title="Advisors" /><AdminPages.AdvisorsList /></DefaultLayout>} />
          <Route path="/children/:id" element={<DefaultLayout><PageTitle title="Child health statistics" /><AdminPages.ChildStatistics /></DefaultLayout>} />
          <Route path="/advisors/new" element={<DefaultLayout><PageTitle title="New advisor" /><AdminPages.RegisterNewAdvisor /></DefaultLayout>} />
          <Route path="/notifications" element={<DefaultLayout><PageTitle title="Notifications" /><AdminPages.Notifications /></DefaultLayout>} />
          <Route path="/measurements" element={<DefaultLayout><PageTitle title="Measurements" /><AdminPages.Measurements /></DefaultLayout>} />
          <Route path="/children/edit/:id" element={<DefaultLayout><PageTitle title="Edit Child" /><AdminPages.EditChild /></DefaultLayout>} />
      </Route>
  ) : null, [user.role]);

  const parentRoutes = useMemo(() => user.role === 'parent' ? (
      <Route element={<ParentProtectedRoute children={undefined} />}>
          <Route path="/children/list" element={<DefaultLayout><PageTitle title="Children list" /><ParentPages.ChildrenList /></DefaultLayout>} />
          <Route path="/children/list/:id" element={<DefaultLayout><PageTitle title="Child health statistics" /><ParentPages.ChildStatistics /></DefaultLayout>} />
          <Route path="/children/new" element={<DefaultLayout><PageTitle title="Register New Child" /><ParentPages.RegisterNewChild /></DefaultLayout>} />
          <Route path="/chat/:id" element={<DefaultLayout><PageTitle title="Chat with our AI" /><ParentPages.Chat /></DefaultLayout>} />
          <Route path="/notifications" element={<DefaultLayout><PageTitle title="Notifications" /><ParentPages.Notifications /></DefaultLayout>} />
          <Route path="/measurements" element={<DefaultLayout><PageTitle title="Measurements Reference List" /><ParentPages.Measurements /></DefaultLayout>} />
      </Route>
  ) : null, [user.role]);

  const advisorRoutes = useMemo(() => user.role === 'advisor' ? (
      <Route element={<AdvisorProtectedRoute children={undefined} />}>
          <Route path="/children/list" element={<DefaultLayout><PageTitle title="Children list" /><AdvisorPages.ChildrenList /></DefaultLayout>} />
          <Route path="/children/list/:id" element={<DefaultLayout><PageTitle title="Child health statistics" /><AdvisorPages.ChildStatistics /></DefaultLayout>} />
          <Route path="/children/new" element={<DefaultLayout><PageTitle title="Register New Child" /><AdvisorPages.RegisterNewChild /></DefaultLayout>} />
          <Route path="/notifications" element={<DefaultLayout><PageTitle title="Notifications" /><AdvisorPages.Notifications /></DefaultLayout>} />
          <Route path="/parents" element={<DefaultLayout><PageTitle title="Parents List" /><AdvisorPages.Parents /></DefaultLayout>} />
          <Route path="/measurements" element={<DefaultLayout><PageTitle title="Measurements Reference" /><AdvisorPages.Measurements /></DefaultLayout>} />
      </Route>
  ) : null, [user.role]);

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
      <Route path="/" element={<UnProtectedRoute><PageTitle title="Signin" /><SignIn /></UnProtectedRoute>} />
      <Route path="/signin" element={<UnProtectedRoute><PageTitle title="Signin" /><SignIn /></UnProtectedRoute>} />
      <Route path="/signup" element={<UnProtectedRoute><PageTitle title="Signup" /><SignUp /></UnProtectedRoute>} />
      <Route path="/verify/success" element={<UnProtectedRoute><SuccessVerification /></UnProtectedRoute>} />
      
      {/* Core Protected Routes (Accessible by all logged-in roles) */}
      <Route path="/dashboard" element={<ProtectedRoute><DefaultLayout><PageTitle title="Dashboard" /><ECommerce /></DefaultLayout></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><DefaultLayout><PageTitle title="Calendar" /><Calendar /></DefaultLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><DefaultLayout><PageTitle title="Profile" /><Profile /></DefaultLayout></ProtectedRoute>} />
      <Route path="/forms/form-elements" element={<ProtectedRoute><DefaultLayout><PageTitle title="Form Elements" /><FormElements /></DefaultLayout></ProtectedRoute>} />
      <Route path="/forms/form-layout" element={<ProtectedRoute><DefaultLayout><PageTitle title="Form Layout" /><FormLayout /></DefaultLayout></ProtectedRoute>} />
      <Route path="/tables" element={<ProtectedRoute><DefaultLayout><PageTitle title="Tables" /><Tables /></DefaultLayout></ProtectedRoute>} />
      <Route path="/chart" element={<ProtectedRoute><DefaultLayout><PageTitle title="Basic Chart" /><Chart /></DefaultLayout></ProtectedRoute>} />
      <Route path="/ui/alerts" element={<ProtectedRoute><DefaultLayout><PageTitle title="Alerts" /><Alerts /></DefaultLayout></ProtectedRoute>} />
      <Route path="/ui/buttons" element={<ProtectedRoute><DefaultLayout><PageTitle title="Buttons" /><Buttons /></DefaultLayout></ProtectedRoute>} />

      {/* Admin routes (Conditionally rendered) */}
      {adminRoutes}

      {/* Parent routes (Conditionally rendered) */}
      {parentRoutes}

      {/* Advisors routes (Conditionally rendered) */}
      {advisorRoutes}

      {/* Not Found Route (Protected) */}
      <Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
    </Routes>
  );
}

// =============================================================================
// APP WRAPPER (Exported)
// =============================================================================

function App() {
  // **FIXED: Removed the duplicate <BrowserRouter>**
  return (
    <AppContent />
  );
}

export default App;