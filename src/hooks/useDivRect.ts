import React from 'react';
import { debounce } from '../utils';

type Rect = {
  width: number,
  height: number,
  top: number,
  left: number,
} | null;

const useDivRect = (ref: React.RefObject<HTMLDivElement>) => {
  const [divRect, setDivRect] = React.useState<Rect>(null);

  React.useEffect(() => {
    const handleResize = debounce(() => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setDivRect({
        width: rect.width,
        height: rect.height,
        left: rect.left,
        top: rect.top,
      });
    }, 100);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return divRect;
};

export default useDivRect;
