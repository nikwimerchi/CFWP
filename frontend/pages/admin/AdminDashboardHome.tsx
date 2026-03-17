import { useEffect, useState } from 'react';
import { BsPeople, BsPersonCheck, BsHeartPulse, BsShieldLock } from 'react-icons/bs';
import { supabase } from '../../utils/supabaseClient';

const AdminDashboardHome = () => {
  const [stats, setStats] = useState({ advisors: 0, families: 0, children: 0, alerts: 5 });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: advisors } = await supabase.from('advisors').select('*', { count: 'exact', head: true });
      const { count: families } = await supabase.from('families').select('*', { count: 'exact', head: true });
      const { count: children } = await supabase.from('children').select('*', { count: 'exact', head: true });

      setStats(prev => ({ ...prev, advisors: advisors || 0, families: families || 0, children: children || 0 }));
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Advisors', value: stats.advisors, icon: <BsPersonCheck />, color: 'text-primary' },
    { label: 'Total Parents', value: stats.families, icon: <BsPeople />, color: 'text-meta-3' },
    { label: 'Registered Children', value: stats.children, icon: <BsHeartPulse />, color: 'text-meta-5' },
    { label: 'System Alerts', value: stats.alerts, icon: <BsShieldLock />, color: 'text-danger' },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      {statCards.map((card, index) => (
        <div key={index} className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <span className={card.color}>{card.icon}</span>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">{card.value}</h4>
              <span className="text-sm font-medium">{card.label}</span>
            </div>
          </div>
        </div>
      ))}
      
      <div className="col-span-full mt-4 rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="text-xl font-bold text-black dark:text-white mb-2">System Overview</h3>
        <p className="text-body">Welcome to the Child and Family Welfare Portal administrative panel. Use the sidebar to manage field operations and monitor system health.</p>
      </div>
    </div>
  );
};

export default AdminDashboardHome;