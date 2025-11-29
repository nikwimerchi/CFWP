import { useEffect, useState } from 'react';
import Breadcrumb from '../../../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../../../layout/DefaultLayout';
import { setAuthHeaders } from '../../../../utils/helpers';
import PageLoader from '../../../../components/page-loader';
import AlertConfirmation from '../../../../components/alert-confirmation';
import { RootState } from '../../../../redux/reducers';
import { useSelector } from 'react-redux';
import { BACKEND_URL } from '../../../../utils/constants';
import axios from 'axios';
import { errorHandler, toastMessage } from '../../../../utils/toast';
import useFetchAdvisors from '../../../../hooks/admin/useFetchAdvisors';
import { IUser } from '../../../../types/user';
import Filter from '../../../../components/filter';
import { convertObjetToQueryParams } from '../../../../utils/lib';

const Advisors = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { isLoading, advisors, fetchAdvisors } = useFetchAdvisors();

  const [selectedAdvisor, setSelectedAdvisor] = useState<IUser | undefined>(
    undefined,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showApproveAlert, setShowApproveAlert] = useState(false);
  const [showRejectAlert, setShowRejectAlert] = useState(false);

  const [filters, setFilters] = useState({});

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(
        BACKEND_URL + `/advisors/approve/${selectedAdvisor?._id}`,
        {},
        setAuthHeaders(user?.token as string),
      );
      toastMessage('success', response.data.message);
      fetchAdvisors();
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(
        BACKEND_URL + `/advisors/reject/${selectedAdvisor?._id}`,
        {},
        setAuthHeaders(user?.token as string),
      );
      toastMessage('success', response.data.message);
      fetchAdvisors();
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      const query = convertObjetToQueryParams(filters);
      fetchAdvisors(query);
    }
  }, [filters]);

  return (
    <DefaultLayout>
      <PageLoader open={isLoading || isSubmitting} />

      <AlertConfirmation
        callback={handleApprove}
        setShowAlert={setShowApproveAlert}
        showAlert={showApproveAlert}
        description={`You are going to Enable ${selectedAdvisor?.names}, there is no going back`}
      />

      <AlertConfirmation
        callback={handleReject}
        setShowAlert={setShowRejectAlert}
        showAlert={showRejectAlert}
        description={`You are going to Disable ${selectedAdvisor?.names}, there is no going back`}
      />

      <Breadcrumb pageName="Advisors" exportableData={advisors} />

      <div>
        <div className="rounded-sm border border-stroke bg-white px-5 py-10 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <Filter
            hasAddressFilter
            columns={6}
            setFilters={setFilters}
            filters={[
              {
                name: 'isVerified',
                label: 'status',
                options: [
                  {
                    label: 'Active',
                    value: 'true',
                  },
                  {
                    label: 'Disabled',
                    value: 'false',
                  },
                ],
              },
            ]}
          />
          <div className="max-w-full overflow-x-auto mt-3">
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
                    Email
                  </th>
                  <th className="p-2 font-bold text-black dark:text-white">
                    District
                  </th>
                  <th className="p-2 font-bold text-black dark:text-white">
                    Sector
                  </th>
                  <th className="p-2 font-bold text-black dark:text-white">
                    Cell
                  </th>
                  <th className="p-2 font-bold text-black dark:text-white">
                    Village
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
                {advisors.map((advisor, key) => (
                  <tr key={key}>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white capitalize">
                        {key + 1}
                      </h5>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white capitalize">
                        {`${advisor.names}`}
                      </h5>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {advisor.email}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {advisor.address.district}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {advisor.address.sector}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {advisor.address.cell}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {advisor.address.village}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <p
                        className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium capitalize ${
                          advisor.isVerified
                            ? 'bg-success text-success'
                            : 'bg-danger text-danger'
                        }`}
                      >
                        {advisor.isVerified ? 'Verified' : 'Not verified'}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      {!advisor.isVerified ? (
                        <button
                          className="hover:text-primary"
                          onClick={() => {
                            setSelectedAdvisor(advisor);
                            setShowApproveAlert(true);
                          }}
                        >
                          Enable
                        </button>
                      ) : (
                        <button
                          className="text-danger"
                          onClick={() => {
                            setSelectedAdvisor(advisor);
                            setShowRejectAlert(true);
                          }}
                        >
                          Disable
                        </button>
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

export default Advisors;
