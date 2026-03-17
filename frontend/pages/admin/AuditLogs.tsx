import { useEffect, useState } from 'react';
import { BsShieldShaded, BsClockHistory } from 'react-icons/bs';
import { supabase } from '../../utils/supabaseClient';

const AuditLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false });
      if (!error) setLogs(data);
      setLoading(false);
    };
    fetchLogs();
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="mb-6">
        <h4 className="text-xl font-semibold text-black dark:text-white flex items-center gap-2">
          <BsShieldShaded className="text-primary" /> System Audit Logs
        </h4>
        <p className="text-sm dark:text-bodydark">Track administrative actions and data modifications.</p>
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-4 rounded-sm bg-gray-2 dark:bg-meta-4">
          <div className="p-2.5 xl:p-5"><p className="text-sm font-bold uppercase text-black dark:text-white">Timestamp</p></div>
          <div className="p-2.5 text-center xl:p-5"><p className="text-sm font-bold uppercase text-black dark:text-white">User</p></div>
          <div className="p-2.5 text-center xl:p-5"><p className="text-sm font-bold uppercase text-black dark:text-white">Action</p></div>
          <div className="p-2.5 text-center xl:p-5"><p className="text-sm font-bold uppercase text-black dark:text-white">Entity</p></div>
        </div>

        {loading ? (
          <div className="p-10 text-center dark:text-white animate-pulse">Retrieving logs...</div>
        ) : (
          logs.map((log) => (
            <div className="grid grid-cols-4 border-b border-stroke dark:border-strokedark" key={log.id}>
              <div className="flex items-center gap-2 p-2.5 xl:p-5">
                <BsClockHistory className="text-bodydark2" />
                <p className="text-xs text-black dark:text-white">{new Date(log.created_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-sm text-black dark:text-white font-medium">{log.performed_by}</p>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${log.action === 'DELETE' ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
                  {log.action}
                </span>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5"><p className="text-black dark:text-white">{log.entity_type}</p></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AuditLogs;