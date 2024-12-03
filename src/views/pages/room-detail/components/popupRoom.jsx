import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Typography } from '@mui/material';
import HDDFields from 'views/pages/room/components/hddComponent';
import RAMFields from 'views/pages/room/components/ramComponent';

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
    NumberOfComputers: '',
    additionalRAM: [],
    additionalHDD: [],
    additionalCPU: []
  });

  const handleClosing = () => {
    setData({
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
    setError({
      RoomName: '',
      StandardHDD: '',
      StandardCPU: '',
      StandardRAM: '',
      NumberOfComputers: '',
      additionalRAM: [],
      additionalHDD: [],
      additionalCPU: []
    });
    handleClose();
  };

  useEffect(() => {
    if (open) {
      const standardRAM = roomEdit?.RAM
        ? roomEdit.RAM.split('\n').map((item) => {
            const info = item.split(/Capacity:\s*|\s*Manufacturer:\s*/);
            return {
              Capacity: info[1] ?? '',
              Manufacturer: info[2] ?? ''
            };
          })
        : [
            {
              Capacity: '',
              Manufacturer: ''
            }
          ];
      const standardHDD = roomEdit?.HDD
        ? roomEdit.HDD.split('\n').map((item) => {
            const info = item.split(/Model:\s*|\s*Interface:\s*|\sSize:\s/);
            return {
              Model: info[1] ?? '',
              Interface: info[2] ?? '',
              Size: info[3] ?? ''
            };
          })
        : [
            {
              Model: '',
              Interface: '',
              Size: ''
            }
          ];
      const standardCPU = roomEdit?.CPU ? roomEdit.CPU.split('\n') : [];
      setData({
        ID: roomEdit?.ID,
        ComputerName: roomEdit?.ComputerName ?? '',
        RoomID: roomEdit?.RoomID ?? '',
        StandardHDD: standardHDD[0] ?? '',
        StandardRAM: standardRAM[0] ?? '',
        StandardCPU: standardCPU[0] ?? '',
        additionalRAM: standardRAM.filter((value, idx) => {
          return idx !== 0 && idx != standardRAM.length - 1;
        }),
        additionalHDD: standardHDD.filter((value, idx) => {
          console.log(value);
          return idx !== 0 && idx != standardHDD.length - 1;
        }),
        additionalCPU: standardCPU.filter((value, idx) => {
          return idx !== 0 && idx != standardCPU.length - 1;
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
    if (data.additionalRAM.length >= 3) return;
    setData((prevData) => ({
      ...prevData,
      additionalRAM: [
        ...prevData.additionalRAM,
        {
          Capacity: '',
          Manufacturer: ''
        }
      ]
    }));
  };

  const handleAddHDD = () => {
    if (data.additionalHDD.length >= 4) return;
    setData((prevData) => ({
      ...prevData,
      additionalHDD: [...prevData.additionalHDD, '']
    }));
  };

  const handleAddCPU = () => {
    if (data.additionalCPU.length >= 1) return;
    setData((prevData) => ({
      ...prevData,
      additionalCPU: [...prevData.additionalCPU, '']
    }));
  };

  const handleRAMChange = (e, index, value) => {
    const updatedRAMs = [...data.additionalRAM];
    const { name } = e.target;
    // Kiểm tra xem có phải thuộc tính trong "updatedRAMs" hay không
    if (name.startsWith('StandardRAM.')) {
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

    if (!data.ComputerName) {
      err.RoomName = 'Tên máy không để trống';
      valid = false;
    }
    if (!data.StandardHDD.Model) {
      err.StandardHDD = {
        ...err.StandardHDD,
        Model: 'HDD Model không để trống'
      };
      valid = false;
    }
    if (!data.StandardHDD.Interface) {
      err.StandardHDD = {
        ...err.StandardHDD,
        Interface: 'HDD Interface không để trống'
      };
      valid = false;
    }
    if (!data.StandardHDD.Size) {
      err.StandardHDD = {
        ...err.StandardHDD,
        Size: 'HDD Size không để trống'
      };
      valid = false;
    }
    if (!data.StandardCPU) {
      err.StandardCPU = 'CPU không để trống';
      valid = false;
    }
    if (!data.StandardRAM.Capacity) {
      err.StandardRAM = {
        ...err.StandardRAM,
        Capacity: 'RAM Capacity không để trống'
      };
      valid = false;
    }
    if (!data.StandardRAM.Manufacturer) {
      err.StandardRAM = {
        ...err.StandardRAM,
        Manufacturer: 'RAM Manufacturer không để trống'
      };
      valid = false;
    }

    // Validate additional fields
    err.additionalRAM = [];
    data.additionalRAM.forEach((ram, index) => {
      if (!ram.Capacity) {
        err.additionalRAM[index] = {
          Capacity: 'RAM Capacity không để trống'
        };

        valid = false;
      }
      if (!ram.Manufacturer) {
        err.additionalRAM[index] = {
          ...err.additionalRAM[index],
          Manufacturer: 'RAM Manufacturer không để trống'
        };
        valid = false;
      }
    });

    err.additionalHDD = [];
    data.additionalHDD.forEach((hdd, index) => {
      if (!hdd.Model) {
        err.additionalHDD[index] = {
          Model: 'HDD Model không để trống'
        };

        valid = false;
      }
      if (!hdd.Size) {
        err.additionalHDD[index] = {
          ...err.additionalHDD[index],
          Size: 'HDD Size không để trống'
        };
        valid = false;
      }
      if (!hdd.Interface) {
        err.additionalHDD[index] = {
          ...err.additionalHDD[index],
          Interface: 'HDD Interface không để trống'
        };
        valid = false;
      }
    });

    err.additionalCPU = [];
    data.additionalCPU.forEach((cpu, index) => {
      if (!cpu) {
        err.additionalCPU[index] = 'CPU không để trống';
        valid = false;
      }
    });
    setError(err);
    return valid;
  };

  const handleSaveClick = () => {
    if (validate()) {
      const combinedRAM = [
        `Capacity:&&${data.StandardRAM.Capacity.replaceAll(' ', '&&')}&&Manufacturer:&&${data.StandardRAM.Manufacturer.replaceAll(' ', '&&')}`,
        ...data.additionalRAM.map(
          (item) => `Capacity:&&${item.Capacity.replaceAll(' ', '&&')}&&Manufacturer:&&${item.Manufacturer.replaceAll(' ', '&&')}`
        ),
        ' '
      ]
        .join('\n')
        .replaceAll(' ', '')
        .replaceAll('&&', ' ');
      const combinedHDD = [
        `Model:&&${data.StandardHDD.Model.replaceAll(' ', '&&')}&&Interface:&&${data.StandardHDD.Interface.replaceAll(' ', '&&')}&&Size:&&${data.StandardHDD.Size.replaceAll(' ', '&&')}`,
        ...data.additionalHDD.map(
          (item) =>
            `Model:&&${item.Model.replaceAll(' ', '&&')}&&Interface:&&${item.Interface.replaceAll(' ', '&&')}&&Size:&&${item.Size.replaceAll(' ', '&&')}`
        ),
        ' '
      ]
        .join('\n')
        .replaceAll(' ', '')
        .replaceAll('&&', ' ');
      const combinedCPU = [data.StandardCPU, ...data.additionalCPU, ' '].join('\n').replaceAll(' ', '');
      handleSave({
        ...data,
        RAM: combinedRAM,
        HDD: combinedHDD,
        CPU: combinedCPU
      });
    }
  };

  return (
    <Dialog open={open} onClose={handleClosing}>
      <DialogTitle sx={{ fontSize: 20 }}>Nhập thông máy</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid container>
            <Grid item xs={12} className="p-5">
              <TextField
                disabled={!!roomEdit}
                autoFocus
                margin="dense"
                label="Tên máy"
                name="ComputerName"
                type="text"
                fullWidth
                value={data.ComputerName}
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
                <HDDFields data={hdd} handleChange={(e) => handleHDDChange(e, index, e.target.value)} error={error.additionalHDD[index]} />
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
                    error={error.additionalRAM[index]}
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
                  <Typography sx={{ fontSize: 10, color: 'red' }}>{error.additionalCPU[index]}</Typography>
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
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClosing} color="error">
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
