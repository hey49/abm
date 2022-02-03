import type { NextPage } from 'next';
import React from 'react';
import { Divider } from '@mui/material';
import { enableMapSet } from 'immer';
import SetUp from '../src/components/SetUp';
import Display from '../src/components/Display';
import Charts from '../src/components/Charts';
// import styles from '../styles/index.module.css';

const Home: NextPage = () => {
  React.useEffect(() => {
    enableMapSet();
    // console.clear();
  }, []);

  return (
    <div className="flex h-full w-full">
      <div className="w-1/3 h-full">
        <SetUp />
      </div>
      <Divider orientation="vertical" flexItem />
      <div className="w-1/3  h-full">
        <Display />
      </div>
      <Divider orientation="vertical" flexItem />
      <div className="w-1/3">
        <Charts />
      </div>
    </div>
  );
};

export default Home;
