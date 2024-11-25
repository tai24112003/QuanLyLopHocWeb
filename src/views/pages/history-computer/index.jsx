import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

import { gridSpacing } from 'store/constant';
import { useMemo } from 'react';
import { useMaterialReactTable } from 'material-react-table';
import { Button, Card, CardContent, Tooltip, Typography } from '@mui/material';
import { EditNote, Undo, CheckCircle } from '@mui/icons-material';
import useNotification from '../exam/components/Notification';
import CustomTable from 'ui-component/table/Table';
import { runGetSessionComputerByComputerId, runGetSessionComputerWithMismatch, runUpdateMaintainTime } from 'api/session_computer';
import { useTheme } from '@emotion/react';
import { getComputerByID, updateComputer } from 'api/computer';
import ConfirmationDialog from 'ui-component/popup/confirmDelete';
import { Link, useParams } from 'react-router-dom';

// ==============================|| DEFAULT DASHBOARD ||============================== //
const HistoryComputerScreen = () => {
  const [data, setData] = useState([]);
  const [computer, setComputer] = useState();
  const [openPopup, setOpenPopUp] = useState(false);
  const [reload, setReload] = useState(1);
  const [selectComputer, setSelectComputer] = useState();
  const { showNotification, NotificationComponent } = useNotification();
  const theme = useTheme();
  const { id } = useParams();

  useEffect(() => {
    runGetSessionComputerByComputerId(id)
      .then((data) => {
        if (data.success) setData(data.data);
      })
      .catch((e) => console.log(e));
    getComputerByID(id)
      .then((data) => {
        if (data.success) setComputer(data.data);
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
        accessorKey: 'CPU',
        header: 'CPU',
        size: 150
      },
      {
        accessorKey: 'HDD',
        header: 'HDD',
        size: 150
      },
      {
        accessorKey: 'RAM',
        header: 'RAM',
        size: 150
      },
      {
        accessorKey: 'MismatchInfo',
        header: 'Thông tin không khớp',
        size: 200,
        Cell: ({ row }) => (
          <Link to={`/maintain/${row.original.ID}`} style={{ color: theme.palette.error.main }}>
            <span style={{ color: theme.palette.error.main }}>{row.original.MismatchInfo}</span>
          </Link>
        )
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

  const table = useMaterialReactTable({
    columns,
    data
  });

  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card sx={{ margin: 'auto' }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Thông số của máy {computer?.ComputerName}
              </Typography>
              <Grid container style={{ marginTop: 10 }} spacing={gridSpacing}>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={12} sm={1.5}>
                      <Typography color="primary">Vi xử lí:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={10.5}>
                      <Typography>{computer?.CPU}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={12} sm={1.5}>
                      <Typography color="primary">RAM:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={10.5}>
                      <Typography>{computer?.RAM}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={12} sm={1.5}>
                      <Typography color="primary">Ổ đĩa:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={10.5}>
                      <Typography>{computer?.HDD}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <CustomTable label="Lịch sử" des={`Lịch sử thay đổi của máy ${computer?.ComputerName}`} data={data} columns={columns} />
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

export default HistoryComputerScreen;
