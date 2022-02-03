import React from 'react';
import { useAppSelector } from '../redux/store';
import LineChart from './LineChart';

const Charts = () => {
  const chartNames = useAppSelector((state) => state.modelConfig.chartNames);

  const data = useAppSelector((state) => state.agentsHistory);
  const metadata = useAppSelector((state) => state.modelConfig.chartsMetadata);
  const currTurn = useAppSelector((state) => state.currTurn);

  return (
    <div>
      {chartNames.map((name) => (
        <div
          className="ml-1"
          key={name}
        >
          {name}
          <LineChart
            xAccessor={metadata[name].xAccessor}
            yAccessor={metadata[name].yAccessor}
            data={data}
            curr={currTurn}
          />
        </div>
      ))}
    </div>
  );
};

export default Charts;
