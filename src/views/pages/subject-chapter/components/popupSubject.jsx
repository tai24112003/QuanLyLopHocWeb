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
      <DialogTitle>Cập nhật môn học</DialogTitle>
      <DialogContent>
        <TextField autoFocus margin="dense" label="Tên môn" type="text" fullWidth value={text} onChange={(e) => setText(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleSave(text);
          }}
          color="primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopupWithTextField;
