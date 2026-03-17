import { useState } from 'react';
import { BsXLg } from 'react-icons/bs';
import { supabase } from '../../../utils/supabaseClient';

const AddAdvisorModal = ({ isOpen, onClose, onSuccess }: any) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    assigned_sector: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('advisors').insert([formData]);
    setLoading(false);
    if (!error) {
      onSuccess();
      onClose();
    } else {
      alert(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 dark:bg-boxdark">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-black dark:text-white">Register New Advisor</h3>
          <button onClick={onClose}><BsXLg /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input required type="text" className="w-full rounded border border-stroke p-2.5 dark:bg-meta-4" 
              onChange={(e) => setFormData({...formData, full_name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input required type="email" className="w-full rounded border border-stroke p-2.5 dark:bg-meta-4" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input required type="text" className="w-full rounded border border-stroke p-2.5 dark:bg-meta-4" 
                onChange={(e) => setFormData({...formData, phone_number: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Assigned Sector</label>
              <input required type="text" placeholder="e.g., Kicukiro" className="w-full rounded border border-stroke p-2.5 dark:bg-meta-4" 
                onChange={(e) => setFormData({...formData, assigned_sector: e.target.value})} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary py-3 font-medium text-white rounded hover:bg-opacity-90">
            {loading ? 'Processing...' : 'Add Advisor'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAdvisorModal;