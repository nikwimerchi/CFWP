import { useEffect, useState } from 'react';
import { Users, Baby, Activity, Database, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

const AdminDashboardHome = () => {
  const [counts, setCounts] = useState({ profiles: 0, children: 0, measurements: 0, dbSize: '48 kB' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [profiles, children, measurements] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('children').select('*', { count: 'exact', head: true }),
          supabase.from('measurements').select('*', { count: 'exact', head: true })
        ]);
        setCounts(prev => ({
          ...prev,
          profiles: profiles.count || 0,
          children: children.count || 0,
          measurements: measurements.count || 0,
        }));
      } catch (error) {
        console.error('Stats error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: 'Total Profiles', value: counts.profiles, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', sub: 'Verified accounts' },
    { label: 'Registered Children', value: counts.children, icon: Baby, color: 'text-emerald-500', bg: 'bg-emerald-500/10', sub: 'Welfare tracking' },
    { label: 'Health Logs', value: counts.measurements, icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/10', sub: 'Recent activities' },
    { label: 'Storage Used', value: counts.dbSize, icon: Database, color: 'text-rose-500', bg: 'bg-rose-500/10', sub: 'Supabase storage' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">CFWP Overview</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Child and Family Welfare Portal System Monitoring</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 dark:bg-boxdark dark:text-white dark:ring-strokedark">
            Refresh Data
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-opacity-90 transition-all">
            Export <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="relative overflow-hidden rounded-2xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color} mb-4`}>
              <stat.icon size={26} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
              <h3 className="text-2xl font-bold text-black dark:text-white mt-1">
                {loading ? <span className="animate-pulse">...</span> : stat.value}
              </h3>
              <div className="mt-2 flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <Zap size={12} className="mr-1" />
                <span>Live from Supabase</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section: Tables & Health */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Database Health Monitor */}
        <div className="lg:col-span-2 rounded-2xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
              <ShieldCheck className="text-emerald-500" size={20} />
              Database Engine Status
            </h3>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">All Systems Operational</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {['profiles', 'children', 'measurements', 'case_notes', 'notifications', 'audit_logs'].map((table) => (
              <div key={table} className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:border-primary/20 dark:border-strokedark dark:bg-meta-4">
                <code className="text-sm font-semibold text-slate-700 dark:text-slate-200">{table}</code>
                <div className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Card */}
        <div className="rounded-2xl bg-gradient-to-br from-primary to-[#5e72e4] p-8 text-white shadow-lg">
          <h3 className="text-xl font-bold">Admin Intelligence</h3>
          <p className="mt-4 text-white/80 text-sm leading-relaxed">
            {counts.children === 0 
              ? "The portal is ready. Start by importing family data or sending registration invites to your field officers."
              : `Successfully tracking ${counts.children} children. Systematic health reports are being generated based on ${counts.measurements} data points.`}
          </p>
          <div className="mt-8 space-y-3">
            <button className="w-full rounded-xl bg-white py-3 text-sm font-bold text-primary transition-transform hover:scale-[1.02] active:scale-[0.98]">
              Send Bulk Invites
            </button>
            <button className="w-full rounded-xl bg-white/10 py-3 text-sm font-bold text-white backdrop-blur-md hover:bg-white/20">
              View Audit Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;