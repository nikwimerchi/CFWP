import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import UnProtectedRoute from './components/authControllers/un-protected-route';
import ProtectedRoute from './components/authControllers/protected-route';

import SignIn from './pages/authentication/signin';
import SignUp from './pages/authentication/signup';
import SuccessVerification from './pages/authentication/verify';

//Parent routes
import ParentProtectedRoute from './components/authControllers/parent-protected-route';
import AdminProtectedRoute from './components/authControllers/admin-protected-route';
import { AdminPages } from './pages/admin/pages';
import { ParentPages } from './pages/parent/pages';
import { AdvisorPages } from './pages/advisor/pages';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './redux/reducers';
import NotFound from './pages/notFound';
import AdvisorProtectedRoute from './components/authControllers/advisor-protected-route';
import { fetchNotifications } from './redux/actions/notifications';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    if (user?.token && user.token.trim() !== '') {
      setTimeout(() => {
        dispatch(fetchNotifications());
      }, 1000);
    }
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        <Route
          index
          // path="/signin"
          element={
            <UnProtectedRoute>
              <PageTitle title="Signin" />
              <SignIn />
            </UnProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <UnProtectedRoute>
              <PageTitle title="Signup" />
              <SignUp />
            </UnProtectedRoute>
          }
        />
        <Route
          path="/verify/success"
          element={
            <UnProtectedRoute>
              <SuccessVerification />
            </UnProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageTitle title="Dashboard" />
              <ECommerce />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Calendar" />
              <Calendar />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageTitle title="Profile" />
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Form Elements" />
              <FormElements />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Form Layout" />
              <FormLayout />
            </>
          }
        />
        <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Tables" />
              <Tables />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart" />
              <Chart />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts" />
              <Alerts />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons" />
              <Buttons />
            </>
          }
        />
        {/* Admin routes */}
        {user && user.role === 'admin' && (
          <>
            <Route
              path="/parents"
              element={
                <AdminProtectedRoute>
                  <PageTitle title="Parents" />
                  <AdminPages.ParentsList />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/advisors/list"
              element={
                <AdminProtectedRoute>
                  <PageTitle title="Advisors" />
                  <AdminPages.AdvisorsList />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/children/:id"
              element={
                <AdminProtectedRoute>
                  <PageTitle title="Child health statistics" />
                  <AdminPages.ChildStatistics />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/advisors/new"
              element={
                <AdminProtectedRoute>
                  <PageTitle title="New advisor" />
                  <AdminPages.RegisterNewAdvisor />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <AdminProtectedRoute>
                  <PageTitle title="Notifications" />
                  <AdminPages.Notifications />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/measurements"
              element={
                <AdminProtectedRoute>
                  <PageTitle title="Measurements" />
                  <AdminPages.Measurements />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/children/edit/:id"
              element={
                <AdminProtectedRoute>
                  <PageTitle title="Measurements" />
                  <AdminPages.EditChild />
                </AdminProtectedRoute>
              }
            />
          </>
        )}

        {/* Admin routes */}
        {/* Parent routes */}
        {user && user.role === 'parent' && (
          <>
            <Route
              path="/children/list"
              element={
                <ParentProtectedRoute>
                  <PageTitle title="Children list" />
                  <ParentPages.ChildrenList />
                </ParentProtectedRoute>
              }
            />
            <Route
              path="/children/list/:id"
              element={
                <ParentProtectedRoute>
                  <PageTitle title="Child health statistics" />
                  <ParentPages.ChildStatistics />
                </ParentProtectedRoute>
              }
            />
            <Route
              path="/children/new"
              element={
                <ParentProtectedRoute>
                  <PageTitle title="Register New Child" />
                  <ParentPages.RegisterNewChild />
                </ParentProtectedRoute>
              }
            />
            <Route
              path="/chat/:id"
              element={
                <ParentProtectedRoute>
                  <PageTitle title="Chat with our AI" />
                  <ParentPages.Chat />
                </ParentProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ParentProtectedRoute>
                  <PageTitle title="Notifications" />
                  <ParentPages.Notifications />
                </ParentProtectedRoute>
              }
            />

            <Route
              path="/measurements"
              element={
                <ParentProtectedRoute>
                  <PageTitle title="Measurements Reference List" />
                  <ParentPages.Measurements />
                </ParentProtectedRoute>
              }
            />
          </>
        )}
        {/* Parent routes */}
        {/* Advisors routes */}
        {user && user.role === 'advisor' && (
          <>
            <Route
              path="/children/list"
              element={
                <AdvisorProtectedRoute>
                  <PageTitle title="Children list" />
                  <AdvisorPages.ChildrenList />
                </AdvisorProtectedRoute>
              }
            />
            <Route
              path="/children/list/:id"
              element={
                <AdvisorProtectedRoute>
                  <PageTitle title="Child health statistics" />
                  <AdvisorPages.ChildStatistics />
                </AdvisorProtectedRoute>
              }
            />
            <Route
              path="/children/new"
              element={
                <AdvisorProtectedRoute>
                  <PageTitle title="Register New Child" />
                  <AdvisorPages.RegisterNewChild />
                </AdvisorProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <AdvisorProtectedRoute>
                  <PageTitle title="Notifications" />
                  <AdvisorPages.Notifications />
                </AdvisorProtectedRoute>
              }
            />
            <Route
              path="/parents"
              element={
                <AdvisorProtectedRoute>
                  <PageTitle title="Parents List" />
                  <AdvisorPages.Parents />
                </AdvisorProtectedRoute>
              }
            />
            <Route
              path="/measurements"
              element={
                <AdvisorProtectedRoute>
                  <PageTitle title="Measurements Reference" />
                  <AdvisorPages.Measurements />
                </AdvisorProtectedRoute>
              }
            />
          </>
        )}
        {/* Advisors routes */}
        {/* not found route */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <NotFound />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
