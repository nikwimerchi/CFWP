import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../../utils/constants';
import { setAuthHeaders } from '../../utils/helpers';
import { errorHandler } from '../../utils/toast';
import axios from 'axios';
import { IUser } from '../../types/user';

function useFetchAdvisorParents() {
  const { user } = useSelector((state: RootState) => state.user);
  const [parents, setParents] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchParents = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        BACKEND_URL + '/advisors/parents',
        setAuthHeaders(user?.token as string),
      );
      setParents(response.data.parents);
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchParents();
  }, []);

  return { parents, fetchParents, isLoading };
}

export default useFetchAdvisorParents;
