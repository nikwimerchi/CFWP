import { useState, useEffect } from 'react';
import { BsXLg } from 'react-icons/bs';
import { supabase } from '../../../utils/supabaseClient';

const AddChildModal = ({ isOpen, onClose, onSuccess }: any) => {
  const [parents, setParents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    family_id: '',
    date_of_birth: '',
    gender: 'Male',
  });

  useEffect(() => {
    if (isOpen) {
      const fetchParents = async () => {
        const { data } = await supabase.from('families').select('id, family_head_name');
        if (data) setParents(data);
      };
      fetchParents();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('children').insert([formData]);
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
          <h3 className="text-xl font-bold text-black dark:text-white">Register Child</h3>
          <button onClick={onClose}><BsXLg /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input required type="text" className="w-full rounded border border-stroke p-2.5 dark:bg-meta-4" 
              onChange={(e) => setFormData({...formData, full_name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Parent/Guardian</label>
            <select required className="w-full rounded border border-stroke p-2.5 dark:bg-meta-4"
              onChange={(e) => setFormData({...formData, family_id: e.target.value})}>
              <option value="">Select a Parent</option>
              {parents.map(p => <option key={p.id} value={p.id}>{p.family_head_name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth</label>
              <input required type="date" className="w-full rounded border border-stroke p-2.5 dark:bg-meta-4" 
                onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select className="w-full rounded border border-stroke p-2.5 dark:bg-meta-4"
                onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary py-3 font-medium text-white rounded hover:bg-opacity-90">
            {loading ? 'Registering...' : 'Register Child'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddChildModal;