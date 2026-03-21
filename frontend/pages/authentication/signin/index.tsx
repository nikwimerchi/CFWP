import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../utils/supabaseClient';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(`Login Error: ${error.message}`);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (!profile) {
        alert("Account verified, but profile role is missing. Contact Admin.");
        setLoading(false);
        return;
      }

      // Route based on the role in DB
      const dashboardMap: Record<string, string> = {
        admin: '/admin/dashboard',
        advisor: '/advisor/dashboard',
        parent: '/parent/dashboard'
      };
      navigate(dashboardMap[profile.role] || '/');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg border-t-4 border-indigo-600">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">CFWP Portal Sign In</h2>
        <form onSubmit={handleSignIn} className="space-y-4">
          <input type="email" placeholder="Email Address" required className="w-full border p-3 rounded" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required className="w-full border p-3 rounded" onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" disabled={loading} className="w-full rounded bg-indigo-600 p-3 text-white font-bold hover:bg-indigo-700">
            {loading ? "Authorizing..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;