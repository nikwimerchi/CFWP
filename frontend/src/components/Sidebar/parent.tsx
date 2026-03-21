import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BsHeartPulse, 
  BsGraphUpArrow, 
  BsChatLeftDots, 
  BsPersonGear 
} from 'react-icons/bs';

interface ParentSideBarProps {
  sidebarExpanded: boolean;
  setSidebarExpanded: (arg: boolean) => void;
}

const ParentSideBar = ({ sidebarExpanded, setSidebarExpanded }: ParentSideBarProps) => {
  const { pathname } = useLocation();

  return (
    <>
      {/* My Children's Health */}
      <li>
        <NavLink
          to="/parent/dashboard"
          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
            pathname === '/parent/dashboard' && 'bg-graydark dark:bg-meta-4'
          }`}
        >
          <BsHeartPulse size={18} />
          Health Summary
        </NavLink>
      </li>

      {/* Growth Charts */}
      <li>
        <NavLink
          to="/parent/growth"
          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
            pathname.includes('growth') && 'bg-graydark dark:bg-meta-4'
          }`}
        >
          <BsGraphUpArrow size={18} />
          Growth Progress
        </NavLink>
      </li>

      {/* AI Wellness Assistant */}
      <li>
        <NavLink
          to="/parent/wellness-ai"
          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
            pathname.includes('wellness-ai') && 'bg-graydark dark:bg-meta-4'
          }`}
        >
          <BsChatLeftDots size={18} />
          AI Assistant
        </NavLink>
      </li>

      {/* Profile Settings */}
      <li>
        <NavLink
          to="/parent/settings"
          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
            pathname.includes('settings') && 'bg-graydark dark:bg-meta-4'
          }`}
        >
          <BsPersonGear size={18} />
          My Profile
        </NavLink>
      </li>
    </>
  );
};

export default ParentSideBar;