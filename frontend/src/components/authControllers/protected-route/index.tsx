import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../../../redux/reducers';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useSelector((state: RootState) => state.user);
  const path = window.location.pathname.replace('/', '');
  return user && user.token.trim() !== '' ? (
    children
  ) : (
    <Navigate to={'/?redirect=' + path} />
  );
};

export default ProtectedRoute;
