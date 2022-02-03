import { useEffect, RefObject, useState } from 'react';
import { debounce } from '../utils';

export type ChartDimensions = {
  width: number;
  height: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  boundedHeight: number;
  boundedWidth: number;
};

const combineChartDimensions = (dimensions: any) => {
  const parsedDimensions = {
    marginTop: 40,
    marginRight: 30,
    marginBottom: 40,
    marginLeft: 75,
    ...dimensions,
  };

  return {
    ...parsedDimensions,
    boundedHeight: Math.max(
      parsedDimensions.height
        - parsedDimensions.marginTop
        - parsedDimensions.marginBottom,
      0,
    ),
    boundedWidth: Math.max(
      parsedDimensions.width
        - parsedDimensions.marginLeft
        - parsedDimensions.marginRight,
      0,
    ),
  } as ChartDimensions;
};

const useChartDimensions = (passedSettings: any, ref: RefObject<HTMLDivElement>) => {
  const dimensions = combineChartDimensions(passedSettings);

  const [width, changeWidth] = useState(0);
  const [height, changeHeight] = useState(0);

  useEffect(() => {
    if (dimensions.width && dimensions.height) return;

    const handleResize = debounce(() => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      changeWidth(rect.width);
      changeHeight(rect.height);
    }, 100);
    window.addEventListener('resize', handleResize);
    handleResize();
    // eslint-disable-next-line consistent-return
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const newSettings: ChartDimensions = combineChartDimensions({
    ...dimensions,
    width,
    height,
  });

  return newSettings;
};

export default useChartDimensions;
