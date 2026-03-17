import { useEffect, useState } from 'react';
import { BsEye, BsTrash, BsSearch, BsPlusLg, BsTelephone } from 'react-icons/bs';
import { supabase } from '../../utils/supabaseClient';
import AddParentModal from '../../src/components/Modals/AddParentModal';

const Parents = () => {
  const [parents, setParents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('families')
      .select(`
        id,
        family_head_name,
        national_id,
        location,
        phone_number,
        children:children(count)
      `)
      .order('created_at', { ascending: false });

    if (!error) setParents(data);
    setLoading(false);
  };

  const filteredParents = parents.filter((p) =>
    p.family_head_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.national_id?.includes(searchTerm)
  );

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this parent record?')) {
      const { error } = await supabase.from('families').delete().eq('id', id);
      if (error) {
        alert("Error: " + error.message);
      } else {
        fetchParents();
      }
    }
  };

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Parent & Caregiver Directory
            </h4>
            <p className="text-sm">Manage primary family contacts and welfare assignments.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-bodydark2" />
              <input
                type="text"
                placeholder="Search by name or NID..."
                className="w-full rounded border border-stroke bg-gray py-2 pl-10 pr-4 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded bg-primary py-2 px-4.5 font-medium text-white hover:bg-opacity-90 transition"
            >
              <BsPlusLg /> Add Parent
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          {/* Table Header - Now 6 columns to accommodate NID */}
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-6">
            <div className="p-2.5 xl:p-5"><p className="text-sm font-bold uppercase">Full Name</p></div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5"><p className="text-sm font-bold uppercase">National ID</p></div>
            <div className="p-2.5 text-center xl:p-5"><p className="text-sm font-bold uppercase">Location</p></div>
            <div className="p-2.5 text-center xl:p-5"><p className="text-sm font-bold uppercase">Contact</p></div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5"><p className="text-sm font-bold uppercase">Children</p></div>
            <div className="p-2.5 text-center xl:p-5"><p className="text-sm font-bold uppercase">Actions</p></div>
          </div>

          {/* Table Body */}
          {loading ? (
            <div className="p-10 text-center animate-pulse">Loading records...</div>
          ) : filteredParents.length === 0 ? (
            <div className="p-10 text-center text-bodydark2">No records found.</div>
          ) : (
            filteredParents.map((parent, key) => (
              <div 
                className={`grid grid-cols-3 sm:grid-cols-6 ${
                  key === filteredParents.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
                } hover:bg-gray-50 dark:hover:bg-meta-4/5 transition`} 
                key={parent.id}
              >
                <div className="flex items-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white font-medium">{parent.family_head_name}</p>
                </div>
                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <p className="text-sm font-mono text-black dark:text-white">{parent.national_id || '---'}</p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white text-sm">{parent.location}</p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5 gap-2">
                  <BsTelephone className="text-primary text-xs" />
                  <p className="text-black dark:text-white text-sm">{parent.phone_number}</p>
                </div>
                <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                    {parent.children?.[0]?.count || 0} Children
                  </span>
                </div>
                <div className="flex items-center justify-center p-2.5 gap-4 xl:p-5">
                  <button title="View Profile" className="hover:text-primary transition"><BsEye size={18} /></button>
                  <button 
                    onClick={() => handleDelete(parent.id)}
                    title="Delete Record" 
                    className="hover:text-red-500 transition"
                  >
                    <BsTrash size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for adding parents */}
      <AddParentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchParents} 
      />
    </>
  );
};

export default Parents;