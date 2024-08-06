import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

const PopupWithTextField = ({ open, handleClose, handleSave, subjectEdit }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    if (open) setText(subjectEdit?.name ?? '');
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Cập nhật chủ đề</DialogTitle>
      <DialogContent>
        <TextField
          inputProps={{
            maxLength: 50
          }}
          autoFocus
          margin="dense"
          label="Tên Chủ đề"
          type="text"
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">
          Hủy
        </Button>
        <Button
          onClick={() => {
            handleSave(text);
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
