import React, { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddChildModal = ({ isOpen, onClose, onSuccess }: Props) => {
  const [parents, setParents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    dob: '',
    sex: 'Male',
    parent_id: '',
  });

  useEffect(() => {
    // Fetch parents so the Advisor can link the child to a family
    const fetchParents = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'parent');
      if (data) setParents(data);
    };
    if (isOpen) fetchParents();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('children').insert([
      {
        ...formData,
        registered_by: user?.id, // Track which Advisor registered them
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      onSuccess();
      onClose();
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-sm border border-stroke bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="mb-6 text-xl font-bold text-black dark:text-white">Register New Child</h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-full rounded border-[1.5px] border-stroke py-3 px-5 outline-none transition focus:border-primary"
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full rounded border-[1.5px] border-stroke py-3 px-5 outline-none transition focus:border-primary"
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              className="w-full rounded border-[1.5px] border-stroke py-3 px-5 outline-none transition focus:border-primary"
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              required
            />
            <select
              className="w-full rounded border-[1.5px] border-stroke py-3 px-5 outline-none transition focus:border-primary"
              onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <select
            className="w-full rounded border-[1.5px] border-stroke py-3 px-5 outline-none transition focus:border-primary"
            onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
            required
          >
            <option value="">Select Parent / Family</option>
            {parents.map((p) => (
              <option key={p.id} value={p.id}>{p.full_name}</option>
            ))}
          </select>

          <div className="flex justify-end gap-4 mt-4">
            <button type="button" onClick={onClose} className="text-black dark:text-white">Cancel</button>
            <button
              type="submit"
              disabled={loading}
              className="rounded bg-primary py-3 px-6 font-medium text-white hover:bg-opacity-90"
            >
              {loading ? 'Saving...' : 'Register Child'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChildModal;