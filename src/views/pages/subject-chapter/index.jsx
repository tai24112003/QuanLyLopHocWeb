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
import { runAddChapter, runDeleteChapter, runGetChapters, runUpdateChapter } from 'api/chapter';
import PopupWithTextFieldChapter from './components/popupChapter';
import { useSelector } from 'react-redux';

// ==============================|| DEFAULT DASHBOARD ||============================== //
const SubjectChapterScreen = () => {
  const [data, setData] = useState([]);
  const [dataChapter, setDataChapter] = useState([]);
  const [open, setOpen] = useState(false);
  const [openPopup, setOpenPopUp] = useState(false);
  const [openPopupChapter, setOpenPopUpChapter] = useState(false);
  const [reload, setReload] = useState(false);
  const [selectId, setSelectId] = useState();
  const [selectChapterId, setSelectChapterId] = useState();
  const { showNotification, NotificationComponent } = useNotification();
  const user = useSelector((state) => {
    return state.customization.user;
  });

  useEffect(() => {
    runGetSubjects()
      .then((data) => {
        if (data.success) {
          setData(data.data);
        }
      })
      .catch((e) => console.log(e));
    runGetChapters()
      .then((data) => {
        if (data.success) {
          setDataChapter(data.data);
        }
      })
      .catch((e) => console.log(e));
  }, [reload]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'STT',
        size: 30,
        Cell: ({ row }) => row.index + 1,
        enableSorting: false
      },
      {
        accessorKey: 'name',
        header: 'Tên Môn',
        size: 150
      },
      {
        accessorKey: 'canRemove',
        header: 'Trạng thái',
        size: 150,
        enableSorting: false,
        Cell: ({ row }) => {
          if (row.original.canRemove)
            return (
              <div style={{ backgroundColor: '#e0e0e0', display: 'inline-block', padding: '0 10px', borderRadius: 10 }}>Chưa dùng</div>
            );
          return <div style={{ backgroundColor: '#00e677', display: 'inline-block', padding: '0 10px', borderRadius: 10 }}>Đang dùng</div>;
        }
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
                  setSelectChapterId(null);
                  setSelectId(row.original);
                  setOpenPopUp(true);
                }}
                color="warning"
                sx={{ marginRight: 1 }}
                variant="contained"
              >
                <EditNote />
              </Button>
              {row.original.canRemove && (
                <Button
                  onClick={(e) => {
                    setSelectChapterId(null);
                    handleClickOpen(row.original.id);
                  }}
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
  const columnsChapter = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'STT',
        size: 30,
        Cell: ({ row }) => row.index + 1,
        enableSorting: false
      },
      {
        accessorKey: 'name',
        header: 'Tên Chương',
        size: 250
      },
      {
        accessorKey: 'Subject.name',
        header: 'Tên Môn',
        size: 150
      },
      {
        accessorKey: 'canRemove',
        header: 'Trạng thái',
        size: 150,
        enableSorting: false,
        Cell: ({ row }) => {
          if (row.original.canRemove)
            return (
              <div style={{ backgroundColor: '#e0e0e0', display: 'inline-block', padding: '0 10px', borderRadius: 10 }}>Chưa dùng</div>
            );
          return <div style={{ backgroundColor: '#00e677', display: 'inline-block', padding: '0 10px', borderRadius: 10 }}>Đang dùng</div>;
        }
      },
      {
        accessorKey: 'deletedAt',
        header: 'Action',
        size: 100,
        Cell: ({ row }) => {
          return (
            <>
              <Button
                onClick={(e) => {
                  setSelectId(null);
                  setSelectChapterId(row.original);
                  setOpenPopUpChapter(true);
                }}
                sx={{ marginRight: 1 }}
                color="warning"
                variant="contained"
              >
                <EditNote />
              </Button>
              {row.original.canRemove && (
                <Button
                  onClick={(e) => {
                    setSelectId(null);
                    handleClickOpen(row.original.id, true);
                  }}
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

  const handleClickOpen = (id, isChapter = false) => {
    if (isChapter) setSelectChapterId(id);
    else setSelectId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClosePopup = () => {
    setSelectId(null);
    setSelectChapterId(null);
    setOpenPopUp(false);
    setOpenPopUpChapter(false);
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
      runAddSubject({ name: value, authorId: user.id })
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

  const handleSaveChapter = (value) => {
    if (selectChapterId) {
      runUpdateChapter({ id: selectChapterId.id, name: value.text, subject_id: value.selectedValue })
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
      runAddChapter({ name: value.text, subject_id: value.selectedValue })
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
    setOpenPopUpChapter(false);
    setSelectChapterId(null);
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
      setSelectId(null);
    }
    if (selectChapterId) {
      runDeleteChapter(selectChapterId)
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
      setSelectChapterId(null);
    }
    setOpen(false);
  };

  const table = useMaterialReactTable({
    columns,
    data
  });

  const tableChapter = useMaterialReactTable({
    columns: columnsChapter,
    data: dataChapter
  });

  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
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
        <Grid item xs={12}>
          <Typography sx={{ bgcolor: 'white' }} borderRadius={2} p={1} mb={1}>
            <b style={{ fontSize: 16, marginRight: 10 }}>Danh sách chương</b>
            <Button
              onClick={(e) => {
                setOpenPopUpChapter(true);
              }}
              size="small"
              color="success"
              variant="contained"
            >
              <IconPlus></IconPlus>
            </Button>
          </Typography>

          <MaterialReactTable table={tableChapter} />
        </Grid>
      </Grid>
      <ConfirmationDialog open={open} handleClose={handleClose} handleConfirm={handleConfirm} />
      <NotificationComponent />
      <PopupWithTextField subjectEdit={selectId} handleSave={handleSave} handleClose={handleClosePopup} open={openPopup} id={selectId} />
      <PopupWithTextFieldChapter
        handleSave={handleSaveChapter}
        options={data}
        chapterEdit={selectChapterId}
        handleClose={handleClosePopup}
        open={openPopupChapter}
      />
    </>
  );
};

export default SubjectChapterScreen;
