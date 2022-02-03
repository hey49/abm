/* eslint-disable quote-props */

import { EditorSegState, ModelConfigType } from './types';

const GameOfLifeModel: ModelConfigType = {
  world: {
    name: 'Game Of Life',
    height: 0,
    width: 0,
  },

  agentsMetadata: {
    cell: {
      avatar: () => '',
      action: '',
      properties: {},
    },
  },
  agentNames: ['cell'],
  chartsMetadata: {
    alive_count: {
      xAccessor: () => 0,
      yAccessor: () => 0,
    },
  },
  chartNames: ['alive_count'],

  editors: {
    world: {
      world: {
        setUp: {
          code: `// Setup world 
World.setSize(10, 10);
`,
          segState: EditorSegState.Default,
          errMsg: '',
        },
      },
    },
    agents: {
      cell: {
        setUp: {
          code: `// Setup agent
Agent.addProperty('state', 'alive');
Agent.setAvatar(
  (cellLen, agent) =>
  agent.state == 'alive' 
  ? \`<text key="$\{agent.id}" y="$\{cellLen*0.8}" font-size="$\{cellLen*0.9}">🐶</text>\`
  : '',
);
// Agent.randomInit(5);
// Agent.fillInit(() => ({state: Math.random() < 0.5 ? 'alive' : 'dead'}));
// Agent.coordInit(
//   [[5, 3], [5, 4], [5, 5], [4, 4], [6, 4]],
//   () => ({state: 'alive'}));
Agent.fillInit(() => ({state: 'dead'}));
Agent.coordSet(
  [[5, 3], [5, 4], [5, 5], [4, 4], [6, 4]],
  () => ({state: 'alive'}),
);
`,
          segState: EditorSegState.Default,
          errMsg: '',
        },
        action: {
          code: `// Action
// agent.state = Math.random() < 0.5 ? 'alive' : 'dead';
const aliveNeighbors = agent.getNeighbors(1).filter(neighbor => neighbor.state == 'alive').length;

if (aliveNeighbors < 2 || aliveNeighbors > 3) {
  agent.state = 'dead';
} else if (aliveNeighbors == 3) {
  agent.state = 'alive';
}
`,
          segState: EditorSegState.Default,
          errMsg: '',
        },
      },
    },
    charts: {
      alive_count: {
        setUp: {
          code: `// Setup world 
Chart.setXAccessor((d) => d.turn);
Chart.setYAccessor((d) => Object.values(d.agents).filter(agent => agent.state == 'alive').length);
`,
          segState: EditorSegState.Default,
          errMsg: '',
        },
      },
    },
  },
};

const EmptyModel: ModelConfigType = {
  world: {
    name: 'EMPTY',
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
};

export const presetModels: {[key: string]: ModelConfigType} = {
  'GAME OF LIFE': GameOfLifeModel,
  'EMPTY': EmptyModel,
};
