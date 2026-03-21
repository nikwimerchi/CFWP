import { useEffect, useState } from 'react';
import { BsPeople, BsPersonCheck, BsHeartPulse, BsShieldLock } from 'react-icons/bs';
import { supabase } from '../../utils/supabaseClient';
import RegistrationChart from '../../src/components/RegistrationChart';

// 1. Define types
interface ChartData {
  month: string;
  advisors: number;
  families: number;
  children: number;
}

interface RecentFamily {
  id: string;
  full_name: string;
  created_at: string;
  village: string;
}

const AdminDashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ advisors: 0, families: 0, children: 0, alerts: 0 });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [recentEntries, setRecentEntries] = useState<RecentFamily[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // FIX: Query the 'profiles' table with filters instead of non-existent 'advisors'/'families' tables
        const [advCount, famCount, childCount] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'advisor'),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'parent'),
          supabase.from('children').select('*', { count: 'exact', head: true }),
        ]);

        // Fetch recent parent registrations
        const { data: recent } = await supabase
          .from('profiles')
          .select('id, full_name, created_at, village')
          .eq('role', 'parent')
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          advisors: advCount.count || 0,
          families: famCount.count || 0,
          children: childCount.count || 0,
          alerts: 0,
        });

        // Set recent families list
        setRecentEntries((recent as RecentFamily[]) || []);
        
        // Temporary mock data for chart until you run the SQL function
        setChartData([
            { month: 'Jan', advisors: 1, families: 2, children: 5 },
            { month: 'Feb', advisors: 2, families: 4, children: 10 },
            { month: 'Mar', advisors: advCount.count || 0, families: famCount.count || 0, children: childCount.count || 0 }
        ]);
        
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Define Stat Cards logic
  const statCards = [
    { label: 'Total Advisors', value: stats.advisors, icon: <BsPersonCheck />, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Families', value: stats.families, icon: <BsPeople />, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Children Registered', value: stats.children, icon: <BsHeartPulse />, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'Alerts', value: stats.alerts, icon: <BsShieldLock />, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  ];

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
        {statCards.map((card, i) => (
          <div key={i} className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className={`flex h-11 w-11 items-center justify-center rounded-full ${card.bg} ${card.color}`}>
              {card.icon}
            </div>
            <div className="mt-4">
              <h4 className="text-2xl font-bold text-black dark:text-white">{card.value}</h4>
              <span className="text-sm font-medium text-gray-500">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-8">
          <RegistrationChart data={chartData} loading={loading} />
        </div>

        <div className="col-span-12 xl:col-span-4">
          <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 className="mb-4 text-xl font-bold text-black dark:text-white">Recent Families</h3>
            <div className="flex flex-col gap-4">
              {recentEntries.map((family) => (
                <div key={family.id} className="flex items-center justify-between border-b border-stroke pb-3 dark:border-strokedark last:border-0">
                  <div>
                    <h5 className="text-sm font-medium text-black dark:text-white">{family.full_name}</h5>
                    <p className="text-xs text-gray-500">{family.village || 'No Village'}</p>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(family.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;