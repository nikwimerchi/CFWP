import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../../../redux/reducers';

const LoggedInRedirection = () => {
  const url = new URL(window.location.href);
  const pathValue = url.searchParams.get('redirect');

  return pathValue && pathValue.trim().length > 1 ? (
    <Navigate to={`/${pathValue.replace('redirect=', '')}`} />
  ) : (
    <Navigate to="/dashboard" />
  );
};

const UnProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useSelector((state: RootState) => state.user);
  return (
    <>
      {!user || user.token.trim() === '' ? children : <LoggedInRedirection />}
    </>
  );
};

export default UnProtectedRoute;
