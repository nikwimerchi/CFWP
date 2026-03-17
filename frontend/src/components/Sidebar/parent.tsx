import { NavLink, useLocation } from 'react-router-dom';
import { BsPerson, BsBell } from 'react-icons/bs';

function ParentSideBar() {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col gap-1.5">
      <li>
        <NavLink to="/parent/my-children" className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('my-children') && 'bg-graydark dark:bg-meta-4'}`}>
          <BsPerson size={18} /> My Children
        </NavLink>
      </li>
      <li>
        <NavLink to="/parent/notifications" className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('notifications') && 'bg-graydark dark:bg-meta-4'}`}>
          <BsBell size={18} /> Notifications
        </NavLink>
      </li>
    </div>
  );
}

export default ParentSideBar;