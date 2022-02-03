export type WorldType = {
  name: string;
  height: number;
  width: number;
};

export type AgentType = {
  name: string;
  id: string;
} & {[key: string]: any};

// id -> agent
export type AgentsType = {
  turn: number;
  agents: {[key: string]: AgentType}
};

export type AgentMetadataType = {
  avatar: (cellWidth: number, agent: any) => string;
  action: string,
  properties: {[key: string]: any},
};

// name -> agent metadata
export type AgentsMetadataType = {[key: string]: AgentMetadataType};

export type ChartMetadataType = {
  xAccessor: (d: any) => number,
  yAccessor: (d: any) => number,
}

export type ChartsMetadataType = {[key: string]: ChartMetadataType};

export type CoordType = {
  turn: number;
  coords: Set<string>[][];
};

export const enum EditorSegState {
  Default = 0,
  Applied = 1,
  Error = 2,
}

export type EditorSegType = {
  code: string;
  segState: EditorSegState;
  errMsg: string;
};

export type EditorType = {[key: string]: EditorSegType};

export type WorldEditorType = {[key: string]: EditorType};

export type AgentsEditorType = {[key: string]: EditorType};

export type ChartsEditorType = {[key: string]: EditorType};

export type ModelConfigType = {
  world: WorldType;
  agentsMetadata: AgentsMetadataType;
  agentNames: string[];
  chartsMetadata: ChartsMetadataType;
  chartNames: string[];
  editors: {
    world: WorldEditorType;
    agents: AgentsEditorType;
    charts: ChartsEditorType;
  }
};

export type ABMState = {
  models: string[];
  currModel: string;
  currTurn: number;
  maxTurn: number;
  lastCoord: CoordType;
  coordHistory: CoordType[];
  lastAgents: AgentsType;
  agentsHistory: AgentsType[];
  modelConfig: ModelConfigType
};
