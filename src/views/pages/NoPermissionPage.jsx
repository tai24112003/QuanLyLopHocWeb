import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import config from 'config';

const NoPermissionPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(config.defaultPath);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8
        }}
      >
        <Typography variant="h3" color="error">
          403
        </Typography>
        <Typography variant="h5" gutterBottom>
          Không có quyền truy cập
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          Bạn không có quyền truy cập vào trang này. Vui lòng quay lại trang chủ hoặc liên hệ với quản trị viên nếu bạn nghĩ rằng đây là
          lỗi.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleBack}>
          Quay lại
        </Button>
      </Box>
    </Container>
  );
};

export default NoPermissionPage;
