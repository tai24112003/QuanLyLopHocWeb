import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { gridSpacing } from 'store/constant';

const PopupUpdateStatus = ({ open, handleClose, handleSave, sessionEdit }) => {
  const [value, setValue] = useState(sessionEdit ?? { currentStatus: 'v' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue((prevData) => ({
      ...prevData,
      currentStatus: value
    }));
  };

  useEffect(() => {
    if (open) setValue({ ...sessionEdit });
  }, [open]);

  const handleSaveClick = () => {
    handleSave(value);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ fontSize: 20 }}>Chọn trạng thái</DialogTitle>
      <DialogContent>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={12} md={12}>
            <FormControl fullWidth component="fieldset">
              <RadioGroup aria-label="attendance" name="attendance" value={value?.currentStatus} onChange={handleChange}>
                <FormControlLabel key={1} value={'c'} control={<Radio />} label={'Có mặt'} />
                <FormControlLabel key={2} value={'cp'} control={<Radio />} label={'Vắng có phép'} />
                <FormControlLabel key={3} value={'v'} control={<Radio />} label={'Vắng không phép'} />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">
          Hủy
        </Button>
        <Button onClick={handleSaveClick} color="primary">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopupUpdateStatus;
