import React, { useEffect, useState, useMemo } from 'react';
import { Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { getAllRoom, deleteRoom, updateRoom, addRoom } from 'api/room';
import { Delete, EditNote } from '@mui/icons-material';
import { IconPlus } from '@tabler/icons-react';
import PopupWithTextField from './components/popupRoom';
import { gridSpacing } from 'store/constant';
import useNotification from '../exam/components/Notification';
import { Link } from 'react-router-dom';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const ManageStudentScreen = () => {
  const [data, setData] = useState([]);
  const [openPopup, setOpenPopUp] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [computers, setComputers] = useState([]);
  const { showNotification, NotificationComponent } = useNotification();
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getAllRoom();
        if (response.status === 'success') {
          setData(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchRooms();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'RoomName',
        header: 'MSSV',
        size: 150,
        Cell: ({ row }) => (
          <Link to={`/room/${row.original.RoomID}`} underline="none" color="primary">
            {row.original.RoomName}
          </Link>
        )
      },
      {
        accessorKey: 'StandardHDD',
        header: 'Họ',
        size: 150,
        Cell: ({ cell }) => (
          <div>
            {cell
              .getValue()
              .split('|')
              .map((ram, index) => (
                <div key={index}>{ram.toUpperCase()}</div>
              ))}
          </div>
        )
      },
      {
        accessorKey: 'StandardCPU',
        header: 'Tên',
        size: 150,
        Cell: ({ cell }) => (
          <div>
            {cell
              .getValue()
              .split('|')
              .map((ram, index) => (
                <div key={index}>{ram.toUpperCase()}</div>
              ))}
          </div>
        )
      },
      {
        accessorKey: 'StandardRAM',
        header: 'Trạng thái',
        size: 150,
        Cell: ({ cell }) => (
          <div>
            {cell
              .getValue()
              .split('|')
              .map((ram, index) => (
                <div key={index}>{ram.toUpperCase()}</div>
              ))}
          </div>
        )
      },
      {
        accessorKey: 'actions',
        header: 'Thao tác',
        size: 150,
        Cell: ({ row }) => (
          <>
            <Button
              size="small"
              onClick={() => {
                setSelectedRoom(row.original);
                setOpenPopUp(true);
              }}
              color="warning"
              sx={{ margin: 0.5 }}
              variant="contained"
            >
              <EditNote />
            </Button>
            <Button
              onClick={() => {
                setRoomToDelete(row.original.RoomID);
                setOpenConfirm(true);
              }}
              sx={{ margin: 0.5 }}
              size="small"
              color="error"
              variant="contained"
            >
              <Delete />
            </Button>
          </>
        )
      }
    ],
    []
  );

  const handleSave = async (room) => {
    try {
      if (selectedRoom) {
        await updateRoom(room);
        setData((prevData) => prevData.map((item) => (item.RoomName === room.RoomName ? room : item)));
      } else {
        const newRoom = { ...room, Status: 'Trống' };
        const res = await addRoom(newRoom);
        if (res.success) {
          setData([...data, { ...res.data }]);
          setTimeout(() => showNotification('Thêm thành công', 'success'), 10);
        }
      }
      setOpenPopUp(false);
      setSelectedRoom(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteRoom(roomToDelete);
      if (res.status === 'success') {
        setData((prevData) => [...prevData.filter((item) => item.RoomID !== roomToDelete)]);
        setTimeout(() => showNotification('Xóa thành công', 'success'), 10);
      }
      setOpenConfirm(false);
      setRoomToDelete(null);
    } catch (error) {
      console.error(error);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data
  });

  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <DatePicker
                  label="Chọn ngày"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12}>
          <PopupWithTextField
            open={openPopup}
            handleClose={() => {
              setOpenPopUp(false);
              setSelectedRoom(null);
            }}
            handleSave={handleSave}
            roomEdit={selectedRoom}
          />
        </Grid>
        <Grid item xs={12}>
          <MaterialReactTable table={table} />
        </Grid>
      </Grid>

      {/* Confirm Delete Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <div>Bạn có chắc chắn muốn xóa phòng này không?</div>
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
      <NotificationComponent></NotificationComponent>
    </>
  );
};

export default ManageStudentScreen;
