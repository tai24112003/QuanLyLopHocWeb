import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { gridSpacing } from 'store/constant';
import { isEmailValid, isPhoneNumberValid } from 'views/utilities/common';
import { Password } from '@mui/icons-material';

const PopupWithTextField = ({ open, handleClose, handleSave, subjectEdit }) => {
  const [data, setData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    role: 'GV'
  });
  const [error, setError] = useState({
    name: '',
    email: '',
    phone: '',
    passwordConfirm: '',
    password: ''
  });
  useEffect(() => {
    if (open) {
      setData(subjectEdit ? subjectEdit : { name: '', email: '', phone: '', password: '', passwordConfirm: '', role: 'GV' });
      setError({
        name: '',
        email: '',
        phone: '',
        passwordConfirm: '',
        password: ''
      });
    }
  }, [open]);

  const onSubmit = () => {
    if (data.name === '') {
      setError({ ...error, name: 'Tên không bỏ trống' });
      return;
    }
    if (data.email === '') {
      setError({ ...error, email: 'Email không bỏ trống' });
      return;
    }
    if (data.phone === '') {
      setError({ ...error, phone: 'Số điện thoại không bỏ trống' });
      return;
    }
    if (data.passwordConfirm !== data.password) {
      setError({ ...error, passwordConfirm: 'Mật khẩu xác nhận không khớp' });
      return;
    }
    if (data.password && data.password.length < 8) {
      setError({ ...error, password: 'Mật khẩu phải trên 8 kí tự' });
      return;
    }
    if (!subjectEdit && data.password === '') {
      setError({ ...error, password: 'Mật khẩu không bỏ trống' });
      return;
    }
    if (error.name === '' && error.password === '' && error.email === '' && error.passwordConfirm === '' && error.phone === '')
      handleSave(data);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle sx={{ fontSize: 20 }}>Nhập thông tin tài khoản</DialogTitle>
      <DialogContent>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextField
              autoFocus
              margin="dense"
              label="Tên"
              type="text"
              fullWidth
              value={data.name}
              onChange={(e) => {
                if (e.target.value === '') setError({ ...error, name: 'Tên không để trống' });
                else setError({ ...error, name: '' });
                setData({ ...data, name: e.target.value });
              }}
              onBlur={(e) => {
                if (data.name === '') setError({ ...error, name: 'Tên không để trống' });
              }}
            />
            <Typography sx={{ fontSize: 10, color: 'red' }}>{error.name}</Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              value={data.email}
              onChange={(e) => {
                if (!isEmailValid(e.target.value)) setError({ ...error, email: 'Email không hợp lệ' });
                else setError({ ...error, email: '' });
                setData({ ...data, email: e.target.value });
              }}
            />
            <Typography sx={{ fontSize: 10, color: 'red' }}>{error.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              margin="dense"
              label="Số điện thoại"
              type="text"
              fullWidth
              value={data.phone}
              onChange={(e) => {
                if (!isPhoneNumberValid(e.target.value)) setError({ ...error, phone: 'Số điện thoại không hợp lệ' });
                else setError({ ...error, phone: '' });
                setData({ ...data, phone: e.target.value });
              }}
            />
            <Typography sx={{ fontSize: 10, color: 'red' }}>{error.phone}</Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              margin="dense"
              label="Mật khẩu"
              type="password"
              fullWidth
              value={data.password}
              onChange={(e) => {
                setError({ ...error, password: '' });
                setData({ ...data, password: e.target.value });
              }}
            />
            <Typography sx={{ fontSize: 10, color: 'red' }}>{error.password}</Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              margin="dense"
              label="Xác nhận mật khẩu"
              type="password"
              fullWidth
              value={data.passwordConfirm}
              onChange={(e) => {
                setError({ ...error, passwordConfirm: '' });
                setData({ ...data, passwordConfirm: e.target.value });
              }}
            />
            <Typography sx={{ fontSize: 10, color: 'red' }}>{error.passwordConfirm}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <InputLabel>Vai trò</InputLabel>
            <Select onChange={(e) => setData({ ...data, role: e.target.value })} value={data.role} fullWidth>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="GV">Giáo viên</MenuItem>
              <MenuItem value="TK">Trưởng khoa</MenuItem>
              <MenuItem value="PK">Phó khoa</MenuItem>
              <MenuItem value="MT">Bảo trì</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">
          Cancel
        </Button>
        <Button
          onClick={() => {
            onSubmit();
          }}
          color="primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopupWithTextField;
