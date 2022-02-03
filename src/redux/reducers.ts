/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createReducer, current } from '@reduxjs/toolkit';
import produce from 'immer';
import { InitState } from './state';
import * as actions from './actions';
import { presetModels } from './preset';
import { AgentsType, EditorSegState, EditorSegType } from './types';
import {
  createAgentContext, createAgentsContext, createChartContext, createWorldContext,
} from './api';

const createEmptySegStatus = (): EditorSegType => ({
  code: '',
  segState: EditorSegState.Default,
  errMsg: '',
});

const reducer = createReducer(
  InitState,
  (builder) => {
    builder
      .addCase(actions.selectCurrModel, (state, action) => {
        state.currModel = action.payload;
        state.modelConfig = presetModels[action.payload];
      })
      .addCase(actions.changeEditorSegState, (state, action) => {
        const {
          editor, module, seg, state: newState,
        } = action.payload;
        state.modelConfig.editors[editor][module][seg].segState = newState;
      })
      .addCase(actions.updateEditorSegCode, (state, action) => {
        const {
          editor, module, seg, code,
        } = action.payload;
        state.modelConfig.editors[editor][module][seg].code = code;
      })
      .addCase(actions.applyEditorSegCode, (state, action) => {
        const {
          editor, module, seg,
        } = action.payload;
        const {
          code,
        } = state.modelConfig.editors[editor][module][seg];
        try {
          // TODO: apply code
          const World = createWorldContext(
            state.modelConfig.world,
            state.lastCoord,
            state.coordHistory,
          );
          const Agent = createAgentsContext(
            module,
            state,
          );
          const Chart = createChartContext(
            module,
            state.modelConfig,
          );
          if (seg === 'setUp') {
            eval(code);
          } else if (editor === 'agents' && seg === 'action') {
            state.modelConfig.agentsMetadata[module].action = code;
          }
          state.modelConfig.editors[editor][module][seg].segState = EditorSegState.Applied;
        } catch (err: any) {
          state.modelConfig.editors[editor][module][seg].segState = EditorSegState.Error;
          state.modelConfig.editors[editor][module][seg].errMsg = err.message;
        }
      })
      .addCase(actions.addNewAgentType, (state, action) => {
        const name = action.payload;
        state.modelConfig.agentsMetadata[name] = {
          avatar: () => '',
          action: '',
          properties: {},
        };
        state.modelConfig.editors.agents[name] = {
          setUp: createEmptySegStatus(),
          action: createEmptySegStatus(),
        };
        state.modelConfig.agentNames.push(name);
      })
      .addCase(actions.deleteAgentType, (state, action) => {
        const idx = action.payload;
        const name = state.modelConfig.agentNames[idx];
        delete state.modelConfig.agentsMetadata[name];
        delete state.modelConfig.editors.agents[name];
        state.modelConfig.agentNames.splice(idx, 1);
      })
      .addCase(actions.moveAgentType, (state, action) => {
        const { drag, hover } = action.payload;
        const dragName = state.modelConfig.agentNames[drag];
        state.modelConfig.agentNames.splice(drag, 1);
        state.modelConfig.agentNames.splice(hover, 0, dragName);
      })
      .addCase(actions.addNewChartType, (state, action) => {
        const name = action.payload;
        state.modelConfig.chartNames.push(name);
        state.modelConfig.editors.charts[name] = {
          setUp: createEmptySegStatus(),
        };
        state.modelConfig.chartsMetadata[name] = {
          xAccessor: () => 0,
          yAccessor: () => 0,
        };
      })
      .addCase(actions.deleteChartType, (state, action) => {
        const idx = action.payload;
        const name = state.modelConfig.chartNames[idx];
        delete state.modelConfig.editors.charts[name];
        state.modelConfig.chartNames.splice(idx, 1);
      })
      .addCase(actions.moveChartType, (state, action) => {
        const { drag, hover } = action.payload;
        const dragName = state.modelConfig.chartNames[drag];
        state.modelConfig.chartNames.splice(drag, 1);
        state.modelConfig.chartNames.splice(hover, 0, dragName);
      })
      .addCase(actions.nextTurn, (state) => {
        if (state.currTurn < state.maxTurn) {
          state.currTurn += 1;
          return;
        }
        state.lastAgents = produce(
          state.lastAgents,
          (draft) => {
            Object.keys(draft.agents).forEach((id) => {
              // eslint-disable-next-line prefer-const
              let agent = {
                ...draft.agents[id],
                // eslint-disable-next-line max-len
                ...createAgentContext(id, state.modelConfig, state.agentsHistory, state.coordHistory, state.currTurn),
              };
              try {
                eval(state.modelConfig.agentsMetadata[agent.name].action);
                // eslint-disable-next-line no-param-reassign
                draft.agents[id] = agent;
              } catch (err) {
                console.log(err);
              }
            });
            draft.turn += 1;
          },
        );

        state.lastCoord = produce(
          state.lastCoord,
          (draft) => {
            draft.turn += 1;
          },
        );

        // state.lastCoord = state.lastCoord;
        state.coordHistory.push(state.lastCoord);
        state.agentsHistory.push(state.lastAgents);
        state.currTurn += 1;
        state.maxTurn += 1;
      })
      .addCase(actions.resetWorld, (state) => {
        state.coordHistory = [state.coordHistory[0]];
        state.agentsHistory = [state.agentsHistory[0]];
        state.currTurn = 0;
        state.maxTurn = 0;
      })
      .addCase(actions.jumpToTurn, (state, action) => {
        state.currTurn = action.payload;
      });
  },
);

export default reducer;
