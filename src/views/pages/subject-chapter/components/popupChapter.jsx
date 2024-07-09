import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { Select, MenuItem, FormControl } from '@mui/material';

const PopupWithTextFieldChapter = ({ open, handleClose, handleSave, chapterEdit, options }) => {
  const [text, setText] = useState('');
  const [selectedValue, setSelectedValue] = useState('');

  useEffect(() => {
    if (open) {
      setText(chapterEdit?.name ?? '');
      setSelectedValue(chapterEdit?.subject_id ?? options[0]?.id);
    }
  }, [open, chapterEdit]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        <b>Cập nhật chương</b>
      </DialogTitle>
      <DialogContent>
        <TextField autoFocus margin="dense" label="Tên môn" type="text" fullWidth value={text} onChange={(e) => setText(e.target.value)} />
        <FormControl fullWidth margin="dense">
          <Select
            disabled={!chapterEdit?.canRemove && chapterEdit}
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
          >
            {options?.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleSave({ text, selectedValue });
          }}
          color="primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopupWithTextFieldChapter;
