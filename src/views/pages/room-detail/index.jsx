import React, { useEffect, useState, useMemo } from 'react';
import { Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { getAllRoom, deleteRoom, updateRoom, addRoom, getRoomByID } from 'api/room';
import { Delete, EditNote } from '@mui/icons-material';
import { IconPlus } from '@tabler/icons-react';
import PopupWithTextField from './components/popupRoom';
import { gridSpacing } from 'store/constant';
import useNotification from '../exam/components/Notification';
import { Link, useParams } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import { addComputer, deleteComputer, getComputerByRoomID, updateComputer } from 'api/computer';

const RoomDetailScreen = () => {
  const [data, setData] = useState([]);
  const [openPopup, setOpenPopUp] = useState(false);
  const [nameRoom, setNameRoom] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [computers, setComputers] = useState([]);
  const { showNotification, NotificationComponent } = useNotification();
  const { id } = useParams();

  useEffect(() => {
    getComputerByRoomID(id).then((data) => {
      if (data.data) {
        setData(data.data);
        console.log(data.data);
      }
    });
    getRoomByID(id).then((data) => {
      setNameRoom(data.data);
    });
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'ID',
        header: '#',
        size: 150,
        Cell: ({ cell }) => <Link to="">{cell.getValue()}</Link>
      },
      {
        accessorKey: 'ComputerName',
        header: 'Tên máy',
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
        accessorKey: 'HDD',
        header: 'Bộ nhớ cứng',
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
        accessorKey: 'CPU',
        header: 'Vi xử lí',
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
        accessorKey: 'RAM',
        header: 'Bộ nhớ mềm',
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
                setRoomToDelete(row.original);
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
        await updateComputer(room);
        setData((prevData) => prevData.map((item) => (item.ID === room.ID ? room : item)));
      } else {
        const newRoom = { ...room, RoomID: nameRoom[0]?.RoomID };
        const res = await addComputer(newRoom);
        if (res.success) {
          setData([{ ...res.data }, ...data]);
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
      const res = await deleteComputer({ idRoom: roomToDelete.RoomID, computerID: roomToDelete.ID });
      if (res.status === 'success') {
        setData((prevData) => [...prevData.filter((item) => item.ID !== roomToDelete.ID)]);
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
          <MainCard>
            <Grid container>
              <Grid item xs={6}>
                <Typography>
                  <b>{`Phòng: ` + nameRoom[0]?.RoomName}</b>
                </Typography>
              </Grid>
              <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'end' }}>
                <Button variant="contained" onClick={() => setOpenPopUp(true)}>
                  Thêm máy
                </Button>
              </Grid>
            </Grid>
          </MainCard>
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

      {/* Computers List */}
      {computers.length > 0 && (
        <Grid item xs={12}>
          <h3>Danh sách máy trong phòng {selectedRoom?.RoomName}</h3>
          <MaterialReactTable
            columns={[
              {
                accessorKey: 'ComputerName',
                header: 'Tên máy',
                size: 150
              },
              {
                accessorKey: 'Status',
                header: 'Trạng thái',
                size: 150
              }
            ]}
            data={computers}
          />
        </Grid>
      )}

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

export default RoomDetailScreen;
