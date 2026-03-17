import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsList, BsPersonCircle, BsBoxArrowRight, BsChevronDown, BsPerson } from 'react-icons/bs';
import { supabase } from '../../../utils/supabaseClient';
import DarkModeSwitcher from './DarkModeSwitcher';

const Header = (props: {
  sidebarOpen: boolean | string | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [dropdownOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth/signin');
  };

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        
        {/* Mobile Menu Toggle & Logo */}
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-meta-4 lg:hidden"
          >
            <BsList size={24} />
          </button>

          <Link className="block flex-shrink-0 lg:hidden" to="/">
            <span className="text-xl font-bold text-black dark:text-white uppercase">CFWP</span>
          </Link>
        </div>

        {/* Desktop Breadcrumb/Title */}
        <div className="hidden sm:block">
          <h2 className="text-title-sm font-semibold text-black dark:text-white uppercase tracking-wider">
            Admin Dashboard
          </h2>
        </div>

        {/* User Area, Theme Switcher & Dropdown */}
        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* Theme Toggler */}
            <DarkModeSwitcher />
          </ul>

          {/* User Dropdown */}
          <div className="relative">
            <button
              ref={trigger}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-4"
            >
              <span className="hidden text-right lg:block">
                <span className="block text-sm font-medium text-black dark:text-white">Admin</span>
                <span className="block text-xs">Administrator</span>
              </span>

              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-meta-4 flex items-center justify-center">
                <BsPersonCircle size={26} className="text-bodydark2" />
              </div>

              <BsChevronDown className={`hidden fill-current sm:block duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <div
              ref={dropdown}
              onFocus={() => setDropdownOpen(true)}
              onBlur={() => setDropdownOpen(false)}
              className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
                dropdownOpen === true ? 'block' : 'hidden'
              }`}
            >
              <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
                <li>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                  >
                    <BsPerson size={22} />
                    My Profile
                  </Link>
                </li>
              </ul>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3.5 py-4 px-6 text-sm font-medium duration-300 ease-in-out hover:text-red-500 lg:text-base"
              >
                <BsBoxArrowRight size={22} />
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;