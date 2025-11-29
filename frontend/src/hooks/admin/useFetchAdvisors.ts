import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../../utils/constants';
import { setAuthHeaders } from '../../utils/helpers';
import { errorHandler } from '../../utils/toast';
import axios from 'axios';
import { IUser } from '../../types/user';

function useFetchAdvisors() {
  const { user } = useSelector((state: RootState) => state.user);
  const [advisors, setAdvisors] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAdvisors = async (query: string | undefined = undefined) => {
    try {
      setIsLoading(true);
      const url = query
        ? BACKEND_URL + '/advisors' + query
        : BACKEND_URL + '/advisors';
      const response = await axios.get(
        url,
        setAuthHeaders(user?.token as string),
      );
      setAdvisors(response.data.advisors);
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAdvisors();
  }, []);

  return { advisors, fetchAdvisors, isLoading };
}

export default useFetchAdvisors;
