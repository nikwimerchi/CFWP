import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { BsSearch, BsPersonBadge, BsGeoAlt, BsTrash } from 'react-icons/bs';

const AdminAdvisorList = () => {
  const [advisors, setAdvisors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAdvisors = async () => {
    try {
      setLoading(true);
      // Fetching profiles where role is 'advisor'
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'advisor')
        .order('full_name', { ascending: true });

      if (error) throw error;
      setAdvisors(data || []);
    } catch (error) {
      console.error('Error fetching advisors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisors();
  }, []);

  const filteredAdvisors = advisors.filter((advisor) =>
    advisor.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Regional Advisor Management
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
            placeholder="Search advisors by name..."
            className="w-full rounded-lg border border-stroke bg-white py-3 pl-12 pr-5 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Advisors Table */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium text-black dark:text-white">Advisor Name</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Assigned Area</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Role Status</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-10 text-center text-gray-500">Loading advisors...</td></tr>
              ) : filteredAdvisors.length === 0 ? (
                <tr><td colSpan={4} className="p-10 text-center text-gray-500">No advisors found.</td></tr>
              ) : (
                filteredAdvisors.map((advisor) => (
                  <tr key={advisor.id} className="border-b border-[#eee] dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4">
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <BsPersonBadge size={20} />
                        </div>
                        <h5 className="font-medium text-black dark:text-white">
                          {advisor.full_name}
                        </h5>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <p className="flex items-center gap-2 text-sm text-black dark:text-white">
                        <BsGeoAlt className="text-primary" /> {advisor.sector || 'Unassigned'}
                      </p>
                      <span className="text-xs text-gray-400">{advisor.district || 'N/A'}</span>
                    </td>
                    <td className="py-5 px-4">
                      <span className="inline-flex rounded-full bg-blue-100 py-1 px-3 text-sm font-medium text-blue-600">
                        {advisor.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-5 px-4">
                      <button className="text-red-500 hover:text-red-700">
                        <BsTrash size={18} />
                      </button>
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

export default AdminAdvisorList;