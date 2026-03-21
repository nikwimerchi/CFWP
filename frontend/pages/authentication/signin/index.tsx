import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../../utils/supabaseClient';
import { BsEnvelope, BsLock, BsEye, BsEyeSlash } from 'react-icons/bs';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

      const dashboardMap: Record<string, string> = {
        admin: '/admin/dashboard',
        advisor: '/advisor/dashboard',
        parent: '/parent/dashboard'
      };
      navigate(dashboardMap[profile?.role || ''] || '/');
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#F1F5F9] lg:flex-row lg:px-20">
      
      {/* Left Branding Section */}
      <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
        <h1 className="text-center text-5xl font-bold text-[#1C2434]">
          Child & Family Welfare
        </h1>
        <h2 className="mt-2 text-center text-5xl font-bold text-[#3C50E0]">
          Portal
        </h2>
        <div className="mt-10 flex justify-center">
          <img 
            src="/logo.png" 
            alt="Family Illustration" 
            className="h-auto w-full max-w-[420px] object-contain" 
          />
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <h3 className="mb-10 text-center text-5xl font-semibold text-[#1C2434]">
            Sign In
          </h3>

          <form onSubmit={handleSignIn} className="space-y-6">
            {/* Email Field - Dark text on clean background */}
            <div>
              <label className="mb-2.5 block text-sm font-semibold text-[#1C2434]">Email</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="admin@gmail.com"
                  required
                  className="w-full rounded-xl border border-stroke bg-[#E2E8F0] py-4 px-5 pr-12 text-black outline-none transition focus:border-primary focus:bg-white dark:border-strokedark"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <BsEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={22} />
              </div>
            </div>

            {/* Password Field - Dark text on clean background */}
            <div>
              <label className="mb-2.5 block text-sm font-semibold text-[#1C2434]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="•••••"
                  required
                  className="w-full rounded-xl border border-stroke bg-[#E2E8F0] py-4 px-5 pr-12 text-black outline-none transition focus:border-primary focus:bg-white dark:border-strokedark"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <BsEyeSlash size={22} /> : <BsEye size={22} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-[#3C50E0] py-4 text-xl font-bold text-white shadow-md transition hover:bg-opacity-90 active:scale-[0.98] disabled:bg-opacity-70"
            >
              {loading ? (
                <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-500 text-lg font-medium">
              Don't have any account?{' '}
              <Link to="/signup" className="font-semibold text-[#3C50E0] hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;