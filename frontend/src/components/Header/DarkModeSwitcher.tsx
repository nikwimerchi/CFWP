import { BsSun, BsMoon } from 'react-icons/bs';
import useColorMode from '../../hooks/useColorMode';

const DarkModeSwitcher = () => {
  const [colorMode, setColorMode] = useColorMode();

  return (
    <li>
      <button
        onClick={() => setColorMode(colorMode === 'light' ? 'dark' : 'light')}
        className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
      >
        <span className="dark:hidden">
          <BsMoon size={18} />
        </span>
        <span className="hidden dark:inline">
          <BsSun size={18} />
        </span>
      </button>
    </li>
  );
};

export default DarkModeSwitcher;