import React from 'react';

import dynamic from 'next/dynamic';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Divider, Input } from '@mui/material';
import {
  Add, Clear,
} from '@mui/icons-material';
import Button from '@mui/material/Button';
import {
  addNewChartType, applyEditorSegCode,
  changeEditorSegState, deleteChartType, moveChartType, updateEditorSegCode,
} from '../redux/actions';
import { useAppSelector, useAppDispatch } from '../redux/store';
import { cls } from '../utils';
import { EditorSegState } from '../redux/types';

const EditorSeg = dynamic(() => import('./EditorSeg'), { ssr: false });

type SingleChartEditorProps = {
  name: string;
  edWidth: number;
}
const SingleChartEditor = ({
  name,
  edWidth,
}: SingleChartEditorProps) => {
  const dispatch = useAppDispatch();
  const chartEditorStatus = useAppSelector((state) => state.modelConfig.editors.charts[name]);

  const onApplyCode = (seg: string) => {
    dispatch(applyEditorSegCode({
      editor: 'charts',
      module: name,
      seg,
    }));
  };

  const onChangeCode = (seg: string, newValue: string) => {
    dispatch(changeEditorSegState({
      editor: 'charts',
      module: name,
      seg,
      state: EditorSegState.Default,
    }));
    dispatch(updateEditorSegCode({
      editor: 'charts',
      module: name,
      seg,
      code: newValue,
    }));
  };

  return (
    <div className="overflow-scroll flex flex-col h-full">
      {
        Object.keys(chartEditorStatus).map((seg) => (
          <EditorSeg
            key={seg}
            edWidth={edWidth}
            seg={seg}
            code={chartEditorStatus[seg].code}
            segState={chartEditorStatus[seg].segState}
            errMsg={chartEditorStatus[seg].errMsg}
            onApplyCode={onApplyCode}
            onChangeCode={onChangeCode}
          />
        ))
      }
    </div>
  );
};

type ChartItemProps = {
  name: string,
  idx: number,
  selected: boolean,
  onSelectChart: (idx: number) => void,
  onMoveChart: (dragIdx: number, hoverIdx: number) => void,
};

type DragItem = {
  idx: number,
};

type XYCoord = {
  x: number,
  y: number,
};

const ChartItem = ({
  name,
  idx,
  selected,
  onSelectChart,
  onMoveChart,
}: ChartItemProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: 'chartItem',
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
      onMoveChart(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      // eslint-disable-next-line no-param-reassign
      item.idx = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'chartItem',
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
        onClick={() => onSelectChart(idx)}
        disableRipple
      >
        {name}
      </Button>
    </div>
  );
};

type ChartsEditorProps = {
  edWidth: number,
};

const ChartsEditor = ({
  edWidth,
}: ChartsEditorProps) => {
  const [isAdding, setIsAdding] = React.useState(false);
  const [selected, setSelected] = React.useState<number>(0);
  const chartNames = useAppSelector((state) => state.modelConfig.chartNames);
  const dispatch = useAppDispatch();

  const onInputFinished = (e: any) => {
    if (e.key === 'Enter' && !chartNames.includes(e.target.value)) {
      dispatch(addNewChartType(e.target.value));
      setIsAdding(false);
    }
  };

  const SingleChartEditors = chartNames.map((name) => (
    <SingleChartEditor key={name} name={name} edWidth={edWidth} />
  ));

  const deleteChartWithEditor = (idx: number) => {
    dispatch(deleteChartType(idx));
    setSelected(0);
    SingleChartEditors.splice(idx, 1);
  };

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <div className="flex w-full justify-between px-1">
          <div className="flex-1 flex overflow-scroll">
            {
              chartNames.map((chart, idx) => (
                <ChartItem
                  key={chart}
                  name={chart}
                  idx={idx}
                  selected={selected === idx}
                  onSelectChart={() => setSelected(idx)}
                  onMoveChart={(dragIdx, hoverIdx) => dispatch(
                    moveChartType({ drag: dragIdx, hover: hoverIdx }),
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
                  placeholder="New Chart"
                  onKeyUp={onInputFinished}
                  autoFocus
                />
              )
              : (
                <>
                  <Button
                    className="opacity-30 hover:opacity-100"
                    color="error"
                    disabled={chartNames.length === 0}
                    onClick={() => deleteChartWithEditor(selected)}
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
        chartNames.length > 0 && (
          SingleChartEditors[selected]
        )
      }
    </div>
  );
};

export default ChartsEditor;
