import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';

import { gapGrid, gridSpacing } from 'store/constant';
import { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { runGetExams } from 'api/exam';
import { runGetAllUser } from 'api/user';
import { Button } from '@mui/material';
import { Delete, EditNote, Lock } from '@mui/icons-material';
import { IconPlus } from '@tabler/icons-react';
import PopupWithTextField from './components/popupAccount';

// ==============================|| DEFAULT DASHBOARD ||============================== //
const AccountListScreen = () => {
  const [data, setData] = useState([]);
  const [openPopup, setOpenPopUp] = useState(false);
  const [selectId, setSelectId] = useState();

  useEffect(() => {
    runGetAllUser()
      .then((data) => {
        if (data.success) setData(data.data);
      })
      .catch((e) => console.log(e));
  }, []);

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
            row.original.role === 'admin'
              ? { backgroundColor: '#00e676', color: 'white' }
              : row.original.role === 'gv'
                ? { backgroundColor: '#ffe57f', color: 'black' }
                : { backgroundColor: 'gray', color: 'white' };
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
                  setSelectChapterId(null);
                  setSelectId(row.original);
                  setOpenPopUp(true);
                }}
                color="warning"
                sx={{ margin: 0.5 }}
                variant="contained"
              >
                <EditNote />
              </Button>
              {row.original.role !== 'admin' && (
                <Button
                  onClick={(e) => {
                    setSelectChapterId(null);
                    handleClickOpen(row.original.id);
                  }}
                  sx={{ margin: 0.5 }}
                  size="small"
                  color="error"
                  variant="contained"
                >
                  <Lock />
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
    setOpenPopUp(false);
  };

  const handleSave = () => {};

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
          <MaterialReactTable table={table} />
        </Grid>
        <PopupWithTextField subjectEdit={selectId} handleSave={handleSave} handleClose={handleClosePopup} open={openPopup} id={selectId} />
      </Grid>
    </>
  );
};

export default AccountListScreen;
