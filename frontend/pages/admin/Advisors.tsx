import { useEffect, useState } from 'react';
import { BsSearch, BsPlusLg, BsPersonBadge, BsEnvelope, BsTelephone } from 'react-icons/bs';
import { supabase } from '../../utils/supabaseClient';
import AddAdvisorModal from '../../src/components/Modals/AddAdvisorModal';

const Advisors = () => {
  const [advisors, setAdvisors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAdvisors();
  }, []);

  const fetchAdvisors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('advisors')
      .select('*')
      .order('full_name', { ascending: true });

    if (!error) setAdvisors(data);
    setLoading(false);
  };

  const filteredAdvisors = advisors.filter((a) =>
    a.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h4 className="text-xl font-semibold text-black dark:text-white">Social Welfare Advisors</h4>
            <p className="text-sm">Manage field agents and social workers assigned to families.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-bodydark2" />
              <input
                type="text"
                placeholder="Search advisors..."
                className="w-full rounded border border-stroke bg-gray py-2 pl-10 pr-4 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded bg-primary py-2 px-4.5 font-medium text-white hover:bg-opacity-90"
            >
              <BsPlusLg /> Add Advisor
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
            <div className="p-2.5 xl:p-5"><p className="text-sm font-bold uppercase">Advisor Name</p></div>
            <div className="p-2.5 text-center xl:p-5"><p className="text-sm font-bold uppercase">Contact Info</p></div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5"><p className="text-sm font-bold uppercase">Assigned Sector</p></div>
            <div className="p-2.5 text-center xl:p-5"><p className="text-sm font-bold uppercase">Status</p></div>
          </div>

          {loading ? (
            <div className="p-10 text-center">Loading advisors...</div>
          ) : filteredAdvisors.map((advisor, key) => (
            <div className={`grid grid-cols-3 sm:grid-cols-4 ${key === filteredAdvisors.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}`} key={advisor.id}>
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <BsPersonBadge size={20} />
                </div>
                <p className="text-black dark:text-white font-medium">{advisor.full_name}</p>
              </div>
              <div className="flex flex-col items-center justify-center p-2.5 xl:p-5">
                <p className="text-sm flex items-center gap-1"><BsEnvelope className="text-xs" /> {advisor.email}</p>
                <p className="text-xs text-bodydark2">{advisor.phone_number}</p>
              </div>
              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <p className="text-black dark:text-white">{advisor.assigned_sector || 'General'}</p>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <span className="bg-success/10 text-success px-3 py-1 rounded-full text-xs font-bold">Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddAdvisorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchAdvisors} 
      />
    </>
  );
};

export default Advisors;