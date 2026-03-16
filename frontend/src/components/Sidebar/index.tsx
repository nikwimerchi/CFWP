import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../../App'; // Go up to root App for Auth context
import AdminSideBar from './admin'; // Local import
import AdvisorSideBar from './advisor'; // Local import
import ParentSideBar from './parent'; // Local import

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const { user } = useAuth(); 

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [sidebarOpen]);

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'advisor') return '/advisor/statistics';
    return '/auth/signin';
  };

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to={getDashboardPath()}>
          <h1 className="text-white text-3xl font-bold tracking-wider">
            CWF<span className="text-blue-500">P</span>
          </h1>
        </NavLink>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2 uppercase">Main Menu</h3>
          <ul className="mb-6 flex flex-col gap-1.5">
            <li>
              <NavLink
                to={getDashboardPath()}
                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                  pathname === getDashboardPath() && 'bg-graydark dark:bg-meta-4'
                }`}
              >
                Dashboard
              </NavLink>
            </li>

            {/* Role-Based Components */}
            {user?.role === 'admin' && (
              <AdminSideBar sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded} />
            )}
            {user?.role === 'advisor' && (
              <AdvisorSideBar sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded} />
            )}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;