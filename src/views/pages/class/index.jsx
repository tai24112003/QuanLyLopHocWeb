import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, Select, MenuItem } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { getAllRoom, deleteRoom, updateRoom, addRoom } from 'api/room';
import { Delete, EditNote } from '@mui/icons-material';
import { IconPlus } from '@tabler/icons-react';
import PopupWithTextField from './components/popupStatus';
import { gridSpacing } from 'store/constant';
import { Link } from 'react-router-dom';
import { deleteClass, getClassesByUserId, updateClass } from 'api/class';
import { getAttendance, updateAttendance } from 'api/attendance';
import generateId from 'utils/generate-id';
import CustomTable from 'ui-component/table/Table';
import { Box } from '@mui/system';
import NotificationComponent from 'ui-component/notification/NotificationComponent';
import { parse, format } from 'date-fns';
import { useSelector } from 'react-redux';

const ClassScreen = () => {
  const [data, setData] = useState([]);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPopup, setOpenPopUp] = useState(false);
  const [reload, setReload] = useState(1);
  const [sesstionSelect, setSesstionSelect] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const user = useSelector((state) => {
    return state.customization.user;
  });

  useEffect(() => {
    getClassesByUserId().then((data) => {
      if (data.success) {
        setData(data.data);
      }
    });
  }, [reload]);
  const columns = [
    {
      accessorKey: 'ClassID',
      header: 'STT',
      size: 50
    },
    {
      accessorKey: 'ClassName',
      header: 'Lớp',
      size: 100
    },
    {
      accessorKey: 'Status',
      header: 'Trạng thái',
      size: 50,
      Cell: ({ row }) => {
        let styleStatus = row.original.Status
          ? { bgcolor: 'success.dark', color: 'primary.light' }
          : { bgcolor: 'error.main', color: 'text.primary' };

        let content = row.original.Status ? 'Còn khóa' : 'Đã kết thúc khóa';
        return (
          <Box
            key={generateId()}
            onClick={(e) => {
              if (user.id !== row.original.UserID) return;
              setSesstionSelect({ ClassID: row.original.ClassID, Status: row.original.Status });
              setOpenPopUp(true);
            }}
            style={{ padding: '0 10px', display: 'inline-block', borderRadius: 10, cursor: 'pointer' }}
            sx={styleStatus}
          >
            {content}
          </Box>
        );
      }
    },
    {
      accessorKey: 'actions',
      header: 'Thao tác',
      size: 150,
      Cell: ({ row }) => (
        <Button
          onClick={() => {
            setRoomToDelete(row.original.ClassID);
            setOpenConfirm(true);
          }}
          sx={{ margin: 0.5 }}
          size="small"
          color="error"
          variant="contained"
          disabled={user.id !== row.original.UserID || row.original.Status}
        >
          <Delete />
        </Button>
      )
    }
  ];

  const handleClose = () => {
    setOpenPopUp(false);
  };

  const handleDelete = async () => {
    try {
      const res = await deleteClass(roomToDelete);
      if (res.success) {
        setReload((prev) => {
          return prev + 1;
        });
        setTimeout(() => setNotification({ open: true, message: 'Xóa thành công!', severity: 'success' }), 10);
      }
      setOpenConfirm(false);
      setRoomToDelete(null);
    } catch (error) {
      setTimeout(() => setNotification({ open: true, message: 'Xóa không thành công!', severity: 'error' }), 10);
    }
  };

  const handleSave = (data) => {
    updateClass(data.ClassID, { status: data.Status })
      .then((data) => {
        if (data.success) {
          setReload((prev) => {
            return prev + 1;
          });
          setNotification({ open: true, message: 'Cập nhật thành công!', severity: 'success' });
        } else {
          setNotification({ open: true, message: 'Cập nhật không thành công!', severity: 'error' });
        }
      })
      .catch((e) => {
        setNotification({ open: true, message: 'Cập nhật không thành công!', severity: 'error' });
      });
    setOpenPopUp(false);
  };

  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={0} md={6} sm={0} lg={9}></Grid>
        <Grid item xs={12}>
          <CustomTable columns={columns} data={data} />
        </Grid>
      </Grid>
      <PopupWithTextField
        handleSave={handleSave}
        sessionEdit={sesstionSelect}
        open={openPopup}
        handleClose={handleClose}
      ></PopupWithTextField>
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <div>Bạn có chắc chắn muốn xóa lớp này không?</div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDelete} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
      <NotificationComponent notification={notification} />
    </>
  );
};

export default ClassScreen;
