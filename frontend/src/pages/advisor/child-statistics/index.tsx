import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import useFetchSingleChild from '../../../hooks/useFetchSingleChild';
import { useParams } from 'react-router-dom';
import PageLoader from '../../../components/page-loader';
import { calculateAge } from '../../../utils/helpers';
import Form from './form';
import HeathData from './healthData';
import useFetchChildHealthData from '../../../hooks/useFetchChildHealthData';

const ChildStatistics = () => {
  const { id } = useParams();

  const kid = useFetchSingleChild(id as string);

  const healthData = useFetchChildHealthData(id as string);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Child health statistics" />
      <PageLoader open={kid.isLoading} />

      <div className="rounded-sm border border-stroke bg-white px-5 py-10 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4 text-sm">
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
                  Parent's Name
                </th>
                <th className="p-2 font-bold text-black dark:text-white">
                  Registered At
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-sm p-2">
                  <span className="font-medium text-black dark:text-white capitalize">
                    {kid.child?.firstName} {kid.child?.middleName}{' '}
                    {kid.child?.lastName}
                  </span>
                </td>
                <td className="text-sm p-2">
                  <span className="font-medium text-black dark:text-white capitalize">
                    {kid.child?.dateOfBirth}
                  </span>
                </td>
                <td className="text-sm p-2">
                  <span className="font-medium text-black dark:text-white capitalize">
                    {kid.child && calculateAge(kid.child.dateOfBirth)}
                  </span>
                </td>
                <td className="text-sm p-2">
                  <span className="font-medium text-black dark:text-white capitalize">
                    {kid.child?.parent.names}
                  </span>
                </td>
                <td className="text-sm p-2">
                  <span className="font-medium text-black dark:text-white capitalize">
                    {kid.child?.createdAt.split('T')[0]}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-5">
        <div className="col-span-2 flex gap-4 flex-col">
          <div className="rounded-sm border border-stroke bg-white px-5 py-10 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <HeathData
              fetchHealthData={healthData.fetchHealthData}
              healthData={healthData.healthData}
              isLoading={healthData.isLoading}
            />
          </div>
        </div>
        <div>
          <Form
            child={kid.child}
            fetchHealthData={healthData.fetchHealthData}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ChildStatistics;
