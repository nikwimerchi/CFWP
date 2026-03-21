import React, { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';

interface UpdateAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  advisor: any; 
}

const UpdateAdvisorModal = ({ isOpen, onClose, onSuccess, advisor }: UpdateAdvisorModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    sector: '',
    district: '',
  });

  useEffect(() => {
    if (advisor) {
      setFormData({
        full_name: advisor.full_name || '',
        sector: advisor.sector || '',
        district: advisor.district || '',
      });
    }
  }, [advisor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Standard update using existing columns only
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          sector: formData.sector,
          district: formData.district,
        })
        .eq('id', advisor.id);

      if (error) throw error;

      onSuccess(); 
      onClose();
    } catch (error: any) {
      alert('Update failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-sm border border-stroke bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="mb-6 text-xl font-bold text-black dark:text-white border-b pb-2">
          Edit Advisor
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2.5 block text-black dark:text-white text-sm">Full Name</label>
            <input
              type="text"
              value={formData.full_name}
              className="w-full rounded border border-stroke bg-transparent py-3 px-5 outline-none focus:border-primary dark:border-strokedark"
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2.5 block text-black dark:text-white text-sm">District</label>
              <input
                type="text"
                value={formData.district}
                className="w-full rounded border border-stroke bg-gray-2 py-3 px-5 dark:bg-meta-4"
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-2.5 block text-black dark:text-white text-sm">Sector</label>
              <input
                type="text"
                value={formData.sector}
                className="w-full rounded border border-stroke bg-transparent py-3 px-5 focus:border-primary dark:border-strokedark"
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-70"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded border border-stroke p-3 font-medium text-black dark:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAdvisorModal;