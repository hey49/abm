import { Divider } from '@mui/material';
import React from 'react';
import { useAppSelector } from '../redux/store';

const Info = () => {
  const {
    currTurn,
    agentsHistory,
  } = useAppSelector((state) => state);

  const {
    world,
    agentNames,
  } = useAppSelector((state) => state.modelConfig);
  const { agents } = agentsHistory[currTurn];
  const getAgentCount = (
    name: string,
  ) => Object.values(agents).filter((agent) => agent.name === name).length;

  return (
    <div className="w-full h-32 text-xs flex">
      <div className="flex-1">
        World
        <hr />
        {`${world.name} `}
        <br />
        {`size: ${world.height} * ${world.width}`}
        <br />
        {`turn: ${currTurn}`}
      </div>
      <Divider orientation="vertical" flexItem />
      <div className="flex-1">
        Agent
        <hr />
        {agentNames.map((agent) => (
          <div key={agent}>
            {`${agent}: `}
            {`${getAgentCount(agent)}`}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Info;
