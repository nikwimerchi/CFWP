import DefaultLayout from '../../../layout/DefaultLayout';
import PageLoader from '../../../components/page-loader';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import useFetchMeasurements from '../../../hooks/useFetchMeasurements';

const Measurements = () => {
  const { isLoading, measurements } = useFetchMeasurements();

  return (
    <DefaultLayout>
      <PageLoader open={isLoading} />

      <Breadcrumb pageName="Measurements reference list" />

      <div>
        <div className="rounded-sm border border-stroke bg-white px-5 py-10 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
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
                    className="p-2 font-bold text-black dark:text-white text-center border-l border-red-300"
                    colSpan={3}
                  >
                    Height
                  </th>
                  <th
                    className="p-2 font-bold text-black dark:text-white text-center border-l border-r border-green-300"
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
