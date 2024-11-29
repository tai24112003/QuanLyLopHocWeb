import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Button, Grid, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, Select, MenuItem } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { getAllRoom, deleteRoom, updateRoom, addRoom } from 'api/room';
import { Delete, EditNote } from '@mui/icons-material';
import { IconPlus } from '@tabler/icons-react';
import PopupWithTextField from './components/popupStatus';
import { gridSpacing } from 'store/constant';
import { Link } from 'react-router-dom';
import { getClassesByUserId } from 'api/class';
import { getAttendance, updateAttendance } from 'api/attendance';
import generateId from 'utils/generate-id';
import CustomTable from 'ui-component/table/Table';
import { Box } from '@mui/system';
import NotificationComponent from 'ui-component/notification/NotificationComponent';
import { parse, format } from 'date-fns';

const ManageStudentScreen = () => {
  const [data, setData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [openPopup, setOpenPopUp] = useState(false);
  const [reload, setReload] = useState(1);
  const [classController, setClassController] = useState('-1');
  const [sesstionSelect, setSesstionSelect] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

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
          row.original[item] === 'cm'
            ? { bgcolor: 'success.dark', color: 'primary.light' }
            : row.original[item] === 'cp'
              ? { bgcolor: 'warning.main', color: 'text.primary' }
              : { bgcolor: 'error.main', color: 'primary.light' };
        let content = row.original[item] === 'cm' ? 'Có' : row.original[item] === 'cp' ? 'Có phép' : 'Vắng';
        return (
          <Box
            key={generateId()}
            onClick={(e) => {
              setSesstionSelect({ mssv: row.original.id, sessionId: row.original.SessionID, currentStatus: row.original[item] });
              setOpenPopUp(true);
            }}
            style={{ padding: '0 10px', display: 'inline-block', borderRadius: 10, cursor: 'pointer' }}
            sx={styleStatus}
          >
            {content}
          </Box>
        );
      }
    });
  });

  const formatAttendanceForUI = (attendanceData) => {
    const studentMap = {};
    attendanceData.forEach(({ StudentID, FirstName, LastName, Present, StartTime, SessionID }) => {
      const parsedDate = parse(StartTime, 'dd/MM/yyyy HH:mm:ss', new Date());
      const date = format(parsedDate, 'dd/MM/yyyy');
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

      if (!studentMap[StudentID][date]) {
        studentMap[StudentID][date] = Present;
      }
    });
    return Object.values(studentMap);
  };

  const handleClose = () => {
    setOpenPopUp(false);
  };

  const handleSave = (data) => {
    updateAttendance({ StudentID: data.mssv, SessionID: data.sessionId, Present: data.currentStatus })
      .then((data) => {
        if (data.status === 'success') {
          setReload((prev) => {
            return prev + 1;
          });
          setNotification({ open: true, message: 'Cập nhật thành công!', severity: 'success' });
        } else {
          throw new Error('Update faile');
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
          <CustomTable columns={columns} data={data} />
        </Grid>
      </Grid>
      <PopupWithTextField
        handleSave={handleSave}
        sessionEdit={sesstionSelect}
        open={openPopup}
        handleClose={handleClose}
      ></PopupWithTextField>
      <NotificationComponent notification={notification} />
    </>
  );
};

export default ManageStudentScreen;
