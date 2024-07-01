import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import ListQuestion from './ListQuestion';
import { runGetSubjectOptions } from 'api/subject';
import { runGetQuestionDatas } from 'api/question';
import { gridSpacing } from 'store/constant';

const PopupSearchQuestion = ({handleClose, open, search, infoExam}) => {
    const [subjects, setSubjects] = useState([]);
    const [data, setData] = useState([]);


useEffect(() => {
runGetSubjectOptions().then((data) => {
    setSubjects(data.data);
});
}, [open]);

const addIntoExam = (question)=>{
    infoExam.questions = [question, ...infoExam.questions];
}

useEffect(() => {
    runGetQuestionDatas().then((data) => {
      setData(formatData(data.data));
    });
    
  }, [open]);

  const formatData = (data)=>{
    return data?.reduce((result, question)=>{
      let isCommon = question.type_id === 1;
      if(isCommon) {
        let isExits = result.find(item => (item.id === question.common_content_id && item.type_id === 1));
        if(isExits)
        {
          isExits.questions.push(question);
        }else{
          let commonQuestion = {
            id: question.common_content_id,
            content: question.common_content, 
            type_id: 1,
            chapter_id:question.chapter_id,
            difficulty:question.difficulty,
            subject_id: question.subject_id,
            choices:[],
            questions:[]
           };
          commonQuestion.questions.push(question);
          result.push(commonQuestion);
        }
      }else{
        result.push(question);
      }
      
      return result;
    },[])
  }

  return (
      <Dialog  open={open} onClose={handleClose} maxWidth="lg">
        <DialogTitle sx={{fontSize:25,backgroundColor:'#eef2f6'}}>Danh sách câu hỏi</DialogTitle>
        <DialogContent container sx={{backgroundColor:'#eef2f6'}}>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={1}/>
                <Grid item xs={8.7}>
                <TextField 
                  onChange={e=>{}}
                  placeholder='Tìm kiếm nội dung câu hỏi' 
                  sx={{width:'100%'}}
                  ></TextField>
                </Grid>
                <Grid item xs={1.35} sx={{display:'flex', justifyContent:'start', alignContent:'center'}}>
                  <Button variant='contained' color='warning' sx={{margin:'10px 0', width:'100%'}}>Tìm kiếm</Button>
                </Grid>
                <Grid item xs={0.85}/>
                <Grid item xs={1}/>
                <Grid item xs={11}>
                    <Typography>Có <b>{data.length}</b> kết quả cho "{search}"</Typography>
                </Grid>
                <Grid item xs={0.8}/>
                <Grid item xs={11   }>
                    <ListQuestion infoExam={infoExam} subjects={subjects} listQuestion={data}/>
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions sx={{backgroundColor:'#eef2f6'}}>
          <Button onClick={handleClose} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default PopupSearchQuestion;
