import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';

import { gapGrid, gridSpacing } from 'store/constant';
import { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { runGetExams } from 'api/exam';
import { runAddUser, runGetAllUser, runToggleUserStatus, runUpdateUser } from 'api/user';
import { Button, Card, CardActions, CardContent, TextField, Tooltip, Typography } from '@mui/material';
import { Delete, EditNote, Lock, Undo, CheckCircle } from '@mui/icons-material';
import { IconPlus } from '@tabler/icons-react';
import PopupWithTextField from './components/popupAccount';
import useNotification from '../exam/components/Notification';
import { useSelector } from 'react-redux';
import CustomTable from 'ui-component/table/Table';
import { runGetSessionComputerById, runGetSessionComputerWithMismatch, runUpdateMaintainTime } from 'api/session_computer';
import { useTheme } from '@emotion/react';
import { updateComputer } from 'api/computer';
import ConfirmationDialog from 'ui-component/popup/confirmDelete';

// ==============================|| DEFAULT DASHBOARD ||============================== //
const DetailMaintainScreen = () => {
  const [data, setData] = useState();
  const [openPopup, setOpenPopUp] = useState(false);
  const [reload, setReload] = useState(1);
  const [selectComputer, setSelectComputer] = useState();
  const { showNotification, NotificationComponent } = useNotification();
  const theme = useTheme();
  const { id } = useParams();

  useEffect(() => {
    runGetSessionComputerById(id)
      .then((data) => {
        console.log(data.data.SessionID);
        if (data.success) setData(data.data);
      })
      .catch((e) => console.log(e));
  }, [reload]);
  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'STT',
        size: 50,
        Cell: ({ row }) => row.index + 1,
        enableSorting: false
      },
      {
        accessorKey: 'Computer',
        header: 'Tên máy',
        size: 150,
        Cell: ({ row }) => row.original.Computer.ComputerName
      },
      {
        accessorKey: 'MismatchInfo',
        header: 'Thông tin không khớp',
        size: 200,
        Cell: ({ row }) => <span style={{ color: theme.palette.error.main }}>{row.original.MismatchInfo}</span>
      },
      {
        accessorKey: 'maintenanceTime',
        header: 'Trạng thái',
        size: 200,
        Cell: ({ row }) => {
          let styles = row.original.maintenanceTime
            ? { backgroundColor: '#00e676', color: 'white', title: `Đã bảo trì` }
            : { backgroundColor: '#ffe57f', color: 'black', title: 'Chưa bảo trì' };
          return <span style={{ ...styles, padding: '0 10px', display: 'inline-block', borderRadius: 10 }}>{styles.title}</span>;
        }
      },
      // {
      //   accessorKey: 'MouseConnected',
      //   header: 'Chuột',
      //   size: 200,
      //   Cell: ({ row }) => {
      //     let styleRole = row.original.KeyboardConnected
      //       ? { backgroundColor: '#00e676', color: 'white', title: 'Kết nối' }
      //       : { backgroundColor: '#ffe57f', color: 'black', title: 'Không kết nối' };
      //     return <div style={{ ...styleRole, padding: '0 10px', display: 'inline-block', borderRadius: 10 }}>{styleRole.title}</div>;
      //   }
      // },
      {
        accessorKey: 'duration',
        header: 'Thao tác',
        size: 150,
        Cell: ({ row }) => {
          return (
            <>
              <Tooltip title="Cập nhật thông tin không khớp thành thông tin mặc định của máy">
                <Button
                  onClick={(e) => {
                    setOpenPopUp(true);
                    setSelectComputer(row.original);
                  }}
                  sx={{ margin: 0.5 }}
                  size="small"
                  color="warning"
                  variant="contained"
                >
                  <EditNote />
                </Button>
              </Tooltip>
              <Tooltip
                title={row.original.maintenanceTime ? 'Cập nhật trạng thái thành chưa bảo trì' : 'Cập nhật trạng thái thành đã bảo trì'}
              >
                <Button
                  size="small"
                  onClick={(e) => {
                    runUpdateMaintainTime({ id: row.original.ID, maintenanceTime: row.original.maintenanceTime ? null : Date.now() }).then(
                      (res) => {
                        if (res.success) {
                          setReload((prev) => prev + 1);
                          showNotification('Cập nhật thành công!', 'success');
                        }
                      }
                    );
                  }}
                  color="success"
                  sx={{ margin: 0.5 }}
                  variant="outlined"
                >
                  {!row.original.maintenanceTime ? <CheckCircle /> : <Undo />}
                </Button>
              </Tooltip>
            </>
          );
        }
      }
    ],
    []
  );

  const handleClosePopup = () => {
    setOpenPopUp(false);
  };

  const handleConfirm = () => {
    updateComputer(selectComputer).then((res) => {
      if (res.success) {
        runUpdateMaintainTime({ id: selectComputer.ID, maintenanceTime: Date.now() }).then((res) => {
          if (res.success) {
            setReload((prev) => prev + 1);
            showNotification('Cập nhật thành công!', 'success');
          }
        });
      }
    });
    setOpenPopUp(false);
  };

  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card sx={{ margin: 'auto' }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Thông số
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thông số của máy {data?.Computer?.ComputerName}
              </Typography>
              <Grid container style={{ marginTop: 10 }} spacing={gridSpacing}>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={12} sm={1.5}>
                      <Typography color="primary">Vi xử lí:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={10.5}>
                      <Typography>{data?.CPU}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={12} sm={1.5}>
                      <Typography color="primary">RAM:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={10.5}>
                      <Typography>{data?.RAM}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={12} sm={1.5}>
                      <Typography color="primary">Ổ đĩa:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={10.5}>
                      <Typography>{data?.HDD}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={3} sm={1.5}>
                      <Typography color="primary">Chuột:</Typography>
                    </Grid>
                    <Grid item xs={9} sm={2.5}>
                      <Typography>
                        {data?.MouseConnected ? (
                          <span style={{ borderRadius: 10, backgroundColor: theme.palette.success.main }}>'Kết nối'</span>
                        ) : (
                          <span style={{ borderRadius: 10, backgroundColor: theme.palette.warning.main, padding: 5 }}>Không kết nối</span>
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={3} sm={1.5}>
                      <Typography color="primary">Bàn phím:</Typography>
                    </Grid>
                    <Grid item xs={9} sm={2.5}>
                      <Typography>
                        {data?.KeyboardConnected ? (
                          <span style={{ borderRadius: 10, backgroundColor: theme.palette.success.main }}>'Kết nối'</span>
                        ) : (
                          <span style={{ borderRadius: 10, backgroundColor: theme.palette.warning.main, padding: 5 }}>Không kết nối</span>
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={3} sm={1.5}>
                      <Typography color="primary">Màn hình:</Typography>
                    </Grid>
                    <Grid item xs={9} sm={2.5}>
                      <Typography>
                        {data?.MonitorConnected ? (
                          <span style={{ borderRadius: 10, backgroundColor: theme.palette.success.main }}>'Kết nối'</span>
                        ) : (
                          <span style={{ borderRadius: 10, backgroundColor: theme.palette.warning.main, padding: 5 }}>Không kết nối</span>
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item sm={1.5} xs={3}>
                      <Typography color="primary">Trạng thái:</Typography>
                    </Grid>
                    <Grid item xs={9} sm={10.5}>
                      <Typography>
                        {data?.maintenanceTime ? (
                          <span style={{ borderRadius: 10, backgroundColor: theme.palette.success.main, padding: 5 }}>Đã bảo trì</span>
                        ) : (
                          <span style={{ borderRadius: 10, backgroundColor: theme.palette.warning.main, padding: 5 }}>Chưa bảo trì</span>
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item sm={1.5} xs={3}>
                      <Typography color="primary">Người dùng:</Typography>
                    </Grid>
                    <Grid item xs={9} sm={10.5}>
                      <Typography>
                        <span
                          style={{
                            borderRadius: 10,
                            backgroundColor: theme.palette.primary.main,
                            padding: 5,
                            color: theme.palette.primary.light
                          }}
                        >
                          {data?.StudentID}
                        </span>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography color="primary">Thông tin thay đổi:</Typography>
                    </Grid>
                    <Grid item xs={9} sm={10.5}>
                      <Typography color="error">{data?.MismatchInfo}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                variant="outlined"
                color="success"
                onClick={(e) => {
                  runUpdateMaintainTime({ id: data.ID, maintenanceTime: data.maintenanceTime ? null : Date.now() }).then((res) => {
                    if (res.success) {
                      setReload((prev) => prev + 1);
                      showNotification('Cập nhật thành công!', 'success');
                    }
                  });
                }}
              >
                {!data?.maintenanceTime ? 'Cập nhật đã bảo trì' : 'Cập nhật chưa bảo trì'}
              </Button>
              {!data?.maintenanceTime && (
                <Button
                  size="small"
                  variant="contained"
                  onClick={(e) => {
                    setSelectComputer(data);
                    setOpenPopUp(true);
                  }}
                >
                  Cập nhật thành mặc định
                </Button>
              )}
            </CardActions>
          </Card>
        </Grid>
        <ConfirmationDialog
          label="Xác nhận cập nhật"
          confirmName="Xác nhận"
          title="Bạn chắc chắn muốn lấy cấu hình này cập nhật làm mặc định cho máy?"
          open={openPopup}
          handleClose={handleClosePopup}
          handleConfirm={handleConfirm}
        />
      </Grid>
      <NotificationComponent />
    </>
  );
};

export default DetailMaintainScreen;
