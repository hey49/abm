/* eslint-disable no-param-reassign */
// create closure context and api for eval code in reducer

import { nanoid } from '@reduxjs/toolkit';
import {
  ABMState,
  AgentsType, CoordType, ModelConfigType, WorldType,
} from './types';

const allCoord = (width: number, height: number) => {
  const res = [];
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      res.push({
        x: i,
        y: j,
      });
    }
  }
  return res;
};

const shuffle = (array: any[]) => {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // eslint-disable-next-line no-param-reassign
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};

const rndCoords = (width: number, height: number) => shuffle(allCoord(width, height));

export type WorldApiType = {
  setName: (name: string) => void;
  setSize: (height: number, width: number) => void;
}

export const createWorldContext = (
  world: WorldType,
  lastCoord: CoordType,
  coordHistory: CoordType[],
) => {
  const worldApi: WorldApiType = {
    setName: (name: string) => {
      world.name = name;
    },
    setSize: (height: number, width: number) => {
      world.height = height;
      world.width = width;
      lastCoord = {
        turn: 0,
        coords: new Array(height).fill(0).map(
          () => new Array(width).fill(0).map(() => new Set<string>()),
        ),
      };
      coordHistory[0] = lastCoord;
    },
  };

  return worldApi;
};

// agents
export type AgentsApiType = {
  // setName: (newName: string) => void;
  setAvatar: (newAvatar: (cellWidth: number) => string) => void;
  fillInit: (parameters: () => any) => void;
  randomInit: (count: number, parameters: () => any) => void;
  coordInit: (coords: any, parameters: () => any) => void;
  coordSet: (coords: any, parameters: () => any) => void;
  addProperty: (key: string, val: any) => void;
}

