import axios from 'axios';

import { useSelector } from 'react-redux';
import { errorHandler, toastMessage } from '../../../../utils/toast';
import { BACKEND_URL } from '../../../../utils/constants';
import { setAuthHeaders } from '../../../../utils/helpers';
import { RootState } from '../../../../redux/reducers';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { IChild } from '../../../../types/child';
import FullAreaLoader from '../../../../components/full-area-loader';

interface IProps {
  showModal: boolean;
  setShowModal: any;
  selectedData: IChild | undefined;
  fetData: any;
}

const initialState = {
  firstName: '',
  lastName: '',
  middleName: '',
  age: '',
  dateOfBirth: '',
  sex: '',
};
export const EditModal = (props: IProps) => {
  const { user } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [state, setState] = useState(initialState);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = name === 'age' ? parseInt(value) : value;

    setState((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.put(
        BACKEND_URL + `/child/${props.selectedData?._id}`,
        {
          ...state,
          age: Number(state.age),
          parentId: props.selectedData?.parentId,
        },
        setAuthHeaders(user?.token as string),
      );
      toastMessage('success', response.data.message);
      props.fetData();
      props.setShowModal(false);
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (props.showModal && props.selectedData)
      setState({
        firstName: props.selectedData.firstName,
        lastName: props.selectedData.lastName,
        middleName: props.selectedData.middleName,
        age: String(props.selectedData.age),
        dateOfBirth: props.selectedData.dateOfBirth,
        sex: props.selectedData.sex,
      });
  }, [props]);

  return (
    <div
      className={`modal-container fixed z-50 ${
        props.showModal ? 'flex' : 'hidden'
      } justify-center items-center inset-0 backdrop-blur-sm bg-strokedark/50`}
    >
      <div className="modal rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-auto w-2/5 relative">
        <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
          <div className="w-full flex justify-between">
            <h2 className="text-lg">Edit child</h2>
            <strong
              className="text-xl align-center cursor-pointer"
              onClick={() => props.setShowModal(false)}
            >
              &times;
            </strong>
          </div>
        </div>
        <div className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="w-full mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  First name <span className="text-meta-1">*</span>
                </label>
                <input
                  required
                  type="text"
                  disabled={isLoading}
                  placeholder="Enter first name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  name="firstName"
                  value={state.firstName}
                  onChange={handleChange}
                />
              </div>

              <div className="w-full mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Middle name (optional)
                </label>
                <input
                  type="text"
                  disabled={isLoading}
                  placeholder="Enter middle name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  name="middleName"
                  value={state.middleName}
                  onChange={handleChange}
                />
              </div>

              <div className="w-full mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Last name <span className="text-meta-1">*</span>
                </label>
                <input
                  required
                  type="text"
                  disabled={isLoading}
                  placeholder="Enter last name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  name="lastName"
                  value={state.lastName}
                  onChange={handleChange}
                />
              </div>

              <div className="w-full mb-4.5 ">
                <label className="mb-2.5 block text-black dark:text-white">
                  Date of birth <span className="text-meta-1">*</span>
                </label>
                <input
                  required
                  type="Date"
                  disabled={isLoading}
                  placeholder="Enter Date of birth"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  name="dateOfBirth"
                  value={state.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              <div className="w-full mb-4.5 ">
                <select
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                  value={state.sex}
                  onChange={(e) =>
                    setState((prev: any) => ({
                      ...prev,
                      sex: e.target.value,
                    }))
                  }
                >
                  <option value="">Choose sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-5">
              <button
                className="btn flex justify-center rounded  border border-strokedark py-2 px-6 font-medium text-primary hover:shadow-1"
                type="button"
                onClick={() => props.setShowModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
        <FullAreaLoader open={isLoading} />
      </div>
    </div>
  );
};
