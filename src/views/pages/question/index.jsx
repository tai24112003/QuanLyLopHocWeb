import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';



import { gridSpacing } from 'store/constant';

// assets
import MainCard from 'ui-component/cards/MainCard';
import { Button, CardActions, CardContent } from '@mui/material';
import DataTable from './QuestionTable';
import {runDeleteQuestionDatas, runGetQuestionDatas} from 'api/question';
import AddIcon from '@mui/icons-material/Add';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const QuestionScreen = () => {
  const [data, setData] = useState([]);
  const [reloadActive, setReloadActive] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    runGetQuestionDatas().then((data) => {
      setData(data.data);
    });
  }, [reloadActive]);

  const handleDeleteQuestion = (id)=>{
    runDeleteQuestionDatas(id).then((data)=>{
      if(data.success) setReloadActive(!reloadActive);
    });
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
      <MainCard style={{backgroundColor:'#d3d7db'}}>
        <CardActions sx={{margin: 0, padding: 0, justifyContent: 'flex-end'}}>
          <Button onClick={()=>navigate('create')} variant="contained"><AddIcon/> Thêm câu hỏi</Button>
        </CardActions>
        <CardContent sx={{paddingLeft: 0, paddingRight:0}}>
          <DataTable data={data} handleDelete={handleDeleteQuestion}/>
        </CardContent>
      </MainCard>
      </Grid>
    </Grid>
  );
};

export default QuestionScreen;
