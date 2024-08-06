import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';

import { gapGrid, gridSpacing } from 'store/constant';
import { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Button, Typography } from '@mui/material';
import { Delete, EditNote, Subject } from '@mui/icons-material';
import { IconPlus } from '@tabler/icons-react';
import { runAddSubject, runDeleteSubject, runGetSubjects, runUpdateSubject } from 'api/subject';
import ConfirmationDialog from 'ui-component/popup/confirmDelete';
import PopupWithTextField from './components/popupSubject';
import { runAddChapter, runDeleteChapter, runGetChapters, runUpdateChapter } from 'api/chapter';
import PopupWithTextFieldChapter from './components/popupChapter';
import { useSelector } from 'react-redux';
import NotificationComponent from 'ui-component/notification/NotificationComponent';
import CustomTable from 'ui-component/table/Table';
import { bgcolor, Box } from '@mui/system';

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
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const user = useSelector((state) => {
    return state.customization.user;
  });

  useEffect(() => {
    const fetchData = async () => {
      const subj = await runGetSubjects();
      const chap = await runGetChapters();
      setDataChapter(chap.data);
      setData(subj.data);
    };
    fetchData();
  }, []);

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
        header: 'Chủ đề',
        size: 150
      },
      {
        accessorKey: 'canRemove',
        header: 'Trạng thái',
        size: 150,
        enableSorting: false,
        Cell: ({ row }) => {
          if (row.original.canRemove)
            return <Box sx={{ bgcolor: 'disabled.main', display: 'inline-block', padding: '0 10px', borderRadius: 10 }}>Chưa dùng</Box>;
          return (
            <Box sx={{ bgcolor: 'success.dark', color: 'primary.light', display: 'inline-block', padding: '0 10px', borderRadius: 10 }}>
              Đang dùng
            </Box>
          );
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
        header: 'Chủ đề',
        size: 150
      },
      {
        accessorKey: 'canRemove',
        header: 'Trạng thái',
        size: 150,
        enableSorting: false,
        Cell: ({ row }) => {
          if (row.original.canRemove)
            return <Box sx={{ bgcolor: 'disabled.main', display: 'inline-block', padding: '0 10px', borderRadius: 10 }}>Chưa dùng</Box>;
          return (
            <Box sx={{ bgcolor: 'success.dark', color: 'primary.light', display: 'inline-block', padding: '0 10px', borderRadius: 10 }}>
              Đang dùng
            </Box>
          );
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
            setData((prevData) => prevData.map((e) => (e.id === selectId.id ? { ...e, name: value } : e)));
            setNotification({ open: true, message: 'Cập nhật thành công' });
          } else {
            throw new Error('Upload failed');
          }
        })
        .catch((e) => {
          setNotification({ open: true, message: 'Cập nhật không thành công', severity: 'error' });
        });
    } else {
      runAddSubject({ name: value, authorId: user.id })
        .then((data) => {
          if (data.success) {
            setReload(!reload);
            setNotification({ open: true, message: 'Cập nhật không thành công', severity: 'error' });
          } else {
            throw new Error('Upload failed');
          }
        })
        .catch((e) => {
          setNotification({ open: true, message: 'Cập nhật không thành công', severity: 'error' });
        });
    }
    setOpenPopUp(false);
    setSelectId(null);
  };

  const handleSaveChapter = (value) => {
    if (selectChapterId) {
      runUpdateChapter({ id: selectChapterId.id, name: value.text, subject_id: value.selectedValue })
        .then((res) => {
          if (res.success) {
            setDataChapter((prevData) =>
              prevData.map((e) =>
                e.id === selectChapterId.id ? { ...e, name: value.text, Subject: data.find((item) => item.id === value.selectedValue) } : e
              )
            );
            setNotification({ open: true, message: 'Cập nhật thành công', severity: 'success' });
          } else {
            setNotification({ open: true, message: 'Cập nhật không thành công', severity: 'error' });
          }
        })
        .catch((e) => {
          setNotification({ open: true, message: 'Cập nhật không thành công', severity: 'error' });
        });
    } else {
      runAddChapter({ name: value.text, subject_id: value.selectedValue })
        .then((res) => {
          if (res.success) {
            setDataChapter([
              ...dataChapter,
              { id: -1, name: value.text, Subject: data.filter((item) => item.id === value.selectedValue)?.[0] ?? {}, canRemove: true }
            ]);
            setNotification({ open: true, message: 'Cập nhật thành công', severity: 'success' });
          } else {
            setNotification({ open: true, message: 'Cập nhật không thành công', severity: 'error' });
          }
        })
        .catch((e) => {
          setNotification({ open: true, message: 'Cập nhật không thành công', severity: 'error' });
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
            setNotification({ open: true, message: 'Xóa thành công', severity: 'success' });
            setData(data.filter((item) => item.id !== selectId));
          } else setNotification({ open: true, message: 'Xóa không thành công', severity: 'error' });
        })
        .catch((e) => {
          setNotification({ open: true, message: 'Xóa không thành công', severity: 'error' });
        });
      setSelectId(null);
    }
    if (selectChapterId) {
      runDeleteChapter(selectChapterId)
        .then((data) => {
          if (data.success) {
            setNotification({ open: true, message: 'Xóa thành công', severity: 'success' });
            setDataChapter(dataChapter.filter((item) => item.id !== selectChapterId));
          } else setNotification({ open: true, message: 'Xóa không thành công', severity: 'error' });
        })
        .catch((e) => {
          setNotification({ open: true, message: 'Xóa không thành công', severity: 'error' });
        });
      setSelectChapterId(null);
    }
    setOpen(false);
  };

  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Typography mb={1} bgcolor={'white'} borderRadius={2} p={1}>
            <b style={{ fontSize: 16, marginRight: 10 }}>Danh sách chủ đề</b>
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
          <CustomTable columns={columns} data={data} />
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
          <CustomTable columns={columnsChapter} data={dataChapter} />
        </Grid>
      </Grid>
      <ConfirmationDialog open={open} handleClose={handleClose} handleConfirm={handleConfirm} />
      <PopupWithTextField subjectEdit={selectId} handleSave={handleSave} handleClose={handleClosePopup} open={openPopup} id={selectId} />
      <PopupWithTextFieldChapter
        handleSave={handleSaveChapter}
        options={data}
        chapterEdit={selectChapterId}
        handleClose={handleClosePopup}
        open={openPopupChapter}
      />
      <NotificationComponent notification={notification} />
    </>
  );
};

export default SubjectChapterScreen;
