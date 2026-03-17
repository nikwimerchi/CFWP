import { useEffect, useState } from 'react';
import { BsSearch, BsPlusLg, BsPerson, BsCalendar3, BsGenderAmbiguous } from 'react-icons/bs';
import { supabase } from '../../utils/supabaseClient';
import AddChildModal from '../../src/components/Modals/AddChildModal';

const ChildRecords = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('children')
      .select(`
        id,
        full_name,
        date_of_birth,
        gender,
        status,
        families (
          family_head_name
        )
      `)
      .order('created_at', { ascending: false });

    if (!error) setChildren(data);
    setLoading(false);
  };

  const filteredChildren = children.filter((c) =>
    c.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Child Welfare Records
            </h4>
            <p className="text-sm">Track and monitor children registered under the CFWP portal.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-bodydark2" />
              <input
                type="text"
                placeholder="Search child name..."
                className="w-full rounded border border-stroke bg-gray py-2 pl-10 pr-4 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded bg-primary py-2 px-4.5 font-medium text-white hover:bg-opacity-90"
            >
              <BsPlusLg /> Register Child
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          {/* Table Header */}
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
            <div className="p-2.5 xl:p-5"><p className="text-sm font-bold uppercase">Child Name</p></div>
            <div className="p-2.5 text-center xl:p-5"><p className="text-sm font-bold uppercase">Parent/Guardian</p></div>
            <div className="p-2.5 text-center xl:p-5"><p className="text-sm font-bold uppercase">Date of Birth</p></div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5"><p className="text-sm font-bold uppercase">Gender</p></div>
            <div className="p-2.5 text-center xl:p-5"><p className="text-sm font-bold uppercase">Status</p></div>
          </div>

          {loading ? (
            <div className="p-10 text-center animate-pulse">Loading welfare records...</div>
          ) : filteredChildren.map((child, key) => (
            <div className={`grid grid-cols-3 sm:grid-cols-5 ${key === filteredChildren.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}`} key={child.id}>
              <div className="flex items-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white font-medium">{child.full_name}</p>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white text-sm">{child.families?.family_head_name || 'Unlinked'}</p>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5 gap-2">
                <BsCalendar3 className="text-primary text-xs" />
                <p className="text-black dark:text-white text-sm">{child.date_of_birth}</p>
              </div>
              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <p className="text-black dark:text-white">{child.gender}</p>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  child.status === 'Active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                }`}>
                  {child.status || 'Monitored'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddChildModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchChildren} 
      />
    </>
  );
};

export default ChildRecords;