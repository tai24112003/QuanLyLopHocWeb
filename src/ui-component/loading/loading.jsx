import React from 'react';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/system';

const Loading = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,.2)',
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 99999,
        textAlign: 'center'
      }}
    >
      <Box sx={{ width: '50%' }}>
        <CircularProgress variant="indeterminate" />
      </Box>
      Loading...
    </div>
  );
};

export default Loading;
