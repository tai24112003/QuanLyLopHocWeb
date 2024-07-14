import React, { useEffect, useState, useMemo } from 'react';
import { Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, Select, MenuItem } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { getAllRoom, deleteRoom, updateRoom, addRoom } from 'api/room';
import { Delete, EditNote } from '@mui/icons-material';
import { IconPlus } from '@tabler/icons-react';
import PopupWithTextField from './components/popupStatus';
import { gridSpacing } from 'store/constant';
import useNotification from '../exam/components/Notification';
import { Link } from 'react-router-dom';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getClassesByUserId } from 'api/class';
import { getAttendance, updateAttendance } from 'api/attendance';
import generateId from 'utils/generate-id';

const ManageStudentScreen = () => {
  const [data, setData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [openPopup, setOpenPopUp] = useState(false);
  const [reload, setReload] = useState(1);
  const [classController, setClassController] = useState('-1');
  const [sesstionSelect, setSesstionSelect] = useState(null);
  const { showNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    getClassesByUserId().then((data) => {
      if (data.success) {
        setClasses(data.data);
        setClassController(data?.data[0]?.ClassID);
      }
    });
  }, []);

  useEffect(() => {
    getAttendance(classController).then((data) => {
      if (data.status === 'success') {
        setData(formatAttendanceForUI(data.data));
      }
    });
  }, [classController, reload]);
  const columns = [
    {
      accessorKey: 'id',
      header: 'MSSV',
      size: 50
    },
    {
      accessorKey: 'name',
      header: 'Họ và tên',
      size: 100
    }
  ];

  data[0]?.date?.forEach((item) => {
    columns.push({
      accessorKey: item,
      header: item,
      size: 50,
      Cell: ({ row }) => {
        let styleStatus =
          row.original[item] === 'c'
            ? { backgroundColor: '#00e676', color: 'white' }
            : row.original[item] === 'cp'
              ? { backgroundColor: '#ffe57f', color: 'black' }
              : { backgroundColor: '#f44336', color: 'white' };
        let content = row.original[item] === 'c' ? 'Có' : row.original[item] === 'cp' ? 'Có phép' : 'Vắng';
        return (
          <div
            key={generateId()}
            onClick={(e) => {
              setSesstionSelect({ mssv: row.original.id, sessionId: row.original.SessionID, currentStatus: row.original[item] });
              setOpenPopUp(true);
            }}
            style={{ ...styleStatus, padding: '0 10px', display: 'inline-block', borderRadius: 10 }}
          >
            {content}
          </div>
        );
      }
    });
  });

  const formatAttendanceForUI = (attendanceData) => {
    const studentMap = {};

    attendanceData.forEach(({ StudentID, FirstName, LastName, Present, StartTime, SessionID }) => {
      const date = new Date(StartTime).toLocaleDateString(); // Extract date

      if (!studentMap[StudentID]) {
        studentMap[StudentID] = {
          id: StudentID,
          SessionID,
          name: `${LastName} ${FirstName}`,
          date: []
        };
      }
      if (!studentMap[StudentID].date.includes(date)) {
        studentMap[StudentID].date.push(date);
      }

      studentMap[StudentID][date] = Present;
    });

    return Object.values(studentMap);
  };

  const table = useMaterialReactTable({
    columns,
    data
  });

  const handleClose = () => {
    setOpenPopUp(false);
  };

  const handleSave = (data) => {
    console.log(data);
    updateAttendance({ StudentID: data.mssv, SessionID: data.sessionId, Present: data.currentStatus }).then((data) => {
      if (data.status === 'success') {
        setReload((prev) => {
          return prev + 1;
        });

        setTimeout(() => showNotification('cập nhật thành công', 'success'), 0);
      }
    });
    setOpenPopUp(false);
  };

  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} md={6} sm={0} lg={3}>
          <Select
            value={classController}
            onChange={(e) => {
              setClassController(e.target.value);
            }}
            sx={{ width: '100%' }}
          >
            <MenuItem value="-1">Chọn lớp</MenuItem>
            {classes.map((item) => (
              <MenuItem key={item.ClassID} value={item.ClassID}>
                {item.ClassName}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={0} md={6} sm={0} lg={9}></Grid>
        <Grid item xs={12}>
          <MaterialReactTable table={table} />
        </Grid>
      </Grid>
      <NotificationComponent></NotificationComponent>
      <PopupWithTextField
        handleSave={handleSave}
        sessionEdit={sesstionSelect}
        open={openPopup}
        handleClose={handleClose}
      ></PopupWithTextField>
    </>
  );
};

export default ManageStudentScreen;
