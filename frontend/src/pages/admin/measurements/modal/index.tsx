import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { errorHandler, toastMessage } from '../../../../utils/toast';
import FullAreaLoader from '../../../../components/full-area-loader';
import axios from 'axios';
import { BACKEND_URL } from '../../../../utils/constants';
import { setAuthHeaders } from '../../../../utils/helpers';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/reducers';
import { IMeasurement } from '../../../../types/measurements';

interface IProps {
  showModal: boolean;
  setShowModal: any;
  fetchData: any;
  selectedItem: IMeasurement | undefined;
  setSelectedItem: any;
}

const initialState = {
  age: '',
  months: '',

  redHeight: '',
  yellowHeight: '',
  greenHeight: '',

  redWeight: '',
  yellowWeight: '',
  greenWeight: '',

  redWidth: '',
  yellowWidth: '',
  greenWidth: '',
};

export const Modal = (props: IProps) => {
  const { user } = useSelector((store: RootState) => store.user);
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (props.showModal && props.selectedItem) {
      setState({
        age: props.selectedItem.age.toString(),
        months: props.selectedItem.months.toString(),

        redHeight: props.selectedItem.redHeight.toString(),
        yellowHeight: props.selectedItem.yellowHeight.toString(),
        greenHeight: props.selectedItem.greenHeight.toString(),

        redWeight: props.selectedItem.redWeight.toString(),
        yellowWeight: props.selectedItem.yellowWeight.toString(),
        greenWeight: props.selectedItem.greenWeight.toString(),

        redWidth: props.selectedItem.redWidth.toString(),
        yellowWidth: props.selectedItem.yellowWidth.toString(),
        greenWidth: props.selectedItem.greenWidth.toString(),
      });
    }
  }, [props]);

  const returnMinNumber = (val: any) => {
    if (typeof val === 'string' && val === '') return 1;

    return (Number(val) + 1).toString();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const url = props.selectedItem
        ? BACKEND_URL + '/measurements/' + props.selectedItem._id
        : BACKEND_URL + '/measurements';
      const res = await axios.post(
        url,
        {
          age: Number(state.age),
          months: Number(state.months),
          redHeight: Number(state.redHeight),
          yellowHeight: Number(state.yellowHeight),
          greenHeight: Number(state.greenHeight),
          redWeight: Number(state.redWeight),
          yellowWeight: Number(state.yellowWeight),
          greenWeight: Number(state.greenWeight),
          redWidth: Number(state.redWidth),
          yellowWidth: Number(state.yellowWidth),
          greenWidth: Number(state.greenWidth),
        },
        setAuthHeaders(user?.token as string),
      );
      toastMessage('success', res.data.message);
      props.setShowModal(false);
      props.fetchData();
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className={`modal-container fixed z-9999 ${
        props.showModal ? 'flex' : 'hidden'
      } justify-center items-center inset-0 backdrop-blur-sm bg-strokedark/50`}
    >
      <div className="modal rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-auto  w-[60%] relative">
        <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
          <div className="w-full flex justify-between">
            <h2 className="text-lg">Add Measurement</h2>
            <strong
              className="text-xl align-center cursor-pointer"
              onClick={() => {
                props.setShowModal(false);
                setState(initialState);
                props.setSelectedItem(undefined);
              }}
            >
              &times;
            </strong>
          </div>
        </div>
        <FullAreaLoader open={isLoading} />
        <div className="p-4 max-h-[80vh]">
          <div className="max-w-full overflow-x-auto pb-5">
            <form className="flex gap-2 flex-col" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Age <span className="text-meta-1">*</span>
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="Enter age"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={state.age}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setState((prev) => ({ ...prev, age: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Months <span className="text-meta-1">*</span>
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="Enter months"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    min={0}
                    max={12}
                    value={state.months}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setState((prev) => ({ ...prev, months: e.target.value }))
                    }
                  />
                </div>
              </div>
              <hr />
              <div>
                <span>Height</span>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="mb-2.5 block text-black dark:text-white text-sm">
                      Red<span className="text-meta-1">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="Enter height"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={state.redHeight}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setState((prev) => ({
                          ...prev,
                          redHeight: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-2.5 block text-black dark:text-white text-sm">
                      Yellow<span className="text-meta-1">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="Enter height"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={state.yellowHeight}
                      min={returnMinNumber(state.redHeight)}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setState((prev) => ({
                          ...prev,
                          yellowHeight: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-2.5 block text-black dark:text-white text-sm">
                      Green<span className="text-meta-1">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="Enter height"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      min={returnMinNumber(state.yellowHeight)}
                      value={state.greenHeight}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setState((prev) => ({
                          ...prev,
                          greenHeight: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              <hr />
              <div>
                <span>Weight (kg)</span>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="mb-2.5 block text-black dark:text-white text-sm">
                      Red<span className="text-meta-1">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="Enter weight"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={state.redWeight}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setState((prev) => ({
                          ...prev,
                          redWeight: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-2.5 block text-black dark:text-white text-sm">
                      Yellow<span className="text-meta-1">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="Enter weight"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      min={returnMinNumber(state.redWeight)}
                      value={state.yellowWeight}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setState((prev) => ({
                          ...prev,
                          yellowWeight: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-2.5 block text-black dark:text-white text-sm">
                      Green<span className="text-meta-1">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="Enter weight"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      min={returnMinNumber(state.yellowWeight)}
                      value={state.greenWeight}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setState((prev) => ({
                          ...prev,
                          greenWeight: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              <hr />
              <div>
                <span>Width/Fat</span>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="mb-2.5 block text-black dark:text-white text-sm">
                      Red<span className="text-meta-1">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="Enter width"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      value={state.redWidth}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setState((prev) => ({
                          ...prev,
                          redWidth: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-2.5 block text-black dark:text-white text-sm">
                      Yellow<span className="text-meta-1">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="Enter width"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      min={returnMinNumber(state.redWidth)}
                      value={state.yellowWidth}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setState((prev) => ({
                          ...prev,
                          yellowWidth: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-2.5 block text-black dark:text-white text-sm">
                      Green<span className="text-meta-1">*</span>
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="Enter months"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      min={returnMinNumber(state.yellowWidth)}
                      value={state.greenWidth}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setState((prev) => ({
                          ...prev,
                          greenWidth: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <button
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 text-sm"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
