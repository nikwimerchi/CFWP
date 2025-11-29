import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../utils/constants';
import axios from 'axios';
import { IMeasurement } from '../types/measurements';
import { setAuthHeaders } from '../utils/helpers';
import { errorHandler } from '../utils/toast';

function useFetchMeasurements() {
  const { user } = useSelector((state: RootState) => state.user);
  const [measurements, setMeasurements] = useState<IMeasurement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchMeasurements = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        BACKEND_URL + '/measurements',
        setAuthHeaders(user?.token as string),
      );
      setMeasurements(response.data.measurements);
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchMeasurements();
  }, []);

  return { measurements, fetchMeasurements, isLoading };
}

export default useFetchMeasurements;
