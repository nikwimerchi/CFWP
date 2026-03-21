import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { BsSearch, BsEnvelope, BsGeoAlt, BsPlusLg, BsThreeDotsVertical, BsPersonCircle, BsTelephone } from 'react-icons/bs';
import AddParentModal from '../../src/components/Modals/AddParentModal'; 

const AdminParentList = () => {
  const [parents, setParents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchParents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'parent')
        .order('created_at', { ascending: false }); 

      if (error) throw error;
      setParents(data || []);
    } catch (error) {
      console.error('Error fetching parents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  const filteredParents = parents.filter((parent) =>
    parent.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.national_id?.includes(searchTerm)
  );

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* Header Section */}
      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-black dark:text-white">
            Parents
          </h2>
          <p className="font-medium text-gray-500 dark:text-gray-400">
            Manage registered family heads and household data.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-primary py-4 px-6 text-center font-bold text-white hover:bg-opacity-90 shadow-lg transition-all active:scale-95"
        >
          <BsPlusLg size={18} />
          New
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative w-full max-w-[450px]">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <BsSearch size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by name or National ID..."
            className="w-full rounded-xl border border-stroke bg-white py-3.5 pl-12 pr-5 text-black outline-none transition focus:border-primary dark:border-strokedark dark:bg-boxdark dark:text-white shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-stroke bg-white shadow-xl dark:border-strokedark dark:bg-boxdark overflow-hidden">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#F7F9FC] text-left dark:bg-meta-4 border-b border-stroke dark:border-strokedark">
                <th className="py-5 px-6 font-bold text-[#1C2434] dark:text-white uppercase text-xs tracking-wider">Parent Profile</th>
                <th className="py-5 px-6 font-bold text-[#1C2434] dark:text-white uppercase text-xs tracking-wider text-center">Location</th>
                <th className="py-5 px-6 font-bold text-[#1C2434] dark:text-white uppercase text-xs tracking-wider text-center">Contact</th>
                <th className="py-5 px-6 font-bold text-[#1C2434] dark:text-white uppercase text-xs tracking-wider text-center">Status</th>
                <th className="py-5 px-6 font-bold text-[#1C2434] dark:text-white uppercase text-xs tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-stroke dark:border-strokedark">
                    <td colSpan={5} className="p-10 bg-gray-50/20 dark:bg-white/5"></td>
                  </tr>
                ))
              ) : filteredParents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-gray-500 font-medium">
                    No family records found.
                  </td>
                </tr>
              ) : (
                filteredParents.map((parent) => (
                  <tr key={parent.id} className="border-b border-[#eee] dark:border-strokedark hover:bg-[#F9FAFB] dark:hover:bg-white/5 transition-colors group">
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <BsPersonCircle size={28} />
                        </div>
                        <div>
                          <h5 className="font-bold text-[#1C2434] dark:text-white group-hover:text-primary transition-colors">
                            {parent.full_name}
                          </h5>
                          <span className="text-xs font-medium text-gray-400">NID: {parent.national_id || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex flex-col items-center justify-center">
                        <p className="flex items-center gap-1.5 text-sm font-semibold text-black dark:text-white">
                          <BsGeoAlt className="text-primary" /> {parent.village || 'N/A'}
                        </p>
                        <span className="text-xs text-gray-500">{parent.sector}</span>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <p className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                          <BsTelephone size={14} className="text-gray-400" /> {parent.phone_number || 'No phone'}
                        </p>
                        {parent.email && (
                          <p className="flex items-center gap-2 text-xs text-gray-400">
                             <BsEnvelope size={12} /> {parent.email}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <span className="inline-flex items-center rounded-full bg-success/10 py-1.5 px-4 text-xs font-bold text-success border border-success/20">
                        Active
                      </span>
                    </td>
                    <td className="py-5 px-6 text-right">
                      <button className="text-gray-400 hover:text-primary p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                        <BsThreeDotsVertical size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddParentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchParents} 
      />
    </div>
  );
};

export default AdminParentList;