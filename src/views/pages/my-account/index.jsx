import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Grid, TextField, Link } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { runUpdateUser } from 'api/user';
import { SET_USER } from 'store/actions';
import useNotification from '../exam/components/Notification';
import ChangePasswordPopup from './components/changePassPopup';
import { runGetUser } from 'api/auth';

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('Họ và tên không được để trống').min(2, 'Họ và tên quá ngắn'),
  email: Yup.string().email('Email không hợp lệ').required('Email không được để trống'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Số điện thoại phải gồm 10 chữ số')
    .required('Số điện thoại không được để trống')
});

const ProfilePage = () => {
  const [data, setData] = useState(null);
  const [isPopupOpen, setPopupOpen] = useState(false); // State quản lý popup
  const dispatch = useDispatch();
  const { showNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    runGetUser().then((data) => {
      if (data.status === 'success') {
        setData(data.data[0]);
      }
    });
  }, []);

  const handleSubmit = (values) => {
    runUpdateUser(values)
      .then((data) => {
        if (data.success) {
          dispatch({
            type: SET_USER,
            user: {
              id: data.data.id,
              name: data.data.name,
              email: data.data.email,
              phone: data.data.phone,
              role: data.data.role
            }
          });
          showNotification('Cập nhật thành công!', 'success');
        } else {
          showNotification('Cập nhật không thành công!', 'error');
        }
      })
      .catch((e) => showNotification('Cập nhật không thành công!', 'error'));
  };

  return (
    <Box sx={{ maxWidth: 600, margin: '50px auto' }}>
      <Card>
        <CardHeader
          title="Quản Lý Thông Tin Cá Nhân"
          action={
            <Link
              component="button"
              onClick={() => setPopupOpen(true)} // Mở popup khi nhấn
              underline="hover"
              sx={{ fontSize: '0.875rem' }}
            >
              Đổi Mật Khẩu
            </Link>
          }
        />
        <CardContent>
          {data && (
            <Formik initialValues={data} validationSchema={ProfileSchema} onSubmit={handleSubmit}>
              {({ errors, touched }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Họ và Tên"
                        name="name"
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Email"
                        name="email"
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        as={TextField}
                        fullWidth
                        label="Số Điện Thoại"
                        name="phone"
                        error={touched.phone && Boolean(errors.phone)}
                        helperText={touched.phone && errors.phone}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Field disabled as={TextField} fullWidth label="Quyền" name="role" />
                    </Grid>
                    <Grid item xs={12}>
                      <Button type="submit" variant="contained" color="primary" fullWidth>
                        Lưu Thay Đổi
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          )}
        </CardContent>
      </Card>
      <NotificationComponent />
      <ChangePasswordPopup open={isPopupOpen} onClose={() => setPopupOpen(false)} showNotification={showNotification} />
    </Box>
  );
};

export default ProfilePage;
