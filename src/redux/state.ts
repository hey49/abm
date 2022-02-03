import { presetModels } from './preset';
import { ABMState } from './types';

export const InitState = (): ABMState => ({
  models: ['GAME OF LIFE', 'EMPTY'],
  currModel: 'GAME OF LIFE',
  currTurn: 0,
  maxTurn: 0,
  lastCoord: {
    turn: 0,
    coords: [],
  },
  coordHistory: [],
  lastAgents: {
    turn: 0,
    agents: {},
  },
  agentsHistory: [{
    turn: 0,
    agents: {},
  }],

  // eslint-disable-next-line dot-notation
  modelConfig: presetModels['GAME OF LIFE'] || {
    world: {
      name: '',
      height: 0,
      width: 0,
    },

    agentsMetadata: {},
    agentNames: [],
    chartsMetadata: {},
    chartNames: [],

    editors: {
      world: {},
      agents: {},
      charts: {},
    },
  },
});
