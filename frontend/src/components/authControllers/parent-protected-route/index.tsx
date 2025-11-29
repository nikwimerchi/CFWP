import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../../../redux/reducers';

const ParentProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useSelector((state: RootState) => state.user);
  return (
    <>
      {user && user.token.trim() !== '' && user.role === 'parent' ? (
        children
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default ParentProtectedRoute;
