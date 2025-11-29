import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../../utils/constants';
import { setAuthHeaders } from '../../utils/helpers';
import { errorHandler } from '../../utils/toast';
import axios from 'axios';
import { IUser } from '../../types/user';

function useFetchParents() {
  const { user } = useSelector((state: RootState) => state.user);
  const [parents, setParents] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchParents = async (query: string | undefined = undefined) => {
    try {
      setIsLoading(true);
      const url = query
        ? BACKEND_URL + '/parents' + query
        : BACKEND_URL + '/parents';
      const response = await axios.get(
        url,
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

export default useFetchParents;
