import React from 'react';
import * as d3 from 'd3';
import useChartDimensions, { ChartDimensions } from '../hooks/useDimensions';

type AxisProps = {
  dms: ChartDimensions;
  dimension: 'x' | 'y';
  scale: any;
  format?: (d: any) => string;
};

const Axis = ({
  dms,
  dimension = 'x',
  scale,
  format = (d) => d,
}: AxisProps) => {
  const ticks = scale.ticks(4);

  const transform = {
    x: `translate(${dms.marginLeft}, ${dms.boundedHeight + dms.marginTop + 20})`,
    y: `translate(${dms.marginLeft - 10}, ${dms.marginTop})`,
  }[dimension];
  const transformLine = {
    x: 'translate(0, -20)',
    y: 'translate(10, 0)',
  }[dimension];

  // eslint-disable-next-line react/no-unstable-nested-components
  const AxisLine = () => (dimension === 'x' ? (
    <line x1={0} x2={dms.boundedWidth} transform={transformLine} stroke="#ccc" />
  ) : (
    <line y1={0} y2={dms.boundedHeight} transform={transformLine} stroke="#ccc" />
  ));

  const transformTick = (value: any) => ({
    x: `translate(${scale(value)}, 0)`,
    y: `translate(0, ${scale(value)})`,
  }[dimension]);

  return (
    <g
      transform={transform}
      style={{
        textAnchor: dimension === 'x' ? 'middle' : 'end',
        dominantBaseline: dimension === 'x' ? 'inherit' : 'middle',
      }}
    >
      <AxisLine />
      {ticks.map((value: any) => (
        <text key={value} transform={transformTick(value)} fontSize="10">
          { format(value) }
        </text>
      ))}
    </g>
  );
};

type LineType = {
  xAccessor: (d: any) => number;
  yAccessor: (d: any) => number;
  data: Array<any>;
}

const Line = ({
  xAccessor,
  yAccessor,
  data,
}: LineType) => {
  const path = d3.line()
    .x(xAccessor)
    .y(yAccessor)
    .curve(d3.curveMonotoneX)(data) as string;
  return (
    <path d={path} stroke="#3b82f6" strokeWidth="2" fill="none" />
  );
};

type LineChartProps = {
  xAccessor: (d: any) => number;
  yAccessor: (d: any) => number;
  data: Array<any>;
  curr: number;
};

const LineChart = ({
  xAccessor,
  yAccessor,
  data,
  curr,
}: LineChartProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const dms = useChartDimensions({
    marginTop: 20,
    marginLeft: 30,
  }, ref);

  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, xAccessor) as [number, number])
    .range([0, dms.boundedWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, yAccessor)] as [number, number])
    .range([dms.boundedHeight, 0]);

  // eslint-disable-next-line react/no-unstable-nested-components
  const CurrDataPoint = () => {
    const currX = xScale(xAccessor(data[curr]));
    const currY = yScale(yAccessor(data[curr]));
    return (
      <>
        <line x1={currX} x2={currX} y1={0} y2={dms.boundedHeight} stroke="#eee" />
        <g transform={`translate(${currX}, ${currY})`}>
          <circle cx={0} cy={0} r={3} fill="#f97316" />
          <text transform="translate(4, -4)" fontSize="10">{yAccessor(data[curr])}</text>
        </g>
      </>
    );
  };

  return (
    <div className="flex-1 h-44" ref={ref}>
      <svg width={dms.width} height={dms.height}>
        <g transform={`translate(${dms.marginLeft}, ${dms.marginTop})`}>
          <Line
            xAccessor={(d) => xScale(xAccessor(d))}
            yAccessor={(d) => yScale(yAccessor(d))}
            data={data}
          />
          <CurrDataPoint />
        </g>
        <Axis
          dimension="x"
          scale={xScale}
          dms={dms}
        />
        <Axis
          dimension="y"
          scale={yScale}
          dms={dms}
        />
      </svg>
    </div>
  );
};

export default LineChart;
