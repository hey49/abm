/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Divider } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../redux/store';
import { cls } from '../utils';
import WorldEditor from './WorldEditor';
import AgentsEditor from './AgentsEditor';
import StaticsEditor from './ChartsEditor';
import { useDivRect } from '../hooks';
import { selectCurrModel } from '../redux/actions';

const SetUp = () => {
  const editorNames = [
    'WORLD', 'AGENTS', 'STATICS',
  ];

  const [selected, setSelected] = React.useState(0);
  const containerRef = React.useRef(null);
  const rect = useDivRect(containerRef);

  const {
    models, currModel,
  } = useAppSelector((state) => state);

  const dispatch = useAppDispatch();

  return (
    <div className="h-full pl-px pt-2 flex flex-col">
      <div className="flex flex-none mb-1 justify-between">
        <div className="text-2xl ml-2">
          ABModel
        </div>
        <div>
          <span>Model:</span>
          <Select
            value={currModel}
            onChange={(event) => {
              dispatch(selectCurrModel(event.target.value));
            }}
            autoFocus={false}
            label="Model"
            variant="standard"
          >
            {models.map((name) => (
              <MenuItem key={name} value={name} disableRipple>
                {name}
              </MenuItem>
            ))}
          </Select>
        </div>

      </div>
      <Divider className="mx-2" flexItem />
      <div className="flex flex-1 w-full min-h-0">
        <div className="flex-none w-6 text text-sm flex flex-col justify-around">
          {
          editorNames.map((name, index) => (
            <div
              className={cls(
                'select-none cursor-pointer duration-75',
                index === selected && 'text-blue-500 border-r-4 border-blue-500',
              )}
              key={name}
              style={{ writingMode: 'vertical-lr', textOrientation: 'upright' }}
              onClick={() => setSelected(index)}
            >
              {name}
            </div>
          ))
        }
        </div>
        <Divider orientation="vertical" flexItem />
        <div className="w-full min-w-0" ref={containerRef}>
          { rect && [
            <WorldEditor edWidth={rect ? rect.width : 0} />,
            <AgentsEditor edWidth={rect ? rect.width : 0} />,
            <StaticsEditor edWidth={rect ? rect.width : 0} />,
          ][selected]}
        </div>
      </div>
    </div>
  );
};

export default SetUp;
