import useFetchAdvisorKids from '../../../hooks/advisors/useFetchAdvisorKids';
import DefaultLayout from '../../../layout/DefaultLayout';
import PageLoader from '../../../components/page-loader';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import useFetchAdvisorParents from '../../../hooks/advisors/userFechAdvisorParents';

const Parents = () => {
  const kids = useFetchAdvisorKids();
  const parents = useFetchAdvisorParents();

  const returnKidsNumber = (parentId: string): number => {
    return kids.children.filter((kid) => kid.parentId === parentId).length;
  };

  return (
    <DefaultLayout>
      <PageLoader open={kids.isLoading || parents.isLoading} />

      <Breadcrumb
        pageName="My Village's Parents"
        exportableData={parents.parents}
      />

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
                    Number of children
                  </th>
                  <th className="p-2 font-bold text-black dark:text-white">
                    Email
                  </th>
                  <th className="p-2 font-bold text-black dark:text-white">
                    Phone
                  </th>
                </tr>
              </thead>
              <tbody>
                {parents.parents.map((parent, key) => (
                  <tr key={key}>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white capitalize">
                        {key + 1}
                      </h5>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white capitalize">
                        {parent.names}
                      </h5>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white">
                        {returnKidsNumber(parent._id)} Kid(s)
                      </h5>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white">
                        {parent.email}
                      </h5>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <p className="font-medium text-black dark:text-white">
                        {parent.phoneNumber}
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

export default Parents;
