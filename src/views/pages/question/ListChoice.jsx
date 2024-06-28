import { useEffect, useRef, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';



import { gridSpacing } from 'store/constant';


import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
import { useNavigate } from 'react-router-dom';
import { Button, InputLabel, MenuItem, Select, TextField } from '@mui/material';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const ListChoice = ({listChoice, onDelete, onAdd}) => {
  return (
    listChoice.map((choice,index)=>(
    <Grid key={index} container spacing={gridSpacing} sx={{marginBottom: gridSpacing}}>
        <Grid item xs={4}>
            <TextField label="Nội dung" sx={{ width: '100%' }}></TextField>
        </Grid>
        <Grid item xs={2}>
            <Select value={listChoice[index]?.is_correct} title="Kết quả" sx={{width: '100%'}}>
              <MenuItem value={true}>Đúng</MenuItem>
              <MenuItem value={false}>Sai</MenuItem>
            </Select>
          </Grid>
        {index === listChoice.length - 1 && (
        <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          <Button onClick={onAdd}>Thêm</Button>
          <Button onClick={onDelete} color="error">Xóa</Button>
        </Grid>
      )}
    </Grid>))
  );
};

export default ListChoice;
