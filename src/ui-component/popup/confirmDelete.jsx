import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ConfirmationDialog = ({ open, handleClose, handleConfirm }) => {
  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">
        <span style={{ fontSize: 15 }}>{'Xác nhận xóa'}</span>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">Bạn chắc chắn muốn xóa?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} size="small" color="primary">
          Không
        </Button>
        <Button onClick={handleConfirm} size="small" color="error" autoFocus>
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const App = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    // Thực hiện hành động xóa ở đây
    console.log('Item deleted');
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="error" onClick={handleClickOpen}>
        Delete Item
      </Button>
      <ConfirmationDialog open={open} handleClose={handleClose} handleConfirm={handleConfirm} />
    </div>
  );
};

export default ConfirmationDialog;
