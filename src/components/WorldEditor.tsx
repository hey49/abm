import React from 'react';
import dynamic from 'next/dynamic';
import { useAppSelector, useAppDispatch } from '../redux/store';
import { applyEditorSegCode, changeEditorSegState, updateEditorSegCode } from '../redux/actions';
import { EditorSegState } from '../redux/types';

const EditorSeg = dynamic(() => import('./EditorSeg'), { ssr: false });

type WorldEditorProps = {
  edWidth: number,
};

const WorldEditor = ({
  edWidth,
}: WorldEditorProps) => {
  const worldEditorStatus = useAppSelector((state) => state.modelConfig.editors.world);

  const dispatch = useAppDispatch();

  const onApplyCode = (seg: string) => {
    dispatch(applyEditorSegCode({
      editor: 'world',
      module: 'world',
      seg,
    }));
  };

  const onChangeCode = (seg: string, newValue: string) => {
    dispatch(changeEditorSegState({
      editor: 'world',
      module: 'world',
      seg,
      state: EditorSegState.Default,
    }));
    dispatch(updateEditorSegCode({
      editor: 'world',
      module: 'world',
      seg,
      code: newValue,
    }));
  };

  return (
    <div className="overflow-scroll flex flex-col h-full">
      {
        Object.keys(worldEditorStatus.world).map((seg) => (
          <EditorSeg
            key={seg}
            edWidth={edWidth}
            seg={seg}
            code={worldEditorStatus.world[seg].code}
            segState={worldEditorStatus.world[seg].segState}
            errMsg={worldEditorStatus.world[seg].errMsg}
            onApplyCode={onApplyCode}
            onChangeCode={onChangeCode}
          />
        ))
      }
    </div>
  );
};

export default WorldEditor;
