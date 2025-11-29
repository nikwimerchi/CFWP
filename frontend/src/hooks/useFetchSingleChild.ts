import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import { useEffect, useState } from 'react';
import { IChildWithParent } from '../types/child';
import { BACKEND_URL } from '../utils/constants';
import { setAuthHeaders } from '../utils/helpers';
import { errorHandler } from '../utils/toast';

function useFetchSingleChild(childId: string) {
  const { user } = useSelector((state: RootState) => state.user);
  const [child, setChild] = useState<IChildWithParent | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchChild = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        BACKEND_URL + '/child/' + childId,
        setAuthHeaders(user?.token as string),
      );
      setChild(response.data.child);
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchChild();
  }, []);

  return { child, fetchChild, isLoading };
}

export default useFetchSingleChild;
