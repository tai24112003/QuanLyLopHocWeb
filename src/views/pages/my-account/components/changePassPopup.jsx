import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, TextField } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { runUpdateUser } from 'api/user';
import { useSelector } from 'react-redux';

const ChangePasswordSchema = Yup.object().shape({
  newPassword: Yup.string().required('Mật khẩu mới không được để trống').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Xác nhận mật khẩu không khớp')
    .required('Xác nhận mật khẩu không được để trống')
});

const ChangePasswordPopup = ({ open, onClose, showNotification }) => {
  const user = useSelector((state) => state.customization.user);
  const handleSubmit = (values) => {
    runUpdateUser({ id: user.id, password: values.newPassword })
      .then((data) => {
        if (data.success) {
          showNotification('Cập nhật thành công!', 'success');
        } else {
          showNotification('Cập nhật không thành công!', 'error');
        }
      })
      .catch((e) => showNotification('Cập nhật không thành công!', 'error'));
    onClose(); // Đóng popup sau khi xử lý
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}>Đổi Mật Khẩu</DialogTitle>
      <Formik initialValues={{ newPassword: '', confirmPassword: '' }} validationSchema={ChangePasswordSchema} onSubmit={handleSubmit}>
        {({ errors, touched }) => (
          <Form>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Mật khẩu mới"
                    name="newPassword"
                    type="password"
                    error={touched.newPassword && Boolean(errors.newPassword)}
                    helperText={touched.newPassword && errors.newPassword}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    type="password"
                    error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="secondary">
                Hủy
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Đổi Mật Khẩu
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ChangePasswordPopup;
