import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Box, Button, Grid } from '@mui/material';
import ConfirmationDialog from 'ui-component/popup/confirmDelete';
import parseHtml from 'html-react-parser';

const QuestionTable = ({data, handleDelete}) => {
  //should be memoized or stable
  const [open, setOpen] = useState(false);
  const [idQuestionSelected, setIdQuestionSelected] = useState();


  const transformImgToLink = (node) => {
    if (node.type === 'tag' && node.name === 'img') {
      return (
        <a style={{margin: 5}} href={node.attribs.src} target="_blank" rel="noopener noreferrer">
          Ảnh
        </a>
      );
    }
  };

  const handleClickOpen = (id) => {
    setIdQuestionSelected(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    handleDelete(idQuestionSelected);
    setOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'no', //access nested data with dot notation
        header: 'STT',
        size: 50,
        Cell: ({ cell, column, row, table }) => (
             <span>{row.index+1}</span>
        ),
        enableHiding: false,
        enableColumnFilter: false,
        enableSorting: false
      },
      {
        accessorKey: 'content', //access nested data with dot notation
        header: 'Nội dung',
        size: 150,
        Cell: ({cell})=>{
          return parseHtml(cell.getValue(),{replace:transformImgToLink})
        },
      },
      {
        accessorKey: 'chapter_id',
        header: 'Chương',
        size: 150,
      },{
        accessorKey: 'difficulty',
        header: 'Độ khó',
        size: 50,
      },
      {
        accessorKey: 'type_id', //normal accessorKey
        header: 'Loại',
        size: 50,
      },
      {
        accessorKey: 'common_content_id',
        header: 'Nội dung dùng chung',
        size: 150,
        enableColumnFilter: false,
        enableSorting: false
      },
      {
        accessorKey: 'id',
        header: 'Hành động',
        size: 50,
        Cell: ({cell})=>{
            return <>
              <Button color="warning" sx={
                {'&:hover':{
                  bgcolor:'#ffe57f5c',
                  color:'#ffc108'
                }
              }} onClick={null}>Sửa</Button>
              <Button color="error" onClick={()=>handleClickOpen(cell.getValue())}>Xóa</Button>
            </>
        },
        enableColumnFilter: false,
        enableSorting: false
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableHiding: false,
  });

  return <>
    <MaterialReactTable table={table} />
    <ConfirmationDialog 
    open={open}
    handleClose={handleClose}
    handleConfirm={handleConfirm}
    />
  </>;
};

export default QuestionTable;
