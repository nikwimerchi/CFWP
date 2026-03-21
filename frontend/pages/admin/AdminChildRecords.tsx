import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { BsSearch, BsFilter, BsArrowRight } from 'react-icons/bs';

const AdminChildRecords = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAllChildren = async () => {
      try {
        setLoading(true);
        // Joins children with their parent profile and latest measurement
        const { data, error } = await supabase
          .from('children')
          .select(`
            *,
            profiles:parent_id (full_name, village, sector),
            measurements (status, recorded_at)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setChildren(data || []);
      } catch (error) {
        console.error('Error fetching child records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllChildren();
  }, []);

  const filteredChildren = children.filter((child) =>
    `${child.first_name} ${child.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to get the most recent health status
  const getLatestStatus = (measurements: any[]) => {
    if (!measurements || measurements.length === 0) return 'No Data';
    const latest = measurements.sort((a, b) => 
      new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
    )[0];
    return latest.status;
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Global Child Health Registry
        </h2>
      </div>

      {/* Search and Global Filters */}
      <div className="mb-5 flex gap-4">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <BsSearch />
          </span>
          <input
            type="text"
            placeholder="Search by child name..."
            className="w-full rounded-lg border border-stroke bg-white py-3 pl-12 pr-5 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Children Master Table */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium text-black dark:text-white">Child Details</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Parent & Location</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Health Status</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-10 text-center">Loading all records...</td></tr>
              ) : (
                filteredChildren.map((child) => {
                  const status = getLatestStatus(child.measurements);
                  return (
                    <tr key={child.id} className="border-b border-[#eee] dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4">
                      <td className="py-5 px-4">
                        <p className="font-medium text-black dark:text-white">
                          {child.first_name} {child.last_name}
                        </p>
                        <p className="text-xs text-gray-500">DOB: {new Date(child.dob).toLocaleDateString()}</p>
                      </td>
                      <td className="py-5 px-4">
                        <p className="text-sm text-black dark:text-white">{child.profiles?.full_name}</p>
                        <p className="text-xs text-gray-400">{child.profiles?.sector} - {child.profiles?.village}</p>
                      </td>
                      <td className="py-5 px-4">
                        <span className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${
                          status === 'Red' ? 'bg-danger/10 text-danger' :
                          status === 'Yellow' ? 'bg-warning/10 text-warning' :
                          status === 'Green' ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-5 px-4">
                        <button className="flex items-center gap-1 text-primary hover:underline text-sm">
                          View History <BsArrowRight />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminChildRecords;