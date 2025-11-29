import DefaultLayout from '../../../../layout/DefaultLayout';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumb';
//@ts-ignore
import { Provinces, Districts, Sectors, Villages, Cells } from 'rwanda';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../../../utils/constants';
import { setAuthHeaders } from '../../../../utils/helpers';
import { errorHandler, toastMessage } from '../../../../utils/toast';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/reducers';
import PageLoader from '../../../../components/page-loader';

const RegisterNewAdvisor = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [provincesList, setProvincesList] = useState<string[]>([]);
  const [districtsList, setDistrictsList] = useState<string[]>([]);
  const [sectorsList, setSectorsList] = useState<string[]>([]);
  const [cellsList, setCellsList] = useState<string[]>([]);
  const [villagesList, setVillagesList] = useState<string[]>([]);

  const validPhoneCode = ['8', '9', '2', '3'];

  interface IAdvisorState {
    names: string;
    email: string;
    phoneNumber: string;
    address: {
      province: string;
      district: string;
      sector: string;
      cell: string;
      village: string;
    };
  }

  const [advisorData, setAdvisorData] = useState<IAdvisorState>({
    names: '',
    email: '',
    phoneNumber: '',
    address: {
      province: '',
      district: '',
      sector: '',
      cell: '',
      village: '',
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setAdvisorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    setProvincesList(Provinces());
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      if (
        !validPhoneCode.includes(advisorData.phoneNumber[2]) ||
        advisorData.phoneNumber[0] !== '0' ||
        advisorData.phoneNumber[1] !== '7' ||
        advisorData.phoneNumber.length !== 10
      ) {
        toastMessage(
          'error',
          'Invalid phone number. please provide a valid MTN or AIRTEL-TIGO phone number.',
        );
        return;
      }

      const response = await axios.post(
        BACKEND_URL + '/advisors',
        advisorData,
        setAuthHeaders(user?.token as string),
      );

      setAdvisorData({
        names: '',
        email: '',
        phoneNumber: '',
        address: {
          province: '',
          district: '',
          sector: '',
          cell: '',
          village: '',
        },
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
      <Breadcrumb pageName="Register New advisor" />
      <PageLoader open={isLoading} />
      <div>
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Names <span className="text-meta-1">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Enter Advisor name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      name="names"
                      value={advisorData.names}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Email <span className="text-meta-1">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    name="email"
                    value={advisorData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="tel"
                      name="phoneNumber"
                      value={advisorData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Enter your phone number. Ex: 078....."
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Address
                  </label>

                  {/* Province dropdown */}
                  <div className="mb-2">
                    <select
                      required
                      value={advisorData.address.province}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        setAdvisorData((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            province: e.target.value,
                          },
                        }));
                        e.target.value === ''
                          ? setDistrictsList([])
                          : setDistrictsList(Districts(e.target.value));
                      }}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                      <option value="">Choose Province</option>
                      {provincesList.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District dropdown */}
                  <div className="mb-2">
                    <select
                      required
                      value={advisorData.address.district}
                      onChange={(e) => {
                        setAdvisorData((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            district: e.target.value,
                          },
                        }));
                        e.target.value === ''
                          ? setSectorsList([])
                          : setSectorsList(
                              Sectors(
                                advisorData.address.province,
                                e.target.value,
                              ),
                            );
                      }}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                      <option value="">Choose District</option>
                      {districtsList.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sector dropdown */}
                  <div className="mb-2">
                    <select
                      required
                      value={advisorData.address.sector}
                      onChange={(e) => {
                        setAdvisorData((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            sector: e.target.value,
                          },
                        }));
                        e.target.value === ''
                          ? setCellsList([])
                          : setCellsList(
                              Cells(
                                advisorData.address.province,
                                advisorData.address.district,
                                e.target.value,
                              ),
                            );
                      }}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                      <option value="">Choose Sector</option>
                      {sectorsList.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Cell dropdown */}
                  <div className="mb-2">
                    <select
                      required
                      value={advisorData.address.cell}
                      onChange={(e) => {
                        setAdvisorData((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            cell: e.target.value,
                          },
                        }));
                        e.target.value === ''
                          ? setVillagesList([])
                          : setVillagesList(
                              Villages(
                                advisorData.address.province,
                                advisorData.address.district,
                                advisorData.address.sector,
                                e.target.value,
                              ),
                            );
                      }}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                      <option value="">Choose Cell</option>
                      {cellsList.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Village dropdown */}
                  <div className="mb-4">
                    <select
                      required
                      value={advisorData.address.village}
                      onChange={(e) =>
                        setAdvisorData((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            village: e.target.value,
                          },
                        }))
                      }
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                      <option value="">Choose Village</option>
                      {villagesList.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
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

export default RegisterNewAdvisor;
