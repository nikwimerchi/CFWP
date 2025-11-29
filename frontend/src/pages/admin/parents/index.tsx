import DefaultLayout from '../../../layout/DefaultLayout';
import PageLoader from '../../../components/page-loader';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import useFetchParents from '../../../hooks/admin/useFetchParents';
import useFetchKids from '../../../hooks/admin/useFetchKids';
import { useEffect, useState } from 'react';
import Filter from '../../../components/filter';
import { convertObjetToQueryParams } from '../../../utils/lib';
import { IUser } from '../../../types/user';
import { ParentChildrens } from './children';
const Parents = () => {
  const kids = useFetchKids();
  const parents = useFetchParents();

  const returnKidsNumber = (parentId: string): number => {
    return kids.children.filter((kid) => kid.parentId === parentId).length;
  };

  const [filters, setFilters] = useState({});
  const [showChildren, setShowChildren] = useState(false);
  const [selectedParent, setSelectedParent] = useState<IUser | undefined>(
    undefined,
  );

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      const query = convertObjetToQueryParams(filters);
      parents.fetchParents(query);
    }
  }, [filters]);

  return (
    <DefaultLayout>
      <PageLoader open={kids.isLoading || parents.isLoading} />
      <ParentChildrens
        allChildren={kids.children}
        selectedParent={selectedParent}
        setShowModal={setShowChildren}
        showModal={showChildren}
      />

      <Breadcrumb pageName="Parents List" exportableData={parents.parents} />

      <div>
        <div className="rounded-sm border border-stroke bg-white px-5 py-10 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <Filter hasAddressFilter setFilters={setFilters} />

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
                    Children
                  </th>
                  <th className="p-2 font-bold text-black dark:text-white">
                    Email
                  </th>
                  <th className="p-2 font-bold text-black dark:text-white">
                    Phone
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
                </tr>
              </thead>
              <tbody>
                {parents.parents.map((parent, key) => (
                  <tr key={key}>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <p className="font-medium text-black dark:text-white capitalize">
                        {key + 1}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <p className="font-medium text-black dark:text-white capitalize">
                        {parent.names}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <p
                        className="font-medium text-blue-500 underline cursor-pointer hover:text-green-500"
                        onClick={() => {
                          setSelectedParent(parent);
                          setShowChildren(true);
                        }}
                      >
                        {returnKidsNumber(parent._id)} Kid(s)
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <p className="font-medium text-black dark:text-white">
                        {parent.email}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <p className="font-medium text-black dark:text-white">
                        {parent.phoneNumber}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <p className="font-medium text-black dark:text-white">
                        {parent.address.district}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <p className="font-medium text-black dark:text-white">
                        {parent.address.sector}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <p className="font-medium text-black dark:text-white">
                        {parent.address.cell}
                      </p>
                    </td>
                    <td className="text-sm border-b border-[#eee] p-2 dark:border-strokedark">
                      <p className="font-medium text-black dark:text-white">
                        {parent.address.village}
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
