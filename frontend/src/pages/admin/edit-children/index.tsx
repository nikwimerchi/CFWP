import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import useFetchSingleChild from '../../../hooks/useFetchSingleChild';
import { useNavigate, useParams } from 'react-router-dom';
import PageLoader from '../../../components/page-loader';
import { ChangeEvent, useEffect, useState } from 'react';
import { BACKEND_URL } from '../../../utils/constants';
import axios from 'axios';
import { setAuthHeaders } from '../../../utils/helpers';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducers';
import { errorHandler, toastMessage } from '../../../utils/toast';

const initialState = {
  firstName: '',
  lastName: '',
  middleName: '',
  age: '',
  sex: '',
  dateOfBirth: '',
};

const EditChild = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [state, setState] = useState(initialState);

  const kid = useFetchSingleChild(id as string);

  useEffect(() => {
    if (kid.child) {
      setState({
        firstName: kid.child.firstName,
        lastName: kid.child.lastName,
        middleName: kid.child.middleName,
        age: kid.child.age as any,
        sex: kid.child.sex,
        dateOfBirth: kid.child.dateOfBirth,
      });
    }
  }, [kid.isLoading]);

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
        BACKEND_URL + `/child/${kid.child?._id}`,
        {
          ...state,
          age: Number(state.age),
          parentId: kid.child?.parentId,
        },
        setAuthHeaders(user?.token as string),
      );
      toastMessage('success', response.data.message);
      navigate('/parents');
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log({ state });

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Edit Child info" />
      <PageLoader open={kid.isLoading || isLoading} />

      <div className="rounded-sm border border-stroke bg-white px-5 py-10 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
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
                    setState((prev) => ({
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
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EditChild;
