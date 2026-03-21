import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { BsPersonPlus, BsTrash, BsPencilSquare, BsSearch } from 'react-icons/bs';
import AddAdvisorModal from '../../src/components/Modals/AddAdvisorModal';
import UpdateAdvisorModal from '../../src/components/Modals/UpdateAdvisorModal';

interface Advisor {
  id: string;
  full_name: string;
  sector: string;
  district: string;
  created_at: string;
}

const AdminAdvisorList = () => {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAdvisors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, sector, district, created_at')
        .eq('role', 'advisor')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdvisors(data || []);
    } catch (error: any) {
      console.error('Fetch error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete advisor ${name}?`)) {
      try {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setAdvisors(prev => prev.filter(adv => adv.id !== id));
      } catch (error: any) {
        alert('Error deleting advisor: ' + error.message);
      }
    }
  };

  // Triggers the edit flow by setting the advisor and opening the modal
  const handleEdit = (advisor: Advisor) => {
    setSelectedAdvisor(advisor);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    fetchAdvisors();
  }, []);

  const filteredAdvisors = advisors.filter((adv) =>
    (adv.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (adv.sector?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-black dark:text-white">Regional Advisors</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 transition"
        >
          <BsPersonPlus size={20} />
          Add New Advisor
        </button>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-4">
          <div className="relative w-full max-w-xs">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <BsSearch />
            </span>
            <input
              type="text"
              placeholder="Search by name or sector..."
              className="w-full rounded border border-stroke bg-gray py-2 pl-10 pr-4 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium text-black dark:text-white">Name</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Location</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Joined Date</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                  </td>
                </tr>
              ) : filteredAdvisors.length > 0 ? (
                filteredAdvisors.map((adv) => (
                  <tr key={adv.id} className="border-b border-stroke dark:border-strokedark">
                    <td className="py-5 px-4 text-black dark:text-white">{adv.full_name}</td>
                    <td className="py-5 px-4 text-black dark:text-white">
                      {adv.sector}, {adv.district}
                    </td>
                    <td className="py-5 px-4 text-black dark:text-white">
                      {new Date(adv.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-center justify-center space-x-3.5">
                        <button 
                          className="hover:text-primary transition"
                          onClick={() => handleEdit(adv)}
                        >
                          <BsPencilSquare size={18} />
                        </button>
                        <button 
                          className="hover:text-red-500 transition"
                          onClick={() => handleDelete(adv.id, adv.full_name)}
                        >
                          <BsTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-gray-500">
                    No advisors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <UpdateAdvisorModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAdvisor(null);
        }} 
        onSuccess={fetchAdvisors} 
        advisor={selectedAdvisor}
      />

      {/* Add Modal */}
      <AddAdvisorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchAdvisors} 
      />
    </div>
  );
};

export default AdminAdvisorList;