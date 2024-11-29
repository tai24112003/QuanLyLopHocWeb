import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Typography } from '@mui/material';
import { gridSpacing } from 'store/constant';
import HDDFields from './hddComponent';
import RAMFields from './ramComponent';

const PopupWithTextField = ({ open, handleClose, handleSave, roomEdit }) => {
  const [data, setData] = useState({
    RoomName: '',
    StandardHDD: roomEdit
      ? null
      : {
          Model: '',
          Interface: '',
          Size: ''
        },
    StandardCPU: roomEdit ? null : '',
    StandardRAM: roomEdit
      ? null
      : {
          Capacity: '',
          Manufacturer: ''
        },
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
    setData((prevData) => {
      // Kiểm tra xem có phải thuộc tính trong "StandardHDD" hay không
      if (name.startsWith('StandardHDD.')) {
        const key = name.split('.')[1]; // Lấy phần sau dấu "."
        return {
          ...prevData,
          StandardHDD: {
            ...prevData.StandardHDD,
            [key]: value
          }
        };
      }
      if (name.startsWith('StandardRAM.')) {
        const key = name.split('.')[1]; // Lấy phần sau dấu "."
        return {
          ...prevData,
          StandardRAM: {
            ...prevData.StandardRAM,
            [key]: value
          }
        };
      }

      // Nếu không, xử lý các trường hợp thông thường
      return {
        ...prevData,
        [name]: value
      };
    });
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

  const handleRAMChange = (e, index, value) => {
    const updatedRAMs = [...data.additionalRAM];
    const { name } = e.target;
    // Kiểm tra xem có phải thuộc tính trong "updatedRAMs" hay không
    if (name.startsWith('StandardHDD.')) {
      const key = name.split('.')[1]; // Lấy phần sau dấu "."
      updatedRAMs[index] = { ...(updatedRAMs[index] ?? { [key]: value }), [key]: value };
    }
    setData((prevData) => ({
      ...prevData,
      additionalRAM: updatedRAMs
    }));
  };

  const handleHDDChange = (e, index, value) => {
    const updatedHDDs = [...data.additionalHDD];
    const { name } = e.target;
    // Kiểm tra xem có phải thuộc tính trong "StandardHDD" hay không
    if (name.startsWith('StandardHDD.')) {
      const key = name.split('.')[1]; // Lấy phần sau dấu "."
      updatedHDDs[index] = { ...(updatedHDDs[index] ?? { [key]: value }), [key]: value };
    }
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
    if (true) {
      const combinedRAM = [
        ...data.additionalRAM.map(
          (item) => `Capacity:&&${item.Capacity.replaceAll(' ', '&&')}&&Manufacturer:&&${item.Manufacturer.replaceAll(' ', '&&')}`
        ),
        `Capacity:&&${data.StandardRAM.Capacity.replaceAll(' ', '&&')}&&Manufacturer:&&${data.StandardRAM.Manufacturer.replaceAll(' ', '&&')}`
      ]
        .join('|')
        .replaceAll(' ', '')
        .replaceAll('&&', ' ');
      const combinedHDD = [
        ...data.additionalHDD.map(
          (item) =>
            `Model:&&${item.Model.replaceAll(' ', '&&')}&&Interface:&&${item.Interface.replaceAll(' ', '&&')}&&Size:&&${item.Size.replaceAll(' ', '&&')}`
        ),
        `Model:&&${data.StandardHDD.Model.replaceAll(' ', '&&')}&&Interface:&&${data.StandardHDD.Interface.replaceAll(' ', '&&')}&&Size:&&${data.StandardHDD.Size.replaceAll(' ', '&&')}`
      ]
        .join('|')
        .replaceAll(' ', '')
        .replaceAll('&&', ' ');
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
        <Grid container spacing={1}>
          <Grid container xs={12}>
            <Grid item xs={12} className="p-5">
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
          </Grid>
          <Grid item container spacing={1} xs={12} sm={12} md={12}>
            <HDDFields data={data.StandardHDD} handleChange={handleChange} error={error.StandardHDD} />
            {data.additionalHDD.map((hdd, index) => (
              <Grid container key={index} alignItems="center">
                <HDDFields
                  data={hdd}
                  handleChange={(e) => handleHDDChange(e, index, e.target.value)}
                  error={error[`additionalHDD_${index}`]}
                />
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
          <Grid item container spacing={1} xs={12} sm={12} md={12}>
            <RAMFields data={data.StandardRAM} handleChange={handleChange} error={error.StandardRAM} />
            {data.additionalRAM.map((ram, index) => (
              <Grid container key={index} alignItems="center">
                <Grid item xs={12}>
                  <RAMFields
                    data={ram}
                    handleChange={(e) => handleRAMChange(e, index, e.target.value)}
                    error={error[`additionalRAM_${index}`]}
                  />
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
          <Grid item xs={12} container spacing={1} sm={12} md={12}>
            <TextField
              margin="dense"
              label="CPU"
              name="StandardCPU"
              type="text"
              fullWidth
              value={data.StandardCPU}
              onChange={handleChange}
            />
            <Grid item xs={12}>
              <Typography sx={{ fontSize: 10, color: 'red' }}>{error.StandardCPU}</Typography>
            </Grid>
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
          <Grid item container xs={12} sm={12} spacing={1} md={12}>
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
