import { Link } from 'react-router-dom';
import { BsList, BsPersonCircle } from 'react-icons/bs';

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* Hamburger Toggle BTN */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-meta-4 lg:hidden"
          >
            <BsList size={24} />
          </button>

          <Link className="block flex-shrink-0 lg:hidden" to="/">
            <span className="text-xl font-bold text-black dark:text-white">CFWP</span>
          </Link>
        </div>

        <div className="hidden sm:block">
          <h2 className="text-title-sm font-semibold text-black dark:text-white uppercase">
            Portal Management
          </h2>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          {/* User Area */}
          <div className="flex items-center gap-4">
            <span className="hidden text-right lg:block">
              <span className="block text-sm font-medium text-black dark:text-white">Admin User</span>
              <span className="block text-xs">System Administrator</span>
            </span>
            <BsPersonCircle size={24} className="text-bodydark2" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;