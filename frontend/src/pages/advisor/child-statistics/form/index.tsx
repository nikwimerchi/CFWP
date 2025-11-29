import { ChangeEvent, FormEvent, useState } from 'react';
import PageLoader from '../../../../components/page-loader';
import axios from 'axios';
import { BACKEND_URL } from '../../../../utils/constants';
import { errorHandler, toastMessage } from '../../../../utils/toast';
import { IChild } from '../../../../types/child';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/reducers';
import { setAuthHeaders } from '../../../../utils/helpers';

const initialState = {
  height: '',
  width: '',
  date: '',
  weight: '',
};

interface IProps {
  child: IChild | undefined;
  fetchHealthData: any;
}
function Form(props: IProps) {
  const { user } = useSelector((state: RootState) => state.user);
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const date = new Date(state.date);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const res = await axios.post(
        BACKEND_URL + '/healthData',
        {
          height: Number(state.height),
          width: Number(state.width),
          date: state.date,
          weight: Number(state.weight),
          month,
          year,
          childId: props.child?._id,
        },
        setAuthHeaders(user?.token as string),
      );
      setState(initialState);
      toastMessage('success', res.data.message);
      props.fetchHealthData();
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 py-10 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h3 className="font-bold text-lg uppercase">
          Register health measurement data
        </h3>
        <form className="mt-3 flex gap-4 flex-col" onSubmit={handleSubmit}>
          <div className="flex gap-1 flex-col">
            <label htmlFor="" className="text-sm">
              Height
            </label>
            <input
              required
              type="number"
              placeholder="Enter height"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              min={1}
              value={state.height}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setState((prev) => ({ ...prev, height: e.target.value }))
              }
            />
          </div>
          <div className="flex gap-1 flex-col">
            <label htmlFor="" className="text-sm">
              Weight
            </label>
            <input
              required
              type="number"
              placeholder="Enter weight"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              min={1}
              value={state.weight}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setState((prev) => ({ ...prev, weight: e.target.value }))
              }
            />
          </div>
          <div className="flex gap-1 flex-col">
            <label htmlFor="" className="text-sm">
              Fatness
            </label>
            <input
              required
              type="number"
              placeholder="Enter Fatness"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              min={1}
              value={state.width}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setState((prev) => ({ ...prev, width: e.target.value }))
              }
            />
          </div>
          <div className="flex gap-1 flex-col">
            <label htmlFor="" className="text-sm">
              Date
            </label>
            <input
              required
              type="date"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              min={1}
              value={state.date}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setState((prev) => ({ ...prev, date: e.target.value }))
              }
            />
          </div>
          <button
            type="submit"
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
          >
            Submit
          </button>
        </form>
      </div>
      <PageLoader open={isLoading} />
    </>
  );
}

export default Form;
