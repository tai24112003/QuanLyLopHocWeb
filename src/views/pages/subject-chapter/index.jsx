import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';

import { gapGrid, gridSpacing } from 'store/constant';
import { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { runGetExams } from 'api/exam';
import { Button, Typography } from '@mui/material';
import { Delete, EditAttributes, EditCalendar, EditNote, EditNotificationsOutlined, EditRoad, EditSharp } from '@mui/icons-material';
import { IconPlus } from '@tabler/icons-react';
import { runAddSubject, runDeleteSubject, runGetSubjects, runUpdateSubject } from 'api/subject';
import ConfirmationDialog from 'ui-component/popup/confirmDelete';
import useNotification from '../exam/components/Notification';
import PopupWithTextField from './components/popupSubject';

// ==============================|| DEFAULT DASHBOARD ||============================== //
const SubjectChapterScreen = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openPopup, setOpenPopUp] = useState(false);
  const [reload, setReload] = useState(false);
  const [selectId, setSelectId] = useState();
  const { showNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    runGetSubjects()
      .then((data) => {
        if (data.success) {
          setData(data.data);
        }
      })
      .catch((e) => console.log(e));
  }, [reload]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'STT',
        size: 20,
        Cell: ({ row }) => row.index + 1,
        enableSorting: false
      },
      {
        accessorKey: 'name',
        header: 'Tên Môn',
        size: 150
      },
      {
        accessorKey: 'deletedAt',
        header: 'Action',
        size: 50,
        Cell: ({ row }) => {
          return (
            <>
              <Button
                onClick={(e) => {
                  setSelectId(row.original);
                  setOpenPopUp(true);
                }}
                color="warning"
                variant="contained"
              >
                <EditNote />
              </Button>
              {row.original.canRemove && (
                <Button
                  onClick={(e) => {
                    handleClickOpen(row.original.id);
                  }}
                  sx={{ marginLeft: 1 }}
                  color="error"
                  variant="contained"
                >
                  <Delete />
                </Button>
              )}
            </>
          );
        }
      }
    ],
    []
  );

  const handleClickOpen = (id) => {
    setSelectId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClosePopup = () => {
    setSelectId(null);
    setOpenPopUp(false);
  };

  const handleSave = (value) => {
    if (selectId) {
      runUpdateSubject({ id: selectId.id, name: value })
        .then((data) => {
          if (data.success) {
            setReload(!reload);
            setTimeout(() => {
              showNotification('Cập nhật thành công', 'success');
            }, 100);
          } else {
            showNotification('Cập nhật không thành công', 'error');
          }
        })
        .catch((e) => {
          showNotification('Cập nhật không thành công', 'error');
        });
    } else {
      runAddSubject({ name: value })
        .then((data) => {
          if (data.success) {
            setReload(!reload);
            setTimeout(() => {
              showNotification('Cập nhật thành công', 'success');
            }, 100);
          } else {
            showNotification('Cập nhật không thành công', 'error');
          }
        })
        .catch((e) => {
          showNotification('Cập nhật không thành công', 'error');
        });
    }
    setOpenPopUp(false);
    setSelectId(null);
  };

  const handleConfirm = () => {
    if (selectId) {
      runDeleteSubject(selectId)
        .then((data) => {
          if (data.success) {
            showNotification('Xóa thành công', 'success');
            setTimeout(() => {
              setReload(!reload);
            }, 2000);
          } else showNotification('Xóa thất bại', 'error');
        })
        .catch((e) => {
          showNotification('Xóa thất bại', 'error');
        });
    }
    setOpen(false);
  };

  const table = useMaterialReactTable({
    columns,
    data
  });

  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={6}>
          <Typography mb={1} bgcolor={'white'} borderRadius={2} p={1}>
            <b style={{ fontSize: 16, marginRight: 10 }}>Danh sách môn</b>
            <Button
              onClick={(e) => {
                setSelectId(null);
                setOpenPopUp(true);
              }}
              size="small"
              color="success"
              variant="contained"
            >
              <IconPlus></IconPlus>
            </Button>
          </Typography>
          <MaterialReactTable table={table} />
        </Grid>
        <Grid item xs={6}>
          <Typography sx={{ bgcolor: 'white' }} borderRadius={2} p={1} mb={1}>
            <b style={{ fontSize: 16, marginRight: 10 }}>Danh sách chương</b>
            <Button
              onClick={(e) => {
                setOpenPopUp(true);
              }}
              size="small"
              color="success"
              variant="contained"
            >
              <IconPlus></IconPlus>
            </Button>
          </Typography>

          <MaterialReactTable table={table} />
        </Grid>
      </Grid>
      <ConfirmationDialog open={open} handleClose={handleClose} handleConfirm={handleConfirm} />
      <NotificationComponent />
      <PopupWithTextField subjectEdit={selectId} handleSave={handleSave} handleClose={handleClosePopup} open={openPopup} id={selectId} />
    </>
  );
};

export default SubjectChapterScreen;
