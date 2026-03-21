import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BsSpeedometer2, 
  BsPeople, 
  BsPersonBadge, 
  BsJournalCheck,
  BsShieldLock 
} from 'react-icons/bs';

interface AdminSideBarProps {
  sidebarExpanded: boolean;
  setSidebarExpanded: (arg: boolean) => void;
}

const AdminSideBar = ({ sidebarExpanded, setSidebarExpanded }: AdminSideBarProps) => {
  const { pathname } = useLocation();

  // Helper function to handle active class logic
  const activeClass = (path: string) => 
    pathname.includes(path) ? 'bg-graydark dark:bg-meta-4' : '';

  const navLinkStyle = "group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4";

  return (
    <>
      {/* Dashboard */}
      <li>
        <NavLink to="/admin/dashboard" className={`${navLinkStyle} ${activeClass('dashboard')}`}>
          <BsSpeedometer2 size={18} />
          Dashboard
        </NavLink>
      </li>

      {/* Advisors */}
      <li>
        <NavLink to="/admin/advisors/list" className={`${navLinkStyle} ${activeClass('advisors')}`}>
          <BsPersonBadge size={18} />
          Advisors
        </NavLink>
      </li>

      {/* Parents/Families */}
      <li>
        <NavLink to="/admin/parents/list" className={`${navLinkStyle} ${activeClass('parents')}`}>
          <BsPeople size={18} />
          Parents & Families
        </NavLink>
      </li>

      {/* Child Records */}
      <li>
        <NavLink to="/admin/children/records" className={`${navLinkStyle} ${activeClass('children')}`}>
          <BsJournalCheck size={18} />
          Child Records
        </NavLink>
      </li>

      {/* Audit Logs */}
      <li>
        <NavLink to="/admin/audit-logs" className={`${navLinkStyle} ${activeClass('audit-logs')}`}>
          <BsShieldLock size={18} />
          Audit Logs
        </NavLink>
      </li>
    </>
  );
};

export default AdminSideBar;