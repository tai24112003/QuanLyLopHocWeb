import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';

import { gapGrid, gridSpacing } from 'store/constant';
import { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { runGetExams } from 'api/exam';
import { runAddUser, runGetAllUser, runToggleUserStatus, runUpdateUser } from 'api/user';
import { Button } from '@mui/material';
import { Delete, EditNote, Lock, Undo } from '@mui/icons-material';
import { IconPlus } from '@tabler/icons-react';
import PopupWithTextField from './components/popupAccount';
import useNotification from '../exam/components/Notification';
import { useSelector } from 'react-redux';
import CustomTable from 'ui-component/table/Table';

// ==============================|| DEFAULT DASHBOARD ||============================== //
const AccountListScreen = () => {
  const [data, setData] = useState([]);
  const [openPopup, setOpenPopUp] = useState(false);
  const [reload, setReload] = useState(1);
  const [selectId, setSelectId] = useState();
  const { showNotification, NotificationComponent } = useNotification();
  const user = useSelector((state) => {
    return state.customization.user;
  });

  useEffect(() => {
    runGetAllUser()
      .then((data) => {
        if (data.success) setData(data.data);
      })
      .catch((e) => console.log(e));
  }, [reload]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'STT',
        size: 50,
        Cell: ({ row }) => row.index + 1,
        enableSorting: false
      },
      {
        accessorKey: 'name',
        header: 'Tên giáo viên',
        size: 150
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 150
      },
      {
        accessorKey: 'phone',
        header: 'Số điện thoại',
        size: 200
      },
      {
        accessorKey: 'role',
        header: 'Vai trò',
        size: 200,
        Cell: ({ row }) => {
          let styleRole =
            row.original.role === 'TK'
              ? { backgroundColor: '#00e676', color: 'white' }
              : row.original.role === 'PK'
                ? { backgroundColor: 'green', color: 'white' }
                : { backgroundColor: '#ffe57f', color: 'black' };
          return <div style={{ ...styleRole, padding: '0 10px', display: 'inline-block', borderRadius: 10 }}>{row.original.role}</div>;
        }
      },
      {
        accessorKey: 'duration',
        header: 'Thao tác',
        size: 150,
        Cell: ({ row }) => {
          return (
            <>
              <Button
                size="small"
                onClick={(e) => {
                  setSelectId(row.original);
                  setOpenPopUp(true);
                }}
                color="warning"
                sx={{ margin: 0.5 }}
                variant="contained"
              >
                <EditNote />
              </Button>
              {row.original.id !== user.id && (
                <Button
                  onClick={(e) => {
                    runToggleUserStatus(row.original.id).then((res) => {
                      if (res.success) {
                        setReload((prev) => prev + 1);
                        setTimeout(() => showNotification('Cập nhật thành công!', 'success'), 100);
                      }
                    });
                  }}
                  sx={{ margin: 0.5 }}
                  size="small"
                  color="error"
                  variant="contained"
                >
                  {!row.original.status ? <Lock /> : <Undo />}
                </Button>
              )}
            </>
          );
        }
      }
    ],
    []
  );

  const handleClosePopup = () => {
    setSelectId(null);
    setOpenPopUp(false);
  };

  const handleSave = (user) => {
    if (selectId) {
      runUpdateUser(user)
        .then((res) => {
          if (res.success) {
            setData([
              ...data.map((item) => {
                if (item.id === res.data.id) return { ...res.data, password: '' };
                return item;
              })
            ]);
            setOpenPopUp(false);
            setTimeout(() => showNotification('Cập nhật thành công', 'success'), 10);
          }
        })
        .catch((err) => {
          showNotification('Cập nhật không thành công', 'error');
        });
    } else {
      runAddUser(user)
        .then((res) => {
          if (res.success) {
            setData([...data, res.data]);
            setOpenPopUp(false);
            setTimeout(() => showNotification('Cập nhật thành công', 'success'), 10);
          }
        })
        .catch((err) => {
          showNotification('email đã tồn tại', 'error');
        });
    }
    setSelectId(null);
  };

  const table = useMaterialReactTable({
    columns,
    data
  });

  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Button onClick={(e) => setOpenPopUp(true)} variant="contained">
            <IconPlus />
            Thêm tài khoản
          </Button>
        </Grid>
        <Grid item xs={12}>
          <CustomTable data={data} columns={columns} />
        </Grid>
        <PopupWithTextField subjectEdit={selectId} handleSave={handleSave} handleClose={handleClosePopup} open={openPopup} id={selectId} />
      </Grid>
      <NotificationComponent />
    </>
  );
};

export default AccountListScreen;
