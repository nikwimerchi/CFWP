import { useState } from 'react';
import { BsXLg, BsSave } from 'react-icons/bs';
import { supabase } from '../../../utils/supabaseClient';

interface AddParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddParentModal = ({ isOpen, onClose, onSuccess }: AddParentModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    family_head_name: '',
    national_id: '',
    phone_number: '',
    location: '',
    sector: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('families').insert([
      {
        family_head_name: formData.family_head_name,
        national_id: formData.national_id,
        phone_number: formData.phone_number,
        location: `${formData.sector}, ${formData.location}`, // Combining for the directory
      },
    ]);

    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      setFormData({ family_head_name: '', national_id: '', phone_number: '', location: '', sector: '' });
      onSuccess();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999999 flex items-center justify-center bg-black/50 px-4 py-5">
      <div className="w-full max-w-142.5 rounded-lg bg-white py-8 px-8 dark:bg-boxdark">
        <div className="flex justify-between items-center mb-6 border-b border-stroke dark:border-strokedark pb-4">
          <h3 className="text-xl font-bold text-black dark:text-white">Register New Parent</h3>
          <button onClick={onClose} className="hover:text-primary"><BsXLg /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2.5 block text-black dark:text-white text-sm font-medium">Full Name (Family Head)</label>
              <input
                required
                type="text"
                placeholder="Enter full name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2.5 px-4 outline-none transition focus:border-primary dark:border-strokedark dark:bg-form-input"
                onChange={(e) => setFormData({ ...formData, family_head_name: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white text-sm font-medium">National ID (NID)</label>
              <input
                required
                type="text"
                maxLength={16}
                placeholder="1 19XX..."
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2.5 px-4 outline-none focus:border-primary dark:border-strokedark dark:bg-form-input"
                onChange={(e) => setFormData({ ...formData, national_id: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white text-sm font-medium">Phone Number</label>
              <input
                required
                type="text"
                placeholder="078..."
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2.5 px-4 outline-none focus:border-primary dark:border-strokedark dark:bg-form-input"
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white text-sm font-medium">District</label>
              <input
                required
                type="text"
                placeholder="e.g., Gasabo"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2.5 px-4 outline-none focus:border-primary dark:border-strokedark dark:bg-form-input"
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white text-sm font-medium">Sector</label>
              <input
                required
                type="text"
                placeholder="e.g., Kimironko"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2.5 px-4 outline-none focus:border-primary dark:border-strokedark dark:bg-form-input"
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex w-full justify-center rounded border border-stroke py-2.5 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded bg-primary py-2.5 font-medium text-white hover:bg-opacity-90"
            >
              {loading ? 'Saving...' : 'Register Parent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddParentModal;