import { useState, useEffect } from 'react';

/**
 * 屏幕尺寸检测Hook
 * @param breakpoint 移动端断点，默认768px
 * @returns isMobile 是否为移动端
 */
const useScreenSize = (breakpoint: number = 768) => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    // 初始化
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoint]);
  
  return isMobile;
};

export default useScreenSize;