import React from 'react';
import Button from '@mui/material/Button';
import {
  PlayArrow,
  Pause,
  FastForward,
  FastRewind,
  SkipNext,
  // RestartAlt,
} from '@mui/icons-material';
import Slider from '@mui/material/Slider';
import { useAppSelector, useAppDispatch } from '../redux/store';
import { EditorSegState } from '../redux/types';
import {
  nextTurn,
  // resetWorld,
  jumpToTurn,
} from '../redux/actions';

const INIT_INTERVAL = 100;

// type PlayTimer = {
//   timer: ReturnType<typeof setTimeout> | null;
//   speed: number;
// }

const Player = () => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [speed, setSpeed] = React.useState(1);
  const timer = React.useRef<null | ReturnType<typeof setTimeout>>(null);

  const {
    currTurn,
    maxTurn,
  } = useAppSelector((state) => state);

  const notReady = useAppSelector(
    (state) => state.modelConfig.editors.world.world.setUp.segState !== EditorSegState.Applied,
  );

  const dispatch = useAppDispatch();

  const play = () => {
    timer.current = setTimeout(() => {
      dispatch(nextTurn());
      play();
    }, INIT_INTERVAL * (1 / speed));
  };

  React.useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      play();
    }
  }, [speed]);

  const onStart = () => {
    setIsPlaying(true);
    play();
  };

  const onPause = () => {
    setIsPlaying(false);
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  // const onStop = () => {
  //   setIsPlaying(false);
  //   if (timer.current) {
  //     clearTimeout(timer.current);
  //     timer.current = null;
  //   }
  //   dispatch(resetWorld());
  // };

  const onFastRewind = () => {
    setSpeed(speed - 0.25);
  };

  const onResetSpeed = () => {
    setSpeed(1);
  };

  const onFastForward = () => {
    setSpeed(speed + 0.25);
  };

  const onNextTurn = () => {
    dispatch(nextTurn());
  };

  const changeSlider = (_: any, value: any) => {
    if (typeof value === 'number') {
      dispatch(jumpToTurn(value));
    }
  };

  return (
    <div className="flex flex-col w-full px-4 mt-2">
      <div className="flex w-full justify-between">
        {
          isPlaying ? (
            <Button disableRipple onClick={onPause} disabled={notReady}>
              <Pause />
            </Button>
          ) : (
            <Button disableRipple onClick={onStart} disabled={notReady}>
              <PlayArrow />
            </Button>
          )
        }
        {/* <Button disableRipple onClick={onStop} disabled={notReady}>
          <RestartAlt />
        </Button> */}
        <Button disableRipple onClick={onFastRewind} disabled={speed <= 0.25 || notReady}>
          <FastRewind />
        </Button>
        <Button disableRipple onClick={onResetSpeed} disabled={notReady}>
          {speed}
        </Button>
        <Button disableRipple onClick={onFastForward} disabled={speed >= 2 || notReady}>
          <FastForward />
        </Button>
        <Button disableRipple onClick={onNextTurn} disabled={notReady}>
          <SkipNext />
        </Button>
      </div>

      <div className="w-full flex justify-between">
        <Button disableRipple onClick={() => dispatch(jumpToTurn(0))} disabled={notReady}>
          0
        </Button>
        <Slider
          className="flex-1 mr-2"
          defaultValue={0}
          value={currTurn}
          step={1}
          min={0}
          max={maxTurn}
          disabled={notReady}
          valueLabelDisplay="auto"
          onMouseDown={onPause}
          onChange={changeSlider}
        />
        <Button disableRipple onClick={() => dispatch(jumpToTurn(maxTurn))} disabled={notReady}>
          {maxTurn}
        </Button>
      </div>
    </div>
  );
};

export default Player;
