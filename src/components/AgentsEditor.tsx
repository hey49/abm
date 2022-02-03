/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React from 'react';

import dynamic from 'next/dynamic';

import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Divider, Input } from '@mui/material';
import {
  Add, Clear,
} from '@mui/icons-material';
import Button from '@mui/material/Button';
import { useAppSelector, useAppDispatch } from '../redux/store';
import { cls } from '../utils';
import {
  addNewAgentType, deleteAgentType,
  applyEditorSegCode, changeEditorSegState, updateEditorSegCode, moveAgentType,
} from '../redux/actions';
import { EditorSegState } from '../redux/types';

const EditorSeg = dynamic(() => import('./EditorSeg'), { ssr: false });

type SingleAgentEditorProps = {
  name: string;
  edWidth: number;
}

const SingleAgentEditor = ({
  name,
  edWidth,
}: SingleAgentEditorProps) => {
  const dispatch = useAppDispatch();
  const agentEditorStatus = useAppSelector((state) => state.modelConfig.editors.agents[name]);

  const onApplyCode = (seg: string) => {
    dispatch(applyEditorSegCode({
      editor: 'agents',
      module: name,
      seg,
    }));
  };

  const onChangeCode = (seg: string, newValue: string) => {
    dispatch(changeEditorSegState({
      editor: 'agents',
      module: name,
      seg,
      state: EditorSegState.Default,
    }));
    dispatch(updateEditorSegCode({
      editor: 'agents',
      module: name,
      seg,
      code: newValue,
    }));
  };

  return (
    <div className="overflow-scroll flex flex-col h-full">
      {
        Object.keys(agentEditorStatus).map((seg) => (
          <EditorSeg
            key={seg}
            edWidth={edWidth}
            seg={seg}
            code={agentEditorStatus[seg].code}
            segState={agentEditorStatus[seg].segState}
            errMsg={agentEditorStatus[seg].errMsg}
            onApplyCode={onApplyCode}
            onChangeCode={onChangeCode}
          />
        ))
      }
    </div>
  );
};

type AgentItemProps = {
  name: string,
  idx: number,
  selected: boolean,
  onSelectAgent: (idx: number) => void,
  onMoveAgent: (dragIdx: number, hoverIdx: number) => void,
};

type DragItem = {
  idx: number,
};

type XYCoord = {
  x: number,
  y: number,
};

const AgentItem = ({
  name,
  idx,
  selected,
  onSelectAgent,
  onMoveAgent,
}: AgentItemProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: 'agentItem',
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.idx;
      const hoverIndex = idx;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }

      // Time to actually perform the action
      onMoveAgent(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      // eslint-disable-next-line no-param-reassign
      item.idx = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'agentItem',
    item: (): DragItem => ({ idx }),
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));
  return (
    <div
      className={cls(
        selected && 'text-blue-500 border-b-2 border-blue-500',
        isDragging && 'opacity-50',
      )}
      ref={ref}

    >
      <Button
        color="normal"
        onClick={() => onSelectAgent(idx)}
        disableRipple
      >
        {name}
      </Button>
    </div>
  );
};

type AgentEditorProps = {
  edWidth: number,
};

const AgentsEditor = ({
  edWidth,
}: AgentEditorProps) => {
  const [isAdding, setIsAdding] = React.useState(false);
  const [selected, setSelected] = React.useState<number>(0);
  const agentNames = useAppSelector((state) => state.modelConfig.agentNames);

  const dispatch = useAppDispatch();

  const onInputFinished = (e: any) => {
    if (e.key === 'Enter' && !agentNames.includes(e.target.value)) {
      dispatch(addNewAgentType(e.target.value));
      setIsAdding(false);
    }
  };

  const SingleAgentEditors = agentNames.map((name) => (
    <SingleAgentEditor key={name} name={name} edWidth={edWidth} />
  ));

  const deleteAgentWithEditor = (idx: number) => {
    dispatch(deleteAgentType(idx));
    setSelected(0);
    SingleAgentEditors.splice(idx, 1);
  };

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <div className="flex w-full justify-between px-1">
          <div className="flex-1 flex overflow-scroll">
            {
              agentNames.map((agent, idx) => (
                <AgentItem
                  key={agent}
                  name={agent}
                  idx={idx}
                  selected={selected === idx}
                  onSelectAgent={() => setSelected(idx)}
                  onMoveAgent={(dragIdx, hoverIdx) => dispatch(
                    moveAgentType({ drag: dragIdx, hover: hoverIdx }),
                  )}
                />
              ))
            }
          </div>
          <div className="flex-none flex">
            {
            isAdding
              ? (
                <Input
                  onBlur={() => setIsAdding(false)}
                  placeholder="New Agent"
                  onKeyUp={onInputFinished}
                  autoFocus
                />
              )
              : (
                <>
                  <Button
                    className="opacity-30 hover:opacity-100"
                    color="error"
                    disabled={agentNames.length === 0}
                    onClick={() => deleteAgentWithEditor(selected)}
                    disableRipple
                  >
                    <Clear />
                  </Button>
                  <Button onClick={() => setIsAdding(true)} disableRipple><Add /></Button>
                </>
              )
            }
          </div>
        </div>
      </DndProvider>
      <Divider />
      {
        agentNames.length > 0 && (
          SingleAgentEditors[selected]
        )
      }
    </div>
  );
};

export default AgentsEditor;
