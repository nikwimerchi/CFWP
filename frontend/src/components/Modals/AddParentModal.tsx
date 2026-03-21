import { useState } from 'react';
import { BsXLg, BsPerson, BsCardText, BsTelephone, BsGeoAlt, BsCheck2Circle } from 'react-icons/bs';
import { supabase } from '../../../utils/supabaseClient';

interface AddParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddParentModal = ({ isOpen, onClose, onSuccess }: AddParentModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    national_id: '',
    phone_number: '',
    location: '', // District / Village
    sector: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Logic: We no longer pass an 'id'. 
      // The database will now generate one automatically.
      const { error } = await supabase.from('profiles').insert([
        {
          full_name: formData.full_name,
          national_id: formData.national_id,
          phone_number: formData.phone_number,
          village: formData.location, 
          sector: formData.sector,
          role: 'parent', 
        },
      ]);

      if (error) throw error;

      // Success cleanup
      setFormData({ full_name: '', national_id: '', phone_number: '', location: '', sector: '' });
      onSuccess();
      onClose();
    } catch (error: any) {
      // This will now catch any remaining schema mismatches
      alert(`Database Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-5">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl transition-all dark:bg-boxdark border border-stroke dark:border-strokedark overflow-hidden">
        
        <div className="flex justify-between items-center bg-[#F9FAFB] dark:bg-[#24303F] px-8 py-5 border-b border-stroke dark:border-strokedark">
          <div>
            <h3 className="text-xl font-bold text-black dark:text-white">Register New Parent</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fill in the family head details below.</p>
          </div>
          <button 
            onClick={onClose} 
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-meta-4 hover:text-danger transition-all"
          >
            <BsXLg size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            
            <div className="sm:col-span-2">
              <label className="mb-2.5 block text-sm font-semibold text-black dark:text-white">Full Name (Family Head)</label>
              <div className="relative">
                <input
                  required
                  type="text"
                  value={formData.full_name}
                  placeholder="Enter full name"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 pl-11 pr-4 text-black outline-none transition focus:border-primary active:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
                <BsPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <div>
              <label className="mb-2.5 block text-sm font-semibold text-black dark:text-white">National ID (NID)</label>
              <div className="relative">
                <input
                  required
                  type="text"
                  value={formData.national_id}
                  maxLength={16}
                  placeholder="1 19XX..."
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 pl-11 pr-4 text-black outline-none transition focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                  onChange={(e) => setFormData({ ...formData, national_id: e.target.value })}
                />
                <BsCardText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div>
              <label className="mb-2.5 block text-sm font-semibold text-black dark:text-white">Phone Number</label>
              <div className="relative">
                <input
                  required
                  type="text"
                  value={formData.phone_number}
                  placeholder="078..."
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 pl-11 pr-4 text-black outline-none transition focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                />
                <BsTelephone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div>
              <label className="mb-2.5 block text-sm font-semibold text-black dark:text-white">District / Village</label>
              <div className="relative">
                <input
                  required
                  type="text"
                  value={formData.location}
                  placeholder="e.g., Gasabo"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 pl-11 pr-4 text-black outline-none transition focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
                <BsGeoAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            <div>
              <label className="mb-2.5 block text-sm font-semibold text-black dark:text-white">Sector</label>
              <div className="relative">
                <input
                  required
                  type="text"
                  value={formData.sector}
                  placeholder="e.g., Kimironko"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 pl-11 pr-4 text-black outline-none transition focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                />
                <BsGeoAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col-reverse sm:flex-row gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex w-full justify-center rounded-xl border border-stroke py-3.5 font-bold text-black hover:bg-gray-50 dark:border-strokedark dark:text-white dark:hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-bold text-white shadow-lg transition hover:bg-opacity-90 active:scale-95 disabled:bg-opacity-70"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <BsCheck2Circle size={20} />
                  Register Parent
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddParentModal;