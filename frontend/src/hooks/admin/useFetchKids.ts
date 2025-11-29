import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { useEffect, useState } from 'react';
import { IChildWithParent } from '../../types/child';
import { BACKEND_URL } from '../../utils/constants';
import { setAuthHeaders } from '../../utils/helpers';
import { errorHandler } from '../../utils/toast';
import axios from 'axios';

function useFetchKids() {
  const { user } = useSelector((state: RootState) => state.user);
  const [children, setChildren] = useState<IChildWithParent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchKids = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        BACKEND_URL + '/child',
        setAuthHeaders(user?.token as string),
      );
      setChildren(response.data.children);
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchKids();
  }, []);

  return { children, fetchKids, isLoading };
}

export default useFetchKids;