export const createAgentsContext = (
  name: string,
  state: ABMState,
) => {
  const agentApi: AgentsApiType = {
    // setName: (newName: string) => {
    //   if (newName === name) {
    //     return;
    //   }
    //   Object.values(agentsHistory[0]).forEach((agent) => {
    //     if (agent.name === name) {
    //       agent.name = newName;
    //     }
    //   });
    //   modelConfig.agentsMetadata[newName] = modelConfig.agentsMetadata[name];
    //   delete modelConfig.agentsMetadata[name];
    //   const index = modelConfig.agentNames.indexOf(name);
    //   modelConfig.agentNames[index] = newName;
    // },
    setAvatar: (newAvatar: (cellWidth: number) => string) => {
      state.modelConfig.agentsMetadata[name].avatar = newAvatar;
    },
    fillInit: (parameters: any) => {
      if (state.coordHistory.length === 0) {
        throw new Error('please setup world first');
      }
      state.currTurn = 0;
      state.maxTurn = 0;
      // clear before
      state.coordHistory[0].coords = state.coordHistory[0].coords.map((row) => row.map((
        cell,
      ) => {
        const newArr = Array.from(cell).filter(
          (id) => state.agentsHistory[0].agents[id].name !== name,
        );
        return new Set(newArr);
      }));
      // eslint-disable-next-line prefer-destructuring
      state.lastCoord = state.coordHistory[0];
      const newLastAgents: AgentsType = {
        turn: 0,
        agents: {},
      };
      Object.keys(state.agentsHistory[0].agents).forEach((id) => {
        if (state.agentsHistory[0].agents[id].name !== name) {
          newLastAgents.agents[id] = state.agentsHistory[0].agents[id];
        }
      });
      state.lastAgents = newLastAgents;
      const coords = allCoord(state.modelConfig.world.width, state.modelConfig.world.height);
      coords.forEach((coord) => {
        const id = nanoid();
        state.lastCoord.coords[coord.y][coord.x].add(id);
        state.lastAgents.agents[id] = {
          ...{
            name,
            id,
            x: coord.x,
            y: coord.y,
          },
          ...state.modelConfig.agentsMetadata[name].properties,
          ...parameters(),
        };
      });
      state.coordHistory = [state.lastCoord];
      state.agentsHistory = [state.lastAgents];
    },
    randomInit: (count: number, parameters: any) => {
      if (state.coordHistory.length === 0) {
        throw new Error('please setup world first');
      }
      state.currTurn = 0;
      state.maxTurn = 0;
      // clear before
      state.coordHistory[0].coords = state.coordHistory[0].coords.map((row) => row.map((
        cell,
      ) => {
        const newArr = Array.from(cell).filter(
          (id) => state.agentsHistory[0].agents[id].name !== name,
        );
        return new Set(newArr);
      }));
      // eslint-disable-next-line prefer-destructuring
      state.lastCoord = state.coordHistory[0];
      const newLastAgents: AgentsType = {
        turn: 0,
        agents: {},
      };
      Object.keys(state.agentsHistory[0].agents).forEach((id) => {
        if (state.agentsHistory[0].agents[id].name !== name) {
          newLastAgents.agents[id] = state.agentsHistory[0].agents[id];
        }
      });
      state.lastAgents = newLastAgents;
      const coords = rndCoords(state.modelConfig.world.width, state.modelConfig.world.height);
      for (let i = 0; i < count; i++) {
        const coord = coords[i];
        const id = nanoid();
        state.lastCoord.coords[coord.y][coord.x].add(id);
        state.lastAgents.agents[id] = {
          ...{
            name,
            id,
            x: coord.x,
            y: coord.y,
          },
          ...state.modelConfig.agentsMetadata[name].properties,
          ...parameters(),
        };
      }
      state.coordHistory = [state.lastCoord];
      state.agentsHistory = [state.lastAgents];
    },
    coordInit: (coords: any, parameters: any) => {
      if (state.coordHistory.length === 0) {
        throw new Error('please setup world first');
      }
      state.currTurn = 0;
      state.maxTurn = 0;
      // clear before
      state.coordHistory[0].coords = state.coordHistory[0].coords.map((row) => row.map((
        cell,
      ) => {
        const newArr = Array.from(cell).filter(
          (id) => state.agentsHistory[0].agents[id].name !== name,
        );
        return new Set(newArr);
      }));
      // eslint-disable-next-line prefer-destructuring
      state.lastCoord = state.coordHistory[0];
      const newLastAgents: AgentsType = {
        turn: 0,
        agents: {},
      };
      Object.keys(state.agentsHistory[0].agents).forEach((id) => {
        if (state.agentsHistory[0].agents[id].name !== name) {
          newLastAgents.agents[id] = state.agentsHistory[0].agents[id];
        }
      });
      state.lastAgents = newLastAgents;
      coords.forEach((coord: any) => {
        const id = nanoid();
        const [x, y] = coord;
        state.lastCoord.coords[y][x].add(id);
        state.lastAgents.agents[id] = {
          ...{
            name,
            id,
            x,
            y,
          },
          ...state.modelConfig.agentsMetadata[name].properties,
          ...parameters(),
        };
      });
      state.coordHistory = [state.lastCoord];
      state.agentsHistory = [state.lastAgents];
    },
    coordSet: (coords: any, parameters: any) => {
      if (state.coordHistory.length === 0) {
        throw new Error('please setup world first');
      }
      coords.forEach((coord: any) => {
        const [x, y] = coord;
        const agentIds = Array.from(state.lastCoord.coords[y][x]);
        agentIds.forEach((id) => {
          if (state.lastAgents.agents[id].name === name) {
            state.lastAgents.agents[id] = {
              ...state.lastAgents.agents[id],
              ...parameters(),
            };
          }
        });
      });
    },
    addProperty: (key: string, value: any) => {
      state.maxTurn = state.currTurn;
      state.agentsHistory = state.agentsHistory.splice(0, state.currTurn + 1);
      state.lastAgents = state.agentsHistory[state.agentsHistory.length - 1];
      Object.values(state.lastAgents.agents).forEach((agent) => {
        if (agent.name === name) {
          agent[key] = value;
        }
      });
      state.modelConfig.agentsMetadata[name].properties[key] = value;
      state.agentsHistory[state.agentsHistory.length - 1] = state.lastAgents;
    },

  };

  return agentApi;
};

// single agent
export type AgentApiType = {
  getNeighbors: (r: number) => Array<any>;
}

export const createAgentContext = (
  id: string,
  modelConfig: ModelConfigType,
  agentsHistory: AgentsType[],
  coordHistory: CoordType[],
  currTurn: number,
) => {
  const agentApi: AgentApiType = {
    getNeighbors: (r: number) => {
      const { x, y } = agentsHistory[currTurn].agents[id];
      const res: Array<any> = [];
      for (let i = x - r; i <= x + r; i++) {
        for (let j = y - r; j <= y + r; j++) {
          if (i < 0
            || i >= modelConfig.world.width
            || j < 0 || j >= modelConfig.world.height
            || (i === x && j === y)
          ) continue;
          Array.from(coordHistory[currTurn].coords[j][i]).forEach((_id) => {
            res.push(_id);
          });
        }
      }
      return res.map((_id) => agentsHistory[currTurn].agents[_id]);
    },
  };

  return agentApi;
};

export type ChartApiType = {
  setXAccessor: (xAccessor: any) => void;
  setYAccessor: (yAccessor: any) => void;
}

export const createChartContext = (
  name: string,
  modelConfig: ModelConfigType,
) => {
  const chartApi: ChartApiType = {
    setXAccessor: (xAccessor: any) => {
      modelConfig.chartsMetadata[name].xAccessor = xAccessor;
    },
    setYAccessor: (yAccessor: any) => {
      modelConfig.chartsMetadata[name].yAccessor = yAccessor;
    },
  };

  return chartApi;
};
