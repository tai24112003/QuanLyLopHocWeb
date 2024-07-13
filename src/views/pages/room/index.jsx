import { useEffect, useMemo, useState } from 'react';
import { Grid, Button, Typography } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Delete, EditNote, Lock } from '@mui/icons-material';
import { IconPlus } from '@tabler/icons-react';
import { runGetAllRooms, runDeleteRoom, runUpdateRoom, runAddRoom } from 'api/room';
import PopupWithTextField from './components/popupRoom';
import { gridSpacing } from 'store/constant';

const RoomListScreen = () => {
    const [data, setData] = useState([]);
    const [openPopup, setOpenPopup] = useState(false);
    const [selectRoom, setSelectRoom] = useState(null);

    useEffect(() => {
        runGetAllRooms()
            .then((data) => {
                if (data.success) setData(data.data);
            })
            .catch((e) => console.log(e));
    }, []);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'RoomID',
                header: 'ID Phòng',
                size: 50
            },
            {
                accessorKey: 'RoomName',
                header: 'Tên Phòng',
                size: 150
            },
            {
                accessorKey: 'NumberOfComputers',
                header: 'Số lượng máy',
                size: 150
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
                                setSelectRoom(row.original);
                                setOpenPopup(true);
                            }}
                            color="warning"
                            sx={{ margin: 0.5 }}
                            variant="contained"
                        >
                            <EditNote />
                        </Button>
                        <Button
                            onClick={() => handleDeleteRoom(row.original.RoomID)}
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

    const handleDeleteRoom = (roomID) => {
        runDeleteRoom(roomID)
            .then((response) => {
                if (response.success) {
                    setData(data.filter((room) => room.RoomID !== roomID));
                } else {
                    console.error(response.message);
                }
            })
            .catch((e) => console.log(e));
    };

    const handleSaveRoom = (room) => {
        if (selectRoom) {
            runUpdateRoom(selectRoom.RoomID, room)
                .then((response) => {
                    if (response.success) {
                        setData(data.map((r) => (r.RoomID === selectRoom.RoomID ? response.data : r)));
                        setOpenPopup(false);
                        setSelectRoom(null);
                    } else {
                        console.error(response.message);
                    }
                })
                .catch((e) => console.log(e));
        } else {
            runAddRoom(room)
                .then((response) => {
                    if (response.success) {
                        setData([...data, response.data]);
                        setOpenPopup(false);
                    } else {
                        console.error(response.message);
                    }
                })
                .catch((e) => console.log(e));
        }
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
        setSelectRoom(null);
    };

    const table = useMaterialReactTable({
        columns,
        data
    });

    return (
        <>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Button onClick={() => setOpenPopup(true)} variant="contained">
                        <IconPlus />
                        Thêm phòng
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <MaterialReactTable table={table} />
                </Grid>
                <PopupWithTextField roomEdit={selectRoom} handleSave={handleSaveRoom} handleClose={handleClosePopup} open={openPopup} />
            </Grid>
        </>
    );
};

export default RoomListScreen;
