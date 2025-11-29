import { useState } from 'react';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../../layout/DefaultLayout';
import { calculateAge, setAuthHeaders } from '../../../../utils/helpers';
import { EditModal } from '../edit';
import useFetchParentKids from '../../../../hooks/parents/useFetchParentKids';
import PageLoader from '../../../../components/page-loader';
import AlertConfirmation from '../../../../components/alert-confirmation';
import { RootState } from '../../../../redux/reducers';
import { useSelector } from 'react-redux';
import { BACKEND_URL } from '../../../../utils/constants';
import axios from 'axios';
import { errorHandler, toastMessage } from '../../../../utils/toast';
import { IChild } from '../../../../types/child';
import { Link } from 'react-router-dom';
import { BsFillChatSquareQuoteFill, BsInfoSquareFill } from 'react-icons/bs';
const ChildrenList = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { isLoading, fetchKids, children } = useFetchParentKids();

  const [selectedChild, setSelectedChild] = useState<IChild | undefined>(
    undefined,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      const response = await axios.delete(
        BACKEND_URL + `/child/${selectedChild?._id}`,
        setAuthHeaders(user?.token as string),
      );
      toastMessage('success', response.data.message);
      fetchKids();
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DefaultLayout>
      <PageLoader open={isLoading || isSubmitting} />

      <EditModal
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        fetData={fetchKids}
        selectedData={selectedChild}
      />
      <AlertConfirmation
        callback={handleDelete}
        setShowAlert={setShowAlert}
        showAlert={showAlert}
        description={`You are going to delete ${selectedChild?.firstName}, there is no going back`}
      />

      <Breadcrumb pageName="My children list" />

      <div>
        <div className="rounded-sm border border-stroke bg-white px-5 py-10 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4 text-sm">
                  <th className="p-2 font-bold text-black dark:text-white xl:pl-11">
                    No
                  </th>
                  <th className="p-2 font-bold text-black dark:text-white xl:pl-11">
                    Names
                  </th>
                  <th className="p-2 font-bold text-black dark:text-white">
                    Date of birth
                  </th>
                  <th className="p-2 font-bold text-black dark:text-white">
                    Age
                  </th>
                  <th className="p-2 font-bold text-black dark:text-white">
                    Sex
                  </th>
                  <th className="p-2 font-bold text-black dark:text-white">
                    Registered by
                  </th>
                  <th className="p-2 font-bold text-black dark:text-white">
                    Registered At
                  </th>
                  <th className="p-2 font-bold text-black dark:text-white">
                    Status
                  </th>
                  <th className="p-2 font-bold text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {children.map((child, key) => (
                  <tr key={key}>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white capitalize">
                        {key + 1}
                      </h5>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white capitalize">
                        {`${child.firstName} ${child.lastName}`}
                      </h5>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {child.dateOfBirth}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {calculateAge(child.dateOfBirth)}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <p className="text-black dark:text-white capitalize">
                        {child.sex}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <p className="text-black dark:text-white capitalize">
                        {child.registeredBy.role}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {child.createdAt.split('T')[0]}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <p
                        className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium capitalize ${
                          child.status === 'approved'
                            ? 'bg-success text-success'
                            : child.status === 'rejected'
                            ? 'bg-danger text-danger'
                            : 'bg-warning text-warning'
                        }`}
                      >
                        {child.status}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        {child.status === 'pending' && (
                          <button
                            className="hover:text-primary"
                            onClick={() => {
                              setSelectedChild(child);
                              setShowEditModal(true);
                            }}
                          >
                            <svg
                              className="fill-current"
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M14.5535 1.72131L15.8285 3.00006C16.1929 3.36468 16.1929 3.95006 15.8285 4.31468L6.19415 13.9491C6.05765 14.0856 5.87277 14.1601 5.68665 14.1601C5.50052 14.1601 5.31565 14.0856 5.17915 13.9491L3.9024 12.6723C3.53777 12.3077 3.53777 11.7223 3.9024 11.3577L13.5379 1.72331C14.1892 1.07202 15.3685 1.07202 16.0198 1.72331C16.6711 2.37459 16.6711 3.55393 16.0198 4.20521L14.5535 1.72131ZM13.1492 3.12556L14.4242 4.40056L13.0992 5.72556L11.8242 4.45056L13.1492 3.12556ZM5.84065 13.4323L5.8869 13.4786L5.84065 13.4323ZM4.33027 11.9218L4.37652 11.9681L4.33027 11.9218ZM3.8199 10.4114L3.86615 10.4576L3.8199 10.4114ZM12.3303 1.89727L12.3735 1.94052L12.3303 1.89727ZM14.0506 3.61756L14.0948 3.66081L14.0506 3.61756Z"
                                fill=""
                              />
                            </svg>
                          </button>
                        )}
                        {child.status != 'approved' && (
                          <button
                            className="hover:text-primary"
                            onClick={() => {
                              setSelectedChild(child);
                              setShowAlert(true);
                            }}
                          >
                            <svg
                              className="fill-current"
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                fill=""
                              />
                              <path
                                d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                fill=""
                              />
                              <path
                                d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                fill=""
                              />
                              <path
                                d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                fill=""
                              />
                            </svg>
                          </button>
                        )}
                        {child.status === 'approved' && (
                          <div className="flex gap-2">
                            <Link
                              className="text-blue-500 underline cursor-pointer  flex items-center justify-center gap-1"
                              to={'/children/list/' + child._id}
                              title="Check health info"
                            >
                              <BsInfoSquareFill /> <span>Health</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ChildrenList;
