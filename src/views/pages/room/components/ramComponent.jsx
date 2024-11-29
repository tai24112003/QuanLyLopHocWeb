import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';

const RAMFields = ({ data, error, handleChange }) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={4}>
        <TextField
          margin="dense"
          label="RAM Capacity"
          name="StandardRAM.Capacity"
          type="text"
          fullWidth
          value={data?.Capacity}
          onChange={handleChange}
        />
        <Typography sx={{ fontSize: 10, color: 'red' }}>{error?.Model}</Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          margin="dense"
          label="RAM Manufacturer"
          name="StandardRAM.Manufacturer"
          type="text"
          fullWidth
          value={data?.Manufacturer}
          onChange={handleChange}
        />
        <Typography sx={{ fontSize: 10, color: 'red' }}>{error?.Interface}</Typography>
      </Grid>
    </Grid>
  );
};

export default RAMFields;
