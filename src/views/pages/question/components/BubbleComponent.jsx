import React, { useRef, useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { height, width } from '@mui/system';

const BubbleComponent = ({ children }) => {
  const [position, setPosition] = useState({ x: `100vw`, y: '50vh' });
  let isDragging = useRef(false);

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
  };

  const handleMouseUp = (e) => {
    isDragging.current = false;
    setPosition({ x: `100vw`, y: position.y });
  };

  return (
    <Box
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        zIndex: 9999999,
        position: 'fixed',
        width: '80px',
        top: position.y,
        left: position.x,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <Grid container>
        <Grid item sx={{ transform: 'translate(-50%, 0%)' }} xs={12}>
          {children}
        </Grid>
      </Grid>
    </Box>
  );
};

export default BubbleComponent;
