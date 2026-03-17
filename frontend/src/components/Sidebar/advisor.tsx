import { NavLink, useLocation } from 'react-router-dom';
import { BsPeople, BsClipboardData, BsChevronDown } from 'react-icons/bs';
import SidebarLinkGroup from '../SidebarLinkGroup';

function AdvisorSideBar({ sidebarExpanded, setSidebarExpanded }: any) {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col gap-1.5">
      <SidebarLinkGroup activeCondition={pathname.includes('children')}>
        {(handleClick, open) => (
          <>
            <NavLink
              to="#"
              className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('children') && 'bg-graydark dark:bg-meta-4'}`}
              onClick={(e) => { e.preventDefault(); sidebarExpanded ? handleClick() : setSidebarExpanded(true); }}
            >
              <BsPeople size={18} /> Children
              <BsChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 duration-200 ${open && 'rotate-180'}`} />
            </NavLink>
            <div className={`translate transform overflow-hidden ${!open && 'hidden'}`}>
              <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                <li><NavLink to="/advisor/children/list" className="text-bodydark2 hover:text-white">Children List</NavLink></li>
                <li><NavLink to="/advisor/children/new" className="text-bodydark2 hover:text-white">Register New</NavLink></li>
              </ul>
            </div>
          </>
        )}
      </SidebarLinkGroup>

      <li>
        <NavLink to="/advisor/measurements" className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('measurements') && 'bg-graydark dark:bg-meta-4'}`}>
          <BsClipboardData size={18} /> Health Logs
        </NavLink>
      </li>
    </div>
  );
}

export default AdvisorSideBar;