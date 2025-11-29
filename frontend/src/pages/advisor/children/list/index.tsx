import { useEffect, useState } from 'react';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../../layout/DefaultLayout';
import { calculateAge, setAuthHeaders } from '../../../../utils/helpers';
import { EditModal } from '../edit';
import PageLoader from '../../../../components/page-loader';
import AlertConfirmation from '../../../../components/alert-confirmation';
import { RootState } from '../../../../redux/reducers';
import { useSelector } from 'react-redux';
import { BACKEND_URL } from '../../../../utils/constants';
import axios from 'axios';
import { errorHandler, toastMessage } from '../../../../utils/toast';
import { IChild } from '../../../../types/child';
import useFetchAdvisorKids from '../../../../hooks/advisors/useFetchAdvisorKids';

import { Link } from 'react-router-dom';
import Filter from '../../../../components/filter';
import useFetchAdvisorParents from '../../../../hooks/advisors/userFechAdvisorParents';
import { convertObjetToQueryParams } from '../../../../utils/lib';

const ChildrenList = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { isLoading, fetchKids, children } = useFetchAdvisorKids();

  const { parents } = useFetchAdvisorParents();

  const [selectedChild, setSelectedChild] = useState<IChild | undefined>(
    undefined,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showApproveAlert, setShowApproveAlert] = useState(false);
  const [showRejectAlert, setShowRejectAlert] = useState(false);
  const [showFullDeatailsModal, setShowFullDetailsModal] = useState(false);

  const [filters, setFilters] = useState({});

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      const response = await axios.put(
        BACKEND_URL + `/child/approve/${selectedChild?._id}`,
        {},
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

  const handleReject = async () => {
    try {
      setIsSubmitting(true);
      const response = await axios.put(
        BACKEND_URL + `/child/reject/${selectedChild?._id}`,
        {},
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

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      const query = convertObjetToQueryParams(filters);
      fetchKids(query);
    }
  }, [filters]);

  return (
    <DefaultLayout>
      <PageLoader open={isLoading || isSubmitting} />

      <EditModal
        showModal={showFullDeatailsModal}
        setShowModal={setShowFullDetailsModal}
        fetData={fetchKids}
        selectedData={selectedChild}
      />
      <AlertConfirmation
        callback={handleApprove}
        setShowAlert={setShowApproveAlert}
        showAlert={showApproveAlert}
        description={`You are going to approve ${selectedChild?.firstName}, there is no going back`}
      />

      <AlertConfirmation
        callback={handleReject}
        setShowAlert={setShowRejectAlert}
        showAlert={showRejectAlert}
        description={`You are going to reject ${selectedChild?.firstName}, there is no going back`}
      />

      <Breadcrumb
        pageName="My Village's children list"
        exportableData={children}
      />

      <div>
        <div className="rounded-sm border border-stroke bg-white px-5 py-10 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <Filter
            hasAddressFilter={false}
            setFilters={setFilters}
            filters={[
              {
                label: 'Parent',
                name: 'parentId',
                options: parents.map((parent) => ({
                  label: parent.names,
                  value: parent._id,
                })),
              },
            ]}
          />
          <div className="max-w-full overflow-x-auto mt-5">
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
                    Parent's Name
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
                        {child.parent.names}
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
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark flex items-center justify-between gap-1">
                      {/* <button
                        className="hover:text-primary"
                        onClick={() => {
                          setSelectedChild(child);
                          setShowFullDetailsModal(true);
                        }}
                      >
                        <BsEye />
                      </button> */}
                      {child.status === 'pending' && (
                        <div className="flex items-center space-x-3.5">
                          <button
                            className="hover:text-primary"
                            onClick={() => {
                              setSelectedChild(child);
                              setShowApproveAlert(true);
                            }}
                          >
                            Approve
                          </button>
                          <button
                            className="text-danger"
                            onClick={() => {
                              setSelectedChild(child);
                              setShowRejectAlert(true);
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {child.status === 'approved' && (
                        <Link to={'/children/list/' + child._id}>
                          <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
                            Health Info
                          </button>
                        </Link>
                      )}
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
