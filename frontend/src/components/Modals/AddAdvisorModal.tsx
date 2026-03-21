import React, { useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';

const AddAdvisorModal = ({ isOpen, onClose, onSuccess }: any) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: 'TemporaryPassword123!',
    province: 'Kigali',
    district: 'Gasabo',
    sector: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Pass data as metadata so the SQL trigger can pick it up
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            role: 'advisor',
            province: formData.province,
            district: formData.district,
            sector: formData.sector,
          },
        },
      });

      if (error) throw error;
      
      alert('Advisor registered successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-sm border border-stroke bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="mb-6 text-xl font-bold text-black dark:text-white border-b pb-2">Register Advisor</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full rounded border border-stroke p-3 outline-none dark:bg-form-input"
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full rounded border border-stroke p-3 outline-none dark:bg-form-input"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="District"
              defaultValue="Gasabo"
              className="rounded border border-stroke p-3 dark:bg-meta-4"
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            />
            <input
              type="text"
              placeholder="Sector"
              required
              className="rounded border border-stroke p-3 outline-none dark:bg-form-input"
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
            />
          </div>
          <button
            disabled={loading}
            className="w-full rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50"
          >
            {loading ? 'Creating Account...' : 'Register Advisor'}
          </button>
          <button type="button" onClick={onClose} className="w-full text-sm text-gray-500">Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddAdvisorModal;