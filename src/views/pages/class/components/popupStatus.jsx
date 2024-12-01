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
  const [value, setValue] = useState(sessionEdit ?? { Status: true });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue((prevData) => ({
      ...prevData,
      Status: value
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
              <RadioGroup aria-label="attendance" name="attendance" value={value?.Status} onChange={handleChange}>
                <FormControlLabel key={1} value={false} control={<Radio />} label={'Lớp đã kết thúc khóa'} />
                <FormControlLabel key={2} value={true} control={<Radio />} label={'Lớp còn trong khóa'} />
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
