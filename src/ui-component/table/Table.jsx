import { useTheme } from '@emotion/react';
import { Avatar, Card, CardContent, CardHeader } from '@mui/material';
import { Box } from '@mui/system';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import React from 'react';
import { noRecordString } from 'store/constant';

const CustomTable = React.memo(({ data, columns, label = '', des = '' }) => {
  const theme = useTheme();
  const table = useMaterialReactTable({
    columns,
    data,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    autoResetPageIndex: false,
    paginateExpandedRows: false,
    paginationDisplayMode: 'pages',
    muiTableBodyProps: {
      sx: {
        '& tr:nth-of-type(odd) > td': {
          bgcolor: 'primary.light'
        }
      }
    },
    muiTableBodyCellProps: {
      sx: {
        borderRight: '1px solid #e0e0e0'
      }
    },
    muiPaginationProps: {
      color: 'primary',
      shape: 'rounded',
      showRowsPerPage: false,
      variant: 'outlined'
    },
    initialState: { density: 'comfortable' },
    renderEmptyRowsFallback: ({ table }) => (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60px' }}>{noRecordString}</Box>
    )
  });
  return (
    <Card style={{ position: 'relative' }}>
      <CardHeader title={label} subheader={des} />
      <CardContent>
        <MaterialReactTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
});

export default CustomTable;
