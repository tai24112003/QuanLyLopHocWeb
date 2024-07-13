import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Typography, InputLabel, MenuItem, Select } from '@mui/material';
import { gridSpacing } from 'store/constant';

const PopupWithTextField = ({ open, handleClose, handleSave, roomEdit }) => {
    const [data, setData] = useState({
        RoomName: '',
        NumberOfComputers: ''
    });
    const [error, setError] = useState({
        RoomName: '',
        NumberOfComputers: ''
    });

    useEffect(() => {
        if (roomEdit) {
            setData({
                RoomName: roomEdit.RoomName,
                NumberOfComputers: roomEdit.NumberOfComputers
            });
        } else {
            setData({
                RoomName: '',
                NumberOfComputers: ''
            });
        }
    }, [roomEdit]);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle sx={{ fontSize: 20 }}>Nhập thông tin phòng</DialogTitle>
            <DialogContent>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Tên Phòng"
                            type="text"
                            fullWidth
                            value={data.RoomName}
                            onChange={(e) => {
                                if (e.target.value === '') setError({ ...error, RoomName: 'Tên phòng không để trống' });
                                else setError({ ...error, RoomName: '' });
                                setData({ ...data, RoomName: e.target.value });
                            }}
                            onBlur={(e) => {
                                if (data.RoomName === '') setError({ ...error, RoomName: 'Tên phòng không để trống' });
                            }}
                        />
                        <Typography sx={{ fontSize: 10, color: 'red' }}>{error.RoomName}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            margin="dense"
                            label="Số lượng máy"
                            type="number"
                            fullWidth
                            value={data.NumberOfComputers}
                            onChange={(e) => {
                                if (e.target.value === '' || e.target.value < 0) setError({ ...error, NumberOfComputers: 'Số lượng máy không hợp lệ' });
                                else setError({ ...error, NumberOfComputers: '' });
                                setData({ ...data, NumberOfComputers: e.target.value });
                            }}
                        />
                        <Typography sx={{ fontSize: 10, color: 'red' }}>{error.NumberOfComputers}</Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="error">
                    Hủy bỏ
                </Button>
                <Button
                    onClick={() => {
                        if (data.RoomName && data.NumberOfComputers >= 0) {
                            handleSave(data);
                        }
                    }}
                    color="primary"
                >
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PopupWithTextField;
