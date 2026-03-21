import React, { useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '', password: '', fullName: '', role: 'parent',
    province: '', district: '', sector: '', cell: '', village: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (authError) {
      alert(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // UPSERT ensures we don't get "Duplicate Key" errors
      const { error: profileError } = await supabase.from('profiles').upsert([{
        id: authData.user.id,
        full_name: formData.fullName,
        role: formData.role,
        province: formData.province,
        district: formData.district,
        sector: formData.sector,
        cell: formData.cell,
        village: formData.village,
        updated_at: new Date().toISOString()
      }]);

      if (profileError) alert(`Profile Error: ${profileError.message}`);
      else alert("Success! Check your email for the verification link.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <form onSubmit={handleSignUp} className="w-full max-w-lg space-y-3 rounded-lg bg-white p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-indigo-700">CFWP Registration</h2>
        <input type="text" placeholder="Full Name" required className="w-full border p-2 rounded" onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
        <div className="grid grid-cols-2 gap-3">
          <input type="email" placeholder="Email" required className="border p-2 rounded" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <select className="border p-2 rounded" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
            <option value="parent">Parent</option>
            <option value="advisor">Advisor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <input type="text" placeholder="Province" className="border p-2 rounded" onChange={(e) => setFormData({...formData, province: e.target.value})} />
          <input type="text" placeholder="District" className="border p-2 rounded" onChange={(e) => setFormData({...formData, district: e.target.value})} />
          <input type="text" placeholder="Sector" className="border p-2 rounded" onChange={(e) => setFormData({...formData, sector: e.target.value})} />
          <input type="text" placeholder="Village" className="border p-2 rounded" onChange={(e) => setFormData({...formData, village: e.target.value})} />
        </div>
        <input type="password" placeholder="Password" className="w-full border p-2 rounded" onChange={(e) => setFormData({...formData, password: e.target.value})} />
        <button type="submit" disabled={loading} className="w-full bg-indigo-600 p-3 text-white rounded font-bold hover:bg-indigo-700">
          {loading ? "Registering..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default SignUp;