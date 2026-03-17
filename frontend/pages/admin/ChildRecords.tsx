import { useEffect, useState } from 'react';
import { BsSearch, BsPlusLg, BsHeartPulse } from 'react-icons/bs';
import { supabase } from '../../utils/supabaseClient';
import AddChildModal from '../../src/components/Modals/AddChildModal';

const ChildRecords = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { fetchChildren(); }, []);

  const fetchChildren = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('children').select('*, families(family_head_name)').order('full_name', { ascending: true });
    if (!error) setChildren(data);
    setLoading(false);
  };

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h4 className="text-xl font-semibold text-black dark:text-white">Registered Children</h4>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded bg-primary py-2 px-4.5 font-medium text-white hover:bg-opacity-90">
            <BsPlusLg /> Add Child
          </button>
        </div>

        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
            <div className="p-2.5 xl:p-5"><p className="text-sm font-bold uppercase text-black dark:text-white">Child Name</p></div>
            <div className="p-2.5 text-center xl:p-5"><p className="text-sm font-bold uppercase text-black dark:text-white">Parent/Guardian</p></div>
            <div className="hidden p-2.5 text-center sm:block xl:p-5"><p className="text-sm font-bold uppercase text-black dark:text-white">DOB</p></div>
            <div className="p-2.5 text-center xl:p-5"><p className="text-sm font-bold uppercase text-black dark:text-white">Health Status</p></div>
          </div>

          {loading ? (
            <div className="p-10 text-center dark:text-white">Loading child records...</div>
          ) : children.map((child, key) => (
            <div className="grid grid-cols-3 sm:grid-cols-4 border-b border-stroke dark:border-strokedark" key={child.id}>
              <div className="p-2.5 xl:p-5 text-black dark:text-white">{child.full_name}</div>
              <div className="p-2.5 text-center xl:p-5 text-black dark:text-white">{child.families?.family_head_name}</div>
              <div className="hidden p-2.5 text-center sm:block xl:p-5 text-black dark:text-white">{child.dob}</div>
              <div className="p-2.5 text-center xl:p-5"><span className="text-success text-sm font-bold">Stable</span></div>
            </div>
          ))}
        </div>
      </div>
      <AddChildModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchChildren} />
    </>
  );
};
export default ChildRecords;