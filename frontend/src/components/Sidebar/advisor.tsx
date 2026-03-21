import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BsSpeedometer2, 
  BsPersonPlus, 
  BsCalculator, 
  BsLayoutTextSidebarReverse 
} from 'react-icons/bs';

interface AdvisorSideBarProps {
  sidebarExpanded: boolean;
  setSidebarExpanded: (arg: boolean) => void;
}

const AdvisorSideBar = ({ sidebarExpanded, setSidebarExpanded }: AdvisorSideBarProps) => {
  const { pathname } = useLocation();

  return (
    <>
      {/* Dashboard */}
      <li>
        <NavLink
          to="/advisor/dashboard"
          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
            pathname === '/advisor/dashboard' && 'bg-graydark dark:bg-meta-4'
          }`}
        >
          <BsSpeedometer2 size={18} />
          Regional Overview
        </NavLink>
      </li>

      {/* Register New Child */}
      <li>
        <NavLink
          to="/advisor/register-child"
          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
            pathname.includes('register-child') && 'bg-graydark dark:bg-meta-4'
          }`}
        >
          <BsPersonPlus size={18} />
          Register Child
        </NavLink>
      </li>

      {/* Add Measurements */}
      <li>
        <NavLink
          to="/advisor/measurements"
          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
            pathname.includes('measurements') && 'bg-graydark dark:bg-meta-4'
          }`}
        >
          <BsCalculator size={18} />
          New Measurement
        </NavLink>
      </li>

      {/* Local Records */}
      <li>
        <NavLink
          to="/advisor/records"
          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
            pathname.includes('records') && 'bg-graydark dark:bg-meta-4'
          }`}
        >
          <BsLayoutTextSidebarReverse size={18} />
          My Sector Records
        </NavLink>
      </li>
    </>
  );
};

export default AdvisorSideBar;