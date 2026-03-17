import { useEffect, useState } from 'react';
import { BsPeople, BsPersonCheck, BsHeartPulse, BsShieldLock } from 'react-icons/bs';
import { supabase } from '../../utils/supabaseClient';

const AdminDashboardHome = () => {
  const [stats, setStats] = useState({
    advisors: 0,
    families: 0,
    children: 0,
    alerts: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      // Fetching counts from your Supabase tables
      const { count: advisorCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'advisor');
      const { count: familyCount } = await supabase.from('families').select('*', { count: 'exact', head: true });
      const { count: childCount } = await supabase.from('children').select('*', { count: 'exact', head: true });

      setStats({
        advisors: advisorCount || 0,
        families: familyCount || 0,
        children: childCount || 0,
        alerts: 5 // Placeholder for system alerts
      });
    };

    fetchStats();
  }, []);

  const cardData = [
    { title: 'Total Advisors', value: stats.advisors, icon: <BsPersonCheck className="text-primary" size={24} />, color: 'text-blue-500' },
    { title: 'Total Families', value: stats.families, icon: <BsPeople className="text-success" size={24} />, color: 'text-green-500' },
    { title: 'Registered Children', value: stats.children, icon: <BsHeartPulse className="text-danger" size={24} />, color: 'text-red-500' },
    { title: 'System Alerts', value: stats.alerts, icon: <BsShieldLock className="text-warning" size={24} />, color: 'text-yellow-500' },
  ];

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 2xl:p-10">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {cardData.map((card, index) => (
          <div key={index} className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              {card.icon}
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  {card.value}
                </h4>
                <span className="text-sm font-medium">{card.title}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">System Overview</h3>
          <p className="text-body">Welcome to the Child and Family Welfare Portal administrative panel. Use the sidebar to manage field operations and monitor system health.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;