import DefaultLayout from '../../../../layout/DefaultLayout';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumb';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../../../utils/constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/reducers';
import { errorHandler, toastMessage } from '../../../../utils/toast';
import { setAuthHeaders } from '../../../../utils/helpers';
import PageLoader from '../../../../components/page-loader';

const RegisterNewChild = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { user } = useSelector((state: RootState) => state.user);

  interface ChildData {
    firstName: string;
    lastName: string;
    middleName: string;
    age: number;
    dateOfBirth: string;
    sex: string;
  }

  const [childData, setChildData] = useState<ChildData>({
    firstName: '',
    lastName: '',
    age: 0,
    dateOfBirth: '',
    middleName: '',
    sex: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = name === 'age' ? parseInt(value) : value;

    if (name === 'dateOfBirth') {
      const currentDate = new Date();
      const birthDate = new Date(value);
      const age = currentDate.getFullYear() - birthDate.getFullYear();
      const monthDifference = currentDate.getMonth() - birthDate.getMonth();
      if (
        monthDifference < 0 ||
        (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())
      ) {
        setChildData((prevData) => ({
          ...prevData,
          age: age,
          [name]: value,
        }));
      } else {
        setChildData((prevData) => ({
          ...prevData,
          age,
          [name]: value,
        }));
      }
    } else {
      setChildData((prevData) => ({
        ...prevData,
        [name]: newValue,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = { ...childData, parentId: user?._id };
      setIsLoading(true);

      const response = await axios.post(
        BACKEND_URL + '/child',
        data,
        setAuthHeaders(user?.token as string),
      );

      setChildData({
        firstName: '',
        lastName: '',
        age: 0,
        dateOfBirth: '',
        middleName: '',
        sex: '',
      });
      toastMessage('success', response.data.message);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      errorHandler(error);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Register New child" />
      <PageLoader open={isLoading} />
      <div>
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                {/* <div className="mb-4.5 flex flex-col gap-6 xl:flex-row"> */}
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
                    value={childData.firstName}
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
                    value={childData.middleName}
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
                    value={childData.lastName}
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
                    value={childData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>

                <div className="w-full mb-4.5 ">
                  <select
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                    value={childData.sex}
                    name="dateOfBirth"
                    onChange={(e) =>
                      setChildData((prev: any) => ({
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

                <div className="w-full mb-6 ">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Age <span className="text-meta-1">*</span>
                  </label>
                  <input
                    required
                    type="number"
                    disabled={true}
                    placeholder="Enter age"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    name="age"
                    value={childData.age}
                    onChange={handleChange}
                  />
                </div>

                <button
                  disabled={isLoading}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                >
                  {isLoading ? 'Registering...' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default RegisterNewChild;
