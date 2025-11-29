import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../../../redux/reducers';

const AdvisorProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useSelector((state: RootState) => state.user);
  return (
    <>
      {user && user.token.trim() !== '' && user.role === 'advisor' ? (
        children
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default AdvisorProtectedRoute;
