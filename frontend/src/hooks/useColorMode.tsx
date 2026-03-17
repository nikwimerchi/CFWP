import { useEffect, useState } from 'react';

const useColorMode = () => {
  const [colorMode, setColorMode] = useState(
    localStorage.getItem('color-theme') || 'light'
  );

  useEffect(() => {
    const className = 'dark';
    const bodyClass = window.document.documentElement.classList;

    colorMode === 'dark'
      ? bodyClass.add(className)
      : bodyClass.remove(className);

    localStorage.setItem('color-theme', colorMode);
  }, [colorMode]);

  return [colorMode, setColorMode] as const;
};

export default useColorMode;