import React from 'react';

import AceEditor from 'react-ace';

import 'ace-builds/src-min-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/snippets/javascript';
import 'ace-builds/src-noconflict/theme-tomorrow';

import {
  ArrowRightAlt, ChevronRight, ExpandMore, Done, ErrorOutline,
} from '@mui/icons-material';
import { Divider } from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { cls } from '../utils';
import { EditorSegState } from '../redux/types';

type EditorSegProps = {
  edWidth: number;
  seg: string;
  code: string;
  segState: EditorSegState;
  errMsg: string;
  onApplyCode: (seg: string) => void;
  onChangeCode: (seg: string, newValue: string) => void;
};

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'red',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

const EditorSeg = ({
  edWidth,
  seg,
  code,
  segState,
  errMsg,
  onApplyCode,
  onChangeCode,
}: EditorSegProps) => {
  const [expanded, setExpanded] = React.useState(true);
  const [showErrMsg, setShowErrMsg] = React.useState(false);

  const applyBtn = [
    // normal
    <Button onClick={() => onApplyCode(seg)} disableRipple>
      <ArrowRightAlt />
    </Button>,
    // applied
    <Button color="success" disableRipple>
      <Done />
    </Button>,
    // error
    <LightTooltip
      title={errMsg}
      placement="bottom-end"
      open={showErrMsg}
      disableFocusListener
      disableHoverListener
      disableTouchListener
    >
      <Button color="error" onClick={() => setShowErrMsg(!showErrMsg)} disableRipple>
        <ErrorOutline />
      </Button>
    </LightTooltip>,
  ];

  return (
    <div className={cls(
      'mb-1',
      segState === EditorSegState.Applied && 'bg-emerald-300',
      segState === EditorSegState.Error && 'bg-red-300',
    )}
    >
      <div className="flex justify-between text-sm text-center">
        <Button
          color="normal"
          onClick={() => setExpanded(!expanded)}
          disableRipple
        >
          {
          expanded
            ? (<span><ExpandMore className="align-middle" /></span>)
            : (<span><ChevronRight className="align-middle" /></span>)
          }
          <span>{seg.toUpperCase()}</span>
        </Button>
        {applyBtn[segState]}
      </div>
      <Divider />
      {
        expanded && (
          <AceEditor
            placeholder={code}
            width={`${edWidth}px`}
            height="234px"
            mode="javascript"
            theme="tomorrow"
            name={seg}
            onChange={(value) => onChangeCode(seg, value)}
            fontSize={12}
            showPrintMargin
            showGutter
            highlightActiveLine
            value={code}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
              useWorker: false,
            }}
          />
        )
      }
    </div>
  );
};

export default EditorSeg;
