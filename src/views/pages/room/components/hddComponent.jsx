import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';

const HDDFields = ({ data, error, handleChange }) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={4}>
        <TextField
          margin="dense"
          label="HDD Model"
          name="StandardHDD.Model"
          type="text"
          fullWidth
          value={data?.Model}
          onChange={handleChange}
        />
        <Typography sx={{ fontSize: 10, color: 'red' }}>{error?.Model}</Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          margin="dense"
          label="HDD Interface"
          name="StandardHDD.Interface"
          type="text"
          fullWidth
          value={data?.Interface}
          onChange={handleChange}
        />
        <Typography sx={{ fontSize: 10, color: 'red' }}>{error?.Interface}</Typography>
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          margin="dense"
          label="HDD Size"
          name="StandardHDD.Size"
          type="text"
          fullWidth
          value={data?.Size}
          onChange={handleChange}
        />
        <Typography sx={{ fontSize: 10, color: 'red' }}>{error?.Size}</Typography>
      </Grid>
    </Grid>
  );
};

export default HDDFields;
