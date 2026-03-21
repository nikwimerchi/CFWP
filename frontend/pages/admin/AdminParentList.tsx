import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { BsSearch, BsEnvelope, BsGeoAlt } from 'react-icons/bs';

const AdminParentList = () => {
  const [parents, setParents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchParents = async () => {
      try {
        setLoading(true);
        // Fetching profiles where role is 'parent'
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'parent')
          .order('full_name', { ascending: true });

        if (error) throw error;
        setParents(data || []);
      } catch (error) {
        console.error('Error fetching parents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParents();
  }, []);

  const filteredParents = parents.filter((parent) =>
    parent.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Parent & Family Directory
        </h2>
      </div>

      {/* Search Bar */}
      <div className="mb-5">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <BsSearch />
          </span>
          <input
            type="text"
            placeholder="Search parents by name..."
            className="w-full rounded-lg border border-stroke bg-white py-3 pl-12 pr-5 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Parents Table */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium text-black dark:text-white">Full Name</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Location (Village)</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Contact Info</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-10 text-center text-gray-500">Loading families...</td></tr>
              ) : filteredParents.length === 0 ? (
                <tr><td colSpan={4} className="p-10 text-center text-gray-500">No parents found.</td></tr>
              ) : (
                filteredParents.map((parent) => (
                  <tr key={parent.id} className="border-b border-[#eee] dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4">
                    <td className="py-5 px-4">
                      <h5 className="font-medium text-black dark:text-white">
                        {parent.full_name}
                      </h5>
                    </td>
                    <td className="py-5 px-4">
                      <p className="flex items-center gap-2 text-sm text-black dark:text-white">
                        <BsGeoAlt className="text-primary" /> {parent.village || 'Not assigned'}
                      </p>
                      <span className="text-xs text-gray-400">{parent.sector}, {parent.cell}</span>
                    </td>
                    <td className="py-5 px-4">
                      <p className="flex items-center gap-2 text-sm">
                        <BsEnvelope className="text-gray-400" /> {parent.email || 'No email provided'}
                      </p>
                    </td>
                    <td className="py-5 px-4">
                      <span className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminParentList;