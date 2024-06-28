import { useEffect, useRef, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';



import { gapGrid, gridSpacing } from 'store/constant';

// assets
import MainCard from 'ui-component/cards/MainCard';
import { Button, ButtonBase, CardActions, CardContent, CardHeader, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { 
    ClassicEditor, 
    Bold, 
    Essentials, 
    Italic, 
    Paragraph, 
    Image, 
    ImageToolbar, 
    ImageCaption, 
    ImageStyle, 
    ImageUpload, 
    ImageResize,
    SimpleUploadAdapter 
} from 'ckeditor5';
import { SlashCommand } from 'ckeditor5-premium-features';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
import { useNavigate } from 'react-router-dom';
import ListChoice from './ListChoice';
import { Label } from '@mui/icons-material';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const AddQuestionScreen = () => {
  const [data, setData] = useState([]);
  const [reloadActive, setReloadActive] = useState(false);
  const [showCommonContent, setShowCommonContent] = useState(false);
  const [listChoice, setListChoice] = useState([{is_correct:true}]);

  const onDeleteChoice = ()=>{
    if(listChoice.length > 1){
      listChoice.pop()
      setListChoice([...listChoice]);
    }
  }

  const onAddChoice = ()=>{
    if(listChoice.length <10){
      listChoice.push({is_correct:false})
      setListChoice([...listChoice]);
    }
  }
  const navigate = useNavigate()
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
      <MainCard title="Thêm câu hỏi">
        <CardContent sx={{paddingLeft: 0, paddingRight:0}}>
        <Typography sx={{marginBottom:3, fontSize:15}}><b>Thông tin câu hỏi</b></Typography>
        <Grid container spacing={gapGrid}>
          <Grid item xs={4}>
            <InputLabel><b>Độ khó</b></InputLabel>
            <Select sx={{width: '100%'}}>
              <MenuItem value={10}>Dễ</MenuItem>
              <MenuItem value={20}>Trung bình</MenuItem>
              <MenuItem value={30}>Nâng cao</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={4}>
            <InputLabel><b>Môn</b></InputLabel>
            <Select sx={{width: '100%'}}>
              <MenuItem value={10}>Cấu trúc dữ liệu và giải thuật</MenuItem>
              <MenuItem value={20}>Thiết kế website</MenuItem>
              <MenuItem value={30}>Hệ quản trị cơ sở dữ liệu</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={4}>
            <InputLabel><b>Chương</b></InputLabel>
            <Select sx={{width: '100%'}}>
              <MenuItem value={10}>Cấu trúc dữ liệu và giải thuật</MenuItem>
              <MenuItem value={20}>Thiết kế website</MenuItem>
              <MenuItem value={30}>Hệ quản trị cơ sở dữ liệu</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={4} sx={{marginTop:'-58px'}}>
            <InputLabel><b>Loại</b></InputLabel>
            <Select onChange={e=>{
                setShowCommonContent(e.target.value);
              } 
            }
              value={showCommonContent} sx={{width: '100%'}}
            >
              <MenuItem value={false}>Đơn/đa đáp án</MenuItem>
              <MenuItem value={true}>Câu hỏi dùng chung</MenuItem>
            </Select>
          </Grid>
        </Grid>
        {showCommonContent && (
          <>
          <Typography sx={{margin:'20px 0', fontSize:15}}><b>Nội dung dùng chung</b></Typography>
          <CKEditor
              editor={ ClassicEditor }
              config={ {
              plugins: [ Essentials, Bold, Italic, Paragraph ,Image, ImageToolbar,
                   ImageCaption, ImageStyle, ImageUpload, ImageResize, SimpleUploadAdapter],
              toolbar: [ 'undo', 'redo', '|', 'bold', 'italic','imageUpload' ],
              simpleUpload: {
                  uploadUrl: `${import.meta.env.VITE_APP_API_URL}upload`,
                  headers: {
                    'X-CSRF-TOKEN': 'CSRF-Token',
                    Authorization: 'Bearer <JSON Web Token>'
                  }
                },
              image: {
                toolbar: ['imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:inline', 'imageStyle:alignRight', '|', 'imageResize','imageTextAlternative', 'imageCaption'],
                resizeOptions: [
                    {
                        name: 'imageResize:original',
                        label: 'Original',
                        value: null
                    },
                    {
                        name: 'imageResize:50',
                        label: '50%',
                        value: '50'
                    },
                    {
                        name: 'imageResize:75',
                        label: '75%',
                        value: '75'
                    }
                ],
                styles: ['full', 'alignLeft', 'alignRight']
              },
              alignment: {
                  options: ['left', 'right', 'center', 'justify']
              }
              } }
              data='<p>Nội dung dùng chung</p>'
              onChange={(event, editor)=>{
                  const data = editor.getData(); 
              }}
          />
          </>
        )}
        <Typography sx={{margin:'20px 0', fontSize:15}}><b>Nội dung câu hỏi</b></Typography>
        <CKEditor
            editor={ ClassicEditor }
            config={ {
            plugins: [ Essentials, Bold, Italic, Paragraph ,Image, ImageToolbar,
                 ImageCaption, ImageStyle, ImageUpload, ImageResize, SimpleUploadAdapter],
            toolbar: [ 'undo', 'redo', '|', 'bold', 'italic','imageUpload' ],
            simpleUpload: {
                uploadUrl: `${import.meta.env.VITE_APP_API_URL}upload`,
                headers: {
                  'X-CSRF-TOKEN': 'CSRF-Token',
                  Authorization: 'Bearer <JSON Web Token>'
                }
              },
            image: {
              toolbar: ['imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:inline', 'imageStyle:alignRight', '|', 'imageResize','imageTextAlternative', 'imageCaption'],
              resizeOptions: [
                  {
                      name: 'imageResize:original',
                      label: 'Original',
                      value: null
                  },
                  {
                      name: 'imageResize:50',
                      label: '50%',
                      value: '50'
                  },
                  {
                      name: 'imageResize:75',
                      label: '75%',
                      value: '75'
                  }
              ],
              styles: ['full', 'alignLeft', 'alignRight']
            },
            alignment: {
                options: ['left', 'right', 'center', 'justify']
            }
            } }
            data='<p>Nội dung câu hỏi</p>'
            onChange={(event, editor)=>{
                const data = editor.getData(); 
            }}
        />
        <Typography sx={{margin:'20px 0', fontSize:15}}><b>Đáp án</b></Typography>
        <ListChoice onAdd={onAddChoice} onDelete={onDeleteChoice} listChoice={listChoice}></ListChoice>
        </CardContent>
      </MainCard>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button sx={
            { 
                marginRight: 2, 
                bgcolor:'#b2b0b0','&:hover': 
                {
                    bgcolor: 'gray',
                }, 
            }} 
            variant='contained'
            onClick={()=>navigate('/question')}
        >Trở về</Button>
        <Button variant='contained'>Thêm</Button>
      </Grid>
    </Grid>
  );
};

export default AddQuestionScreen;
