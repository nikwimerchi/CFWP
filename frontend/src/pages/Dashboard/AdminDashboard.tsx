import { Users, Baby, Activity, Database, ArrowUpRight } from 'lucide-react';

const AdminDashboardHome = () => {
  const stats = [
    { label: 'Profiles', value: '4', icon: Users, color: 'text-primary', bg: 'bg-primary/10', sub: 'Active accounts' },
    { label: 'Children', value: '0', icon: Baby, color: 'text-success', bg: 'bg-success/10', sub: 'Awaiting registration' },
    { label: 'Measurements', value: '0', icon: Activity, color: 'text-warning', bg: 'bg-warning/10', sub: 'Health logs' },
    { label: 'DB Size', value: '48 kB', icon: Database, color: 'text-danger', bg: 'bg-danger/10', sub: 'Current usage' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white">System Overview</h2>
          <p className="text-sm text-bodydark font-medium font-satoshi">Real-time stats from your Supabase instance.</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary py-2 px-4 text-white font-bold hover:bg-opacity-90 transition-all text-sm">
          Export DB Report <ArrowUpRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-xl border border-stroke bg-white p-6 shadow-sm dark:border-strokedark dark:bg-boxdark">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <div className="mt-4">
              <h4 className="text-2xl font-extrabold text-black dark:text-white">{stat.value}</h4>
              <p className="text-sm font-bold text-bodydark">{stat.label}</p>
              <p className="mt-1 text-xs text-bodydark/60 italic">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-8 rounded-xl border border-stroke bg-white p-6 dark:border-strokedark dark:bg-boxdark">
          <h3 className="font-bold text-black dark:text-white mb-6">Database Health</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['case_notes', 'chats', 'child_health_data', 'measurements', 'notifications', 'profiles'].map(table => (
              <div key={table} className="p-4 rounded-lg border border-stroke dark:border-strokedark bg-gray-50 dark:bg-meta-4 flex items-center justify-between">
                <span className="text-xs font-bold text-black dark:text-white truncate pr-2">{table}</span>
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" title="Connected"></div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="col-span-12 xl:col-span-4 rounded-xl border border-primary/20 bg-primary/5 p-6 dark:border-primary/30">
          <h3 className="font-bold text-primary mb-2">Admin Action Required</h3>
          <p className="text-sm text-bodydark leading-relaxed">
            Your <b>child_health_data</b> table is currently empty. Consider inviting parents to complete their child's profile to begin tracking measurements.
          </p>
          <button className="mt-6 w-full rounded-lg bg-primary py-3 font-bold text-white shadow-md hover:shadow-lg transition-all">
            Send Invite Emails
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;