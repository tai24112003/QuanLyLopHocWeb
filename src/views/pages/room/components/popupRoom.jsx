import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Typography } from '@mui/material';
import { gridSpacing } from 'store/constant';

const PopupWithTextField = ({ open, handleClose, handleSave, roomEdit }) => {
  const [data, setData] = useState({
    RoomName: '',
    StandardHDD: roomEdit ? null : '',
    StandardCPU: roomEdit ? null : '',
    StandardRAM: roomEdit ? null : '',
    NumberOfComputers: '',
    additionalRAM: [],
    additionalHDD: [],
    additionalCPU: []
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
      const standardRAM = roomEdit?.StandardRAM ? roomEdit.StandardRAM.split('|') : [];
      const standardHDD = roomEdit?.StandardHDD ? roomEdit.StandardHDD.split('|') : [];
      const standardCPU = roomEdit?.StandardCPU ? roomEdit.StandardCPU.split('|') : [];

      setData({
        RoomName: roomEdit?.RoomName ?? '',
        StandardHDD: standardHDD[0] ?? '',
        StandardRAM: standardRAM[0] ?? '',
        StandardCPU: standardRAM[0] ?? '',
        NumberOfComputers: roomEdit?.NumberOfComputers ?? '',
        additionalRAM: standardRAM.filter((value, idx) => {
          return idx === 0;
        }),
        additionalHDD: standardHDD.filter((value, idx) => {
          return idx === 0;
        }),
        additionalCPU: standardCPU.filter((value, idx) => {
          return idx === 0;
        })
      });
    }
  }, [open, roomEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleAddRAM = () => {
    setData((prevData) => ({
      ...prevData,
      additionalRAM: [...prevData.additionalRAM, '']
    }));
  };

  const handleAddHDD = () => {
    setData((prevData) => ({
      ...prevData,
      additionalHDD: [...prevData.additionalHDD, '']
    }));
  };

  const handleAddCPU = () => {
    setData((prevData) => ({
      ...prevData,
      additionalCPU: [...prevData.additionalCPU, '']
    }));
  };

  const handleRAMChange = (index, value) => {
    const updatedRAMs = [...data.additionalRAM];
    updatedRAMs[index] = value;
    setData((prevData) => ({
      ...prevData,
      additionalRAM: updatedRAMs
    }));
  };

  const handleHDDChange = (index, value) => {
    const updatedHDDs = [...data.additionalHDD];
    updatedHDDs[index] = value;
    setData((prevData) => ({
      ...prevData,
      additionalHDD: updatedHDDs
    }));
  };

  const handleCPUChange = (index, value) => {
    const updatedCPUs = [...data.additionalCPU];
    updatedCPUs[index] = value;
    setData((prevData) => ({
      ...prevData,
      additionalCPU: updatedCPUs
    }));
  };

  const handleRemoveRAM = (index) => {
    const updatedRAMs = data.additionalRAM.filter((_, i) => i !== index);
    setData((prevData) => ({
      ...prevData,
      additionalRAM: updatedRAMs
    }));
  };

  const handleRemoveHDD = (index) => {
    const updatedHDDs = data.additionalHDD.filter((_, i) => i !== index);
    setData((prevData) => ({
      ...prevData,
      additionalHDD: updatedHDDs
    }));
  };

  const handleRemoveCPU = (index) => {
    const updatedCPUs = data.additionalCPU.filter((_, i) => i !== index);
    setData((prevData) => ({
      ...prevData,
      additionalCPU: updatedCPUs
    }));
  };

  const validate = () => {
    let valid = true;
    let err = {};

    if (!data.RoomName) {
      err.RoomName = 'Room Name không để trống';
      valid = false;
    }
    if (!data.StandardHDD) {
      err.StandardHDD = 'HDD không để trống';
      valid = false;
    }
    if (!data.StandardCPU) {
      err.StandardCPU = 'CPU không để trống';
      valid = false;
    }
    if (!data.StandardRAM) {
      err.StandardRAM = 'RAM không để trống';
      valid = false;
    }
    if (!data.NumberOfComputers) {
      err.NumberOfComputers = 'Số lượng máy không để trống';
      valid = false;
    }

    // Validate additional fields
    data.additionalRAM.forEach((ram, index) => {
      if (!ram) {
        err[`additionalRAM_${index}`] = `RAM thêm ${index + 1} không để trống`;
        valid = false;
      }
    });

    data.additionalHDD.forEach((hdd, index) => {
      if (!hdd) {
        err[`additionalHDD_${index}`] = `HDD thêm ${index + 1} không để trống`;
        valid = false;
      }
    });

    data.additionalCPU.forEach((cpu, index) => {
      if (!cpu) {
        err[`additionalCPU_${index}`] = `CPU thêm ${index + 1} không để trống`;
        valid = false;
      }
    });

    setError(err);
    return valid;
  };

  const handleSaveClick = () => {
    if (validate()) {
      const combinedRAM = [...data.additionalRAM, data.StandardRAM].join('|').replaceAll(' ', '');
      const combinedHDD = [...data.additionalHDD, data.StandardHDD].join('|').replaceAll(' ', '');
      const combinedCPU = [...data.additionalCPU, data.StandardCPU].join('|').replaceAll(' ', '');

      handleSave({
        ...data,
        StandardRAM: combinedRAM,
        StandardHDD: combinedHDD,
        StandardCPU: combinedCPU
      });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ fontSize: 20 }}>Nhập thông tin phòng</DialogTitle>
      <DialogContent>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <TextField
              disabled={roomEdit}
              autoFocus
              margin="dense"
              label="Room Name"
              name="RoomName"
              type="text"
              fullWidth
              value={data.RoomName}
              onChange={handleChange}
              onBlur={() => {
                if (!data.RoomName) setError((prev) => ({ ...prev, RoomName: 'Room Name không để trống' }));
              }}
            />
            <Typography sx={{ fontSize: 10, color: 'red' }}>{error.RoomName}</Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <TextField
              margin="dense"
              label="HDD"
              name="StandardHDD"
              type="text"
              fullWidth
              value={data.StandardHDD}
              onChange={handleChange}
            />
            <Typography sx={{ fontSize: 10, color: 'red' }}>{error.StandardHDD}</Typography>
            {data.additionalHDD.map((hdd, index) => (
              <Grid container key={index} alignItems="center">
                <Grid item xs={12}>
                  <TextField
                    margin="dense"
                    label={`HDD thêm ${index + 1}`}
                    type="text"
                    fullWidth
                    value={hdd}
                    onChange={(e) => handleHDDChange(index, e.target.value)}
                  />
                  <Typography sx={{ fontSize: 10, color: 'red' }}>{error[`additionalHDD_${index}`]}</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Button onClick={() => handleRemoveHDD(index)} color="error" size="small">
                    Xóa
                  </Button>
                </Grid>
              </Grid>
            ))}
            <Button onClick={handleAddHDD} color="primary">
              Thêm HDD
            </Button>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <TextField
              margin="dense"
              label="CPU"
              name="StandardCPU"
              type="text"
              fullWidth
              value={data.StandardCPU}
              onChange={handleChange}
            />
            <Typography sx={{ fontSize: 10, color: 'red' }}>{error.StandardCPU}</Typography>
            {data.additionalCPU.map((cpu, index) => (
              <Grid container key={index} alignItems="center">
                <Grid item xs={12}>
                  <TextField
                    margin="dense"
                    label={`CPU thêm ${index + 1}`}
                    type="text"
                    fullWidth
                    value={cpu}
                    onChange={(e) => handleCPUChange(index, e.target.value)}
                  />
                  <Typography sx={{ fontSize: 10, color: 'red' }}>{error[`additionalCPU_${index}`]}</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Button onClick={() => handleRemoveCPU(index)} color="error" size="small">
                    Xóa
                  </Button>
                </Grid>
              </Grid>
            ))}
            <Button onClick={handleAddCPU} color="primary">
              Thêm CPU
            </Button>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <TextField
              margin="dense"
              label="RAM"
              name="StandardRAM"
              type="text"
              fullWidth
              value={data.StandardRAM}
              onChange={handleChange}
            />
            <Typography sx={{ fontSize: 10, color: 'red' }}>{error.StandardRAM}</Typography>
            {data.additionalRAM.map((ram, index) => (
              <Grid container key={index} alignItems="center">
                <Grid item xs={12}>
                  <TextField
                    margin="dense"
                    label={`RAM thêm ${index + 1}`}
                    type="text"
                    fullWidth
                    value={ram}
                    onChange={(e) => handleRAMChange(index, e.target.value)}
                  />
                  <Typography sx={{ fontSize: 10, color: 'red' }}>{error[`additionalRAM_${index}`]}</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Button onClick={() => handleRemoveRAM(index)} color="error" size="small">
                    Xóa
                  </Button>
                </Grid>
              </Grid>
            ))}
            <Button onClick={handleAddRAM} color="primary">
              Thêm RAM
            </Button>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <TextField
              disabled={roomEdit}
              margin="dense"
              label="Số lượng máy"
              name="NumberOfComputers"
              type="number"
              fullWidth
              value={data.NumberOfComputers}
              onChange={handleChange}
            />
            <Typography sx={{ fontSize: 10, color: 'red' }}>{error.NumberOfComputers}</Typography>
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
