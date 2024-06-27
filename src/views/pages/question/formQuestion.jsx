import { useEffect, useRef, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';



import { gridSpacing } from 'store/constant';

// assets
import MainCard from 'ui-component/cards/MainCard';
import { Button, CardActions, CardContent, CardHeader } from '@mui/material';
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

// ==============================|| DEFAULT DASHBOARD ||============================== //

const AddQuestionScreen = () => {
  const [data, setData] = useState([]);
  const [reloadActive, setReloadActive] = useState(false);
  const navigate = useNavigate()
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
      <MainCard title="Thêm câu hỏi">
        <CardContent sx={{paddingLeft: 0, paddingRight:0}}>
        <CKEditor
            editor={ ClassicEditor }
            config={ {
            plugins: [ Essentials, Bold, Italic, Paragraph ,Image, ImageToolbar,
                 ImageCaption, ImageStyle, ImageUpload, ImageResize, SimpleUploadAdapter],
            toolbar: [ 'undo', 'redo', '|', 'bold', 'italic','imageUpload' ],
            simpleUpload: {
                uploadUrl: 'https://example.com/image/upload',
                headers: {
                  'X-CSRF-TOKEN': 'CSRF-Token',
                  Authorization: 'Bearer <JSON Web Token>'
                }
              }
            } }
            data='<p>Hello from the first editor working with the context!</p>'
            onChange={(event, editor)=>{
                const data = editor.getData(); 
            }}
        />
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
