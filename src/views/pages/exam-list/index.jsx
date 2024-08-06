import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';

import { gapGrid, gridSpacing } from 'store/constant';
import { useMemo } from 'react';
import { runGetExams, toggleExamSharing } from 'api/exam';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import CustomTable from 'ui-component/table/Table';

// ==============================|| DEFAULT DASHBOARD ||============================== //
const ExamListScreen = () => {
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(1);
  const user = useSelector((state) => {
    return state.customization.user;
  });

  useEffect(() => {
    runGetExams()
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
        accessorKey: 'code',
        header: 'Mã đề',
        size: 150,
        Cell: ({ row }) => (
          <Link to={`/exam/view/${row.original.id}`} underline="none" color="primary">
            {row.original.code}
          </Link>
        )
      },
      {
        accessorKey: 'name',
        header: 'Tên đề',
        size: 250
      },
      {
        accessorKey: 'subject.name',
        header: 'Chủ đề',
        size: 200
      },
      {
        accessorKey: 'questionCount',
        header: 'Số câu',
        size: 50
      },
      {
        accessorKey: 'duration',
        header: 'Thời gian (phút)',
        size: 150
      },
      {
        accessorKey: 'actions',
        header: 'Công khai đề',
        size: 150,
        Cell: ({ row }) => {
          return (
            row.original.authorId === user.id && (
              <Button
                onClick={(e) => {
                  toggleExamSharing(row.original.id).then((data) => {
                    if (data.success) {
                      setReload((prev) => prev + 1);
                    }
                  });
                }}
                variant="contained"
              >
                {!row.original.shared ? 'Công khai' : 'Thu hồi'}
              </Button>
            )
          );
        }
      }
    ],
    []
  );

  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <CustomTable columns={columns} data={data} />
        </Grid>
      </Grid>
    </>
  );
};

export default ExamListScreen;
