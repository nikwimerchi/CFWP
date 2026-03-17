import { useState } from 'react';
import { BsPerson, BsShieldLock, BsKey } from 'react-icons/bs';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../App';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword });
    
    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      alert("Password updated successfully!");
      setPasswordData({ newPassword: '', confirmPassword: '' });
    }
  };

  return (
    <div className="mx-auto max-w-242.5">
      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {/* Banner Section */}
        <div className="relative z-20 h-35 md:h-48 bg-gradient-to-r from-blue-700 to-indigo-900 flex items-center justify-center">
           <h2 className="text-2xl font-bold text-white opacity-20 uppercase tracking-widest text-center px-4">
             Account Security & Profile
           </h2>
        </div>
        
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          {/* Profile Image Placeholder */}
          <div className="relative z-30 mx-auto -mt-16 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-200 dark:bg-meta-4">
              <BsPerson size={64} className="text-bodydark2" />
            </div>
          </div>

          <div className="mt-4">
            <h3 className="mb-1 text-2xl font-semibold text-black dark:text-white">Admin User</h3>
            <p className="text-sm font-medium text-primary mb-8 uppercase tracking-widest">{user?.role}</p>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 text-left max-w-220 mx-auto">
              
              {/* Personal Information Card */}
              <div className="rounded-sm border border-stroke p-6 dark:border-strokedark bg-gray-50 dark:bg-meta-4/10">
                <h4 className="mb-6 flex items-center gap-2 font-semibold text-black dark:text-white border-b border-stroke dark:border-strokedark pb-2">
                  <BsPerson className="text-primary" /> Profile Information
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase opacity-50 mb-1">Email</label>
                    <p className="text-sm font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase opacity-50 mb-1">Account Role</label>
                    <p className="text-sm font-medium uppercase text-primary">{user?.role}</p>
                  </div>
                </div>
              </div>

              {/* Password Security Card */}
              <div className="rounded-sm border border-stroke p-6 dark:border-strokedark bg-gray-50 dark:bg-meta-4/10">
                <h4 className="mb-6 flex items-center gap-2 font-semibold text-black dark:text-white border-b border-stroke dark:border-strokedark pb-2">
                  <BsShieldLock className="text-primary" /> Change Password
                </h4>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div>
                    <input
                      type="password"
                      placeholder="New Password"
                      required
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full rounded border border-stroke bg-white dark:bg-boxdark py-2.5 px-4 text-sm outline-none focus:border-primary dark:border-strokedark"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      required
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="w-full rounded border border-stroke bg-white dark:bg-boxdark py-2.5 px-4 text-sm outline-none focus:border-primary dark:border-strokedark"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center gap-2 items-center rounded bg-primary py-2.5 px-4 text-sm font-medium text-white hover:bg-opacity-90 transition shadow-sm"
                  >
                    <BsKey /> {loading ? 'Updating...' : 'Save New Password'}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;