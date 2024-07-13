import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Typography } from '@mui/material';
import { gridSpacing } from 'store/constant';

const PopupWithTextField = ({ open, handleClose, handleSave, roomEdit }) => {
  const [data, setData] = useState({
    ComputerName: '',
    RoomID: roomEdit ? null : '',
    HDD: roomEdit ? null : '',
    RAM: roomEdit ? null : '',
    CPU: ''
  });

  const [error, setError] = useState({
    RoomName: '',
    StandardHDD: '',
    StandardCPU: '',
    StandardRAM: '',
    NumberOfComputers: ''
  });

  useEffect(() => {
    if (open) {
      setData({
        ComputerName: roomEdit ? roomEdit.ComputerName : '',
        RoomID: roomEdit ? roomEdit.RoomID : '',
        HDD: roomEdit ? roomEdit.HDD : '',
        RAM: roomEdit ? roomEdit.RAM : '',
        CPU: roomEdit ? roomEdit.CPU : ''
      });
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const validate = () => {
    let valid = true;
    let err = {};

    if (!data.ComputerName) {
      err.ComputerName = 'Room Name không để trống';
      valid = false;
    }
    if (!data.HDD) {
      err.HDD = 'HDD không để trống';
      valid = false;
    }
    if (!data.CPU) {
      err.CPU = 'CPU không để trống';
      valid = false;
    }
    if (!data.RAM) {
      err.RAM = 'RAM không để trống';
      valid = false;
    }

    setError(err);
    return valid;
  };

  const handleSaveClick = () => {
    if (validate()) {
      handleSave(data);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ fontSize: 20 }}>Nhập thông tin phòng</DialogTitle>
      <DialogContent>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              margin="dense"
              label="ComputerName"
              name="ComputerName"
              type="text"
              fullWidth
              value={data.ComputerName}
              onChange={handleChange}
              onBlur={() => {
                if (!data.ComputerName) setError((prev) => ({ ...prev, ComputerName: 'Computer Name không để trống' }));
              }}
            />
            <Typography sx={{ fontSize: 10, color: 'red' }}>{error.ComputerName}</Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <TextField margin="dense" label="HDD" name="HDD" type="text" fullWidth value={data.HDD} onChange={handleChange} />
            <Typography sx={{ fontSize: 10, color: 'red' }}>{error.HDD}</Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <TextField margin="dense" label="CPU" name="CPU" type="text" fullWidth value={data.CPU} onChange={handleChange} />
            <Typography sx={{ fontSize: 10, color: 'red' }}>{error.CPU}</Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <TextField margin="dense" label="RAM" name="RAM" type="text" fullWidth value={data.RAM} onChange={handleChange} />
            <Typography sx={{ fontSize: 10, color: 'red' }}>{error.RAM}</Typography>
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

export default PopupWithTextField;
