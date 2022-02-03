import React from 'react';
import { Divider } from '@mui/material';
import Player from './Player';
import WorldMap from './WorldMap';
import Info from './Info';

const Display = () => (
  <div className="flex flex-col h-full">
    <Player />
    <WorldMap />
    <Divider flexItem />
    <Info />
  </div>
);

export default Display;
