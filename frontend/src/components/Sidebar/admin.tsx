import { NavLink, useLocation } from 'react-router-dom';
import { BsPersonCheck, BsChevronDown, BsPeople, BsHeartPulse, BsShieldLock } from 'react-icons/bs';
import SidebarLinkGroup from '../SidebarLinkGroup/index';
function AdminSideBar({ sidebarExpanded, setSidebarExpanded }: any) {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col gap-1.5">
      <SidebarLinkGroup activeCondition={pathname.includes('advisors')}>
        {(handleClick, open) => (
          <>
            <NavLink
              to="#"
              className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('advisors') && 'bg-graydark dark:bg-meta-4'}`}
              onClick={(e) => { e.preventDefault(); sidebarExpanded ? handleClick() : setSidebarExpanded(true); }}
            >
              <BsPersonCheck size={18} /> Advisors
              <BsChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 duration-200 ${open && 'rotate-180'}`} />
            </NavLink>
            <div className={`translate transform overflow-hidden ${!open && 'hidden'}`}>
              <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                <li><NavLink to="/admin/advisors/list" className="text-bodydark2 hover:text-white">Advisor List</NavLink></li>
              </ul>
            </div>
          </>
        )}
      </SidebarLinkGroup>

      <SidebarLinkGroup activeCondition={pathname.includes('families')}>
        {(handleClick, open) => (
          <>
            <NavLink
              to="#"
              className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('families') && 'bg-graydark dark:bg-meta-4'}`}
              onClick={(e) => { e.preventDefault(); sidebarExpanded ? handleClick() : setSidebarExpanded(true); }}
            >
              <BsPeople size={18} /> Families
              <BsChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 duration-200 ${open && 'rotate-180'}`} />
            </NavLink>
            <div className={`translate transform overflow-hidden ${!open && 'hidden'}`}>
              <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                <li><NavLink to="/admin/families/list" className="text-bodydark2 hover:text-white">Directory</NavLink></li>
              </ul>
            </div>
          </>
        )}
      </SidebarLinkGroup>

      <li>
        <NavLink to="/admin/audit-logs" className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('audit-logs') && 'bg-graydark dark:bg-meta-4'}`}>
          <BsShieldLock size={18} /> Audit Logs
        </NavLink>
      </li>
    </div>
  );
}

export default AdminSideBar;