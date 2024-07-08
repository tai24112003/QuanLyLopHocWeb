import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';

import { gapGrid, gridSpacing } from 'store/constant';
import { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { runGetExams } from 'api/exam';

// ==============================|| DEFAULT DASHBOARD ||============================== //
const ExamListScreen = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    runGetExams()
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
        size: 150
      },
      {
        accessorKey: 'subject.name',
        header: 'Môn',
        size: 200
      },
      {
        accessorKey: 'questionCount',
        header: 'Số câu',
        size: 150
      },
      {
        accessorKey: 'duration',
        header: 'Thời gian',
        size: 150
      }
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data
  });

  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <MaterialReactTable table={table} />
        </Grid>
      </Grid>
    </>
  );
};

export default ExamListScreen;
