import { createAction } from '@reduxjs/toolkit';
import { EditorSegState } from './types';

export const createContext = createAction('createContext');

export const selectCurrModel = createAction<string>('selectCurrModel');

export const changeEditorSegState = createAction<{
  editor: 'world' | 'agents' | 'charts',
  module: string,
  seg: string,
  state: EditorSegState,
}>('changeEditorSegState');

export const updateEditorSegCode = createAction<{
  editor: 'world' | 'agents' | 'charts',
  module: string,
  seg: string,
  code: string,
}>('updateEditorSegCode');

export const applyEditorSegCode = createAction<{
  editor: 'world' | 'agents' | 'charts',
  module: string,
  seg: string,
}>('applyEditorSegCode');

export const addNewAgentType = createAction<string>('addNewAgentType');

export const deleteAgentType = createAction<number>('deleteAgentType');

export const moveAgentType = createAction<{
  drag: number,
  hover: number,
}>('moveAgentType');

export const addNewChartType = createAction<string>('addNewChartType');

export const deleteChartType = createAction<number>('deleteChartType');

export const moveChartType = createAction<{
  drag: number,
  hover: number,
}>('moveChartType');

export const nextTurn = createAction('nextTurn');

export const resetWorld = createAction('resetWorld');

export const jumpToTurn = createAction<number>('jumpToTurn');
