import DefaultLayout from '../../../layout/DefaultLayout';
import PageLoader from '../../../components/page-loader';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { useState } from 'react';
import { Modal } from './modal';
import useFetchMeasurements from '../../../hooks/useFetchMeasurements';
import { BsPen, BsTrash } from 'react-icons/bs';
import { IMeasurement } from '../../../types/measurements';
import AlertConfirmation from '../../../components/alert-confirmation';
import axios from 'axios';
import { BACKEND_URL } from '../../../utils/constants';
import { errorHandler, toastMessage } from '../../../utils/toast';
import { setAuthHeaders } from '../../../utils/helpers';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducers';

const Measurements = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const { fetchMeasurements, isLoading, measurements } = useFetchMeasurements();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsubmitting] = useState(false);

  const [selectedItem, setSelectedItem] = useState<IMeasurement | undefined>(
    undefined,
  );

  const [showAlert, setShowAlert] = useState(false);

  const handleDelete = async () => {
    try {
      setIsubmitting(true);
      const res = await axios.delete(
        BACKEND_URL + '/measurements/' + selectedItem?._id,
        setAuthHeaders(user?.token as string),
      );
      toastMessage('success', res.data.message);
      fetchMeasurements();
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsubmitting(false);
    }
  };

  return (
    <DefaultLayout>
      <PageLoader open={isLoading || isSubmitting} />
      <Modal
        setShowModal={setShowModal}
        showModal={showModal}
        fetchData={fetchMeasurements}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />

      <AlertConfirmation
        callback={handleDelete}
        description="You are going to delete measurement and there will be no going back."
        setShowAlert={setShowAlert}
        showAlert={showAlert}
      />

      <Breadcrumb pageName="Measurements reference list" />

      <div>
        <div className="rounded-sm border border-stroke bg-white px-5 py-10 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="text-right">
            <button
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 flex items-center gap-2 text-sm"
              onClick={() => setShowModal(true)}
            >
              Add new
            </button>
          </div>
          <div className="max-w-full overflow-x-auto mt-3">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4 text-sm">
                  <th className="p-2 font-bold text-black dark:text-white xl:pl-11">
                    No
                  </th>
                  <th className="p-2 font-bold text-black dark:text-white xl:pl-11">
                    Age
                  </th>
                  <th className="p-2 font-bold text-black dark:text-white">
                    Months
                  </th>
                  <th
                    className="p-2 font-bold text-black dark:text-white text-center"
                    colSpan={3}
                  >
                    Height
                  </th>
                  <th
                    className="p-2 font-bold text-black dark:text-white text-center"
                    colSpan={3}
                  >
                    Weight
                  </th>
                  <th
                    className="p-2 font-bold text-black dark:text-white text-center"
                    colSpan={3}
                  >
                    Fat
                  </th>
                  <th className="p-2 font-bold text-black dark:text-white">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {measurements.map((item, position) => (
                  <tr key={position}>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <p className="font-medium text-black dark:text-white capitalize">
                        {position + 1}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <p className="font-medium text-black dark:text-white capitalize">
                        {item.age}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <p className="font-medium text-black dark:text-white capitalize">
                        {item.months}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark bg-red-500">
                      <p className="font-medium text-black dark:text-white capitalize">
                        {item.redHeight}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark bg-yellow-500">
                      <p className="font-medium text-black dark:text-white capitalize">
                        {item.yellowHeight}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark bg-green-500">
                      <p className="font-medium text-black dark:text-white capitalize">
                        {item.greenHeight}
                      </p>
                    </td>

                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark bg-red-500">
                      <p className="font-medium text-black dark:text-white capitalize">
                        {item.redWeight}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark bg-yellow-500">
                      <p className="font-medium text-black dark:text-white capitalize">
                        {item.yellowWeight}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark bg-green-500">
                      <p className="font-medium text-black dark:text-white capitalize">
                        {item.greenWeight}
                      </p>
                    </td>

                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark bg-red-500">
                      <p className="font-medium text-black dark:text-white capitalize">
                        {item.redWidth}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark bg-yellow-500">
                      <p className="font-medium text-black dark:text-white capitalize">
                        {item.yellowWidth}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark bg-green-500">
                      <p className="font-medium text-black dark:text-white capitalize">
                        {item.greenWidth}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <div className="flex items-center gap-2">
                        <button
                          className="text-sm text-primary"
                          onClick={() => {
                            setSelectedItem(item);
                            setShowModal(true);
                          }}
                        >
                          <BsPen />
                        </button>

                        <button
                          className="text-sm text-red-500"
                          onClick={() => {
                            setSelectedItem(item);
                            setShowAlert(true);
                          }}
                        >
                          <BsTrash />
                        </button>
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

export default Measurements;
