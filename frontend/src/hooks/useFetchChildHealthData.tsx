import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../utils/constants';
import axios from 'axios';
import { IChildHealthData } from '../types/measurements';
import { setAuthHeaders } from '../utils/helpers';
import { errorHandler } from '../utils/toast';

function useFetchChildHealthData(childId: string) {
  const { user } = useSelector((state: RootState) => state.user);
  const [healthData, setHealthData] = useState<IChildHealthData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchHealthData = async (year: string | undefined = undefined) => {
    try {
      setIsLoading(true);
      const url = year
        ? BACKEND_URL + '/healthData/' + childId + '?year=' + year
        : BACKEND_URL + '/healthData/' + childId;
      const response = await axios.get(
        url,
        setAuthHeaders(user?.token as string),
      );
      setHealthData(response.data.data);
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchHealthData();
  }, []);

  return { healthData, fetchHealthData, isLoading };
}

export default useFetchChildHealthData;
