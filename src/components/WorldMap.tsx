/* eslint-disable react/no-array-index-key */
import React from 'react';
import parse from 'html-react-parser';
import { useAppSelector } from '../redux/store';
import useChartDimensions from '../hooks/useDimensions';

const WorldMap = () => {
  const {
    currTurn,
    coordHistory,
    agentsHistory,
  } = useAppSelector((state) => state);

  const {
    agentsMetadata,
    world,
  } = useAppSelector((state) => state.modelConfig);

  const { agents } = agentsHistory[currTurn];

  const ref = React.useRef<HTMLDivElement>(null);

  const dms = useChartDimensions({
    marginTop: 10,
    marginLeft: 10,
  }, ref);

  const cellLen = Math.floor(
    Math.min(dms.boundedHeight / world.height, dms.boundedWidth / world.width),
  );

  const renderCell = (cellData: Set<string>) => (
    <>
      { Array.from(cellData).map((id) => (
        parse(agentsMetadata[agents[id].name].avatar(cellLen, agents[id]))
      ))}
    </>
  );
  return (
    <div className="flex-1" ref={ref}>
      <svg width={dms.width} height={dms.height}>
        <g transform={`translate(${dms.marginLeft}, ${dms.marginTop})`}>
          {
            coordHistory.length > 0 && (
              coordHistory[currTurn].coords.map((row, i) => (
                <g key={`row${i}`} transform={`translate(0, ${i * cellLen})`}>
                  {
                  row.map((cellData, j) => (
                    <g
                      key={`${i}-${j}`}
                      transform={`translate(${j * cellLen}, 0)`}
                      width={cellLen}
                      height={cellLen}
                    >
                      <rect width={cellLen} height={cellLen} fill="white" />
                      {renderCell(cellData)}
                    </g>
                  ))
                }
                </g>
              ))
            )
          }
        </g>
      </svg>
    </div>
  );
};

export default WorldMap;
