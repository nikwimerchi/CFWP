import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { supabase } from '../../../utils/supabaseClient'; //
import { errorHandler, toastMessage } from '../../../utils/toast';
import { setUser } from '../../../redux/actions/user';
import PageLoader from '../../../components/page-loader';

const SignIn: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;

      dispatch(setUser({ ...authData.user, ...profile }));
      toastMessage('success', `Welcome back, ${profile.names || 'User'}!`);

      // Redirection based on role
      if (profile.role === 'admin') navigate('/admin/advisors/list');
      else if (profile.role === 'advisor') navigate('/advisor/child-statistics');
      else navigate('/parent/chat');

    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-satoshi bg-[#F8FAFC] dark:bg-black">
      {/* Branding Side */}
      <div className="hidden w-1/2 flex-col justify-between bg-primary p-12 lg:flex relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="z-10 h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <div className="h-5 w-5 rounded-full bg-white shadow-lg" />
        </div>
        <div className="z-10 max-w-md">
          <h1 className="text-4xl font-bold text-white leading-tight">Welcome back to <br /> CFWP Platform.</h1>
          <p className="mt-4 text-white/70 text-lg">Access your dashboard to manage notifications and monitor progress.</p>
        </div>
        <div className="z-10 text-white/50 text-sm">© 2026 CFWP Project</div>
      </div>

      {/* Form Side */}
      <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-[450px]">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-black dark:text-white">Sign In</h2>
            <p className="mt-2 text-body dark:text-bodydark font-medium">Please enter your details to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-black dark:text-white">Email Address</label>
              <input
                name="email"
                type="email"
                required
                placeholder="name@example.com"
                onChange={handleInput}
                className="w-full rounded-xl border border-stroke bg-white py-4 px-5 text-black outline-none transition-all focus:border-primary focus:ring-[4px] focus:ring-primary/10 dark:border-strokedark dark:bg-form-input dark:text-white"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-black dark:text-white">Password</label>
                <Link to="/forgot-password" size-sm className="text-xs font-semibold text-primary hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  onChange={handleInput}
                  className="w-full rounded-xl border border-stroke bg-white py-4 pl-5 pr-12 text-black outline-none transition-all focus:border-primary focus:ring-[4px] focus:ring-primary/10 dark:border-strokedark dark:bg-form-input dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-bodydark hover:text-primary transition-colors"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full cursor-pointer rounded-xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-opacity-90 active:scale-[0.98] disabled:bg-opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-bodydark font-medium">
            New here? <Link to="/auth/signup" className="font-bold text-primary hover:underline">Create account</Link>
          </p>
        </div>
      </div>
      <PageLoader open={isLoading} />
    </div>
  );
};

export default SignIn;