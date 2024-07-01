import React, { useEffect, useRef, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionSummary, Button, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Bold, ClassicEditor, Essentials, Image, ImageCaption, ImageResize, ImageStyle, ImageToolbar, ImageUpload, Italic, List, Paragraph, SimpleUploadAdapter } from 'ckeditor5';
import { gridSpacing } from 'store/constant';
import generateId from 'utils/generate-id';
import { useFormContext } from 'react-hook-form';
import { runDeleteChoice } from 'api/choice';
import useNotification from './Notification';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const QuestionItem = ({question, onDestroy,parentQuestion, subjects, infoExam, inExam, updateList}) => {
  const [reload, setReload] = useState(false);
  const { register, setValue, triggerValidation, formState: { errors } } = useFormContext();
  const [chapters, setChapters] = useState([]);
  const thisRef = useRef();
  const { showNotification, NotificationComponent } = useNotification();
  const [isExit, setIsExit] = useState(infoExam?.questions.some(item=>item.id===question.id));



  useEffect(()=>{
    let lstChapter = subjects.find(item=>(item.id === question.subject_id))?.Chapters;
    setChapters(lstChapter);
  },[])
  
  question.ref = thisRef.current;
  const addChoice = ()=>{
    const length = question.choices.length;
    if(question.choices[length-1]?.content == '')
      {
        showNotification('Không để trống đáp án','error');
        return;
      }
    if(length >= 10) return;
    question.choices.push({
      id:-1,
      content:'',
      is_correct:false
    });
    question.id = -1;
    setReload(!reload);
  }

  const onDeleteChoice = (value)=>{
    const idx = question.choices.indexOf(value);
    if(question.choices.length < 2){
      showNotification('Phải có ít nhất 1 đáp án','error');
      return;
    }
    if(idx > -1) {
      question.choices.splice(idx,1);
      question.id = -1;
      if(parentQuestion !== undefined){
        if(parentQuestion.id !== -1)parentQuestion.id = -2;
      }
      setReload(!reload);
    }
  }

  const onDeleteChildQuestion = (event)=>{
    event.stopPropagation();
    parentQuestion.id = -1;
    onDestroy(question);
  }

  const addIntoExam = (event)=>{
    event.stopPropagation();
    if(infoExam.questions.length === infoExam.count){
      showNotification('Đề đã đủ số câu','success');
      return;
    }
    showNotification('Đã thêm thành công','success');
    infoExam.questions = [question, ...infoExam.questions];
    setIsExit(true);
  };

  const deleteInExam = (event)=>{
    event.stopPropagation();
    if(!inExam){
      showNotification('Đã xóa thành công','success');
      const idx = infoExam.questions.indexOf(question);
      if(idx > -1){
        infoExam.questions.splice(idx,1);
      }
      setIsExit(false);
    }
    else {
      updateList(question);
    }
  };


  return (
  <>
    <Grid item xs={12}>
          <Accordion ref={thisRef} sx={{ marginBottom: 3}}>
            <AccordionSummary
              expandIcon={<ExpandMore/>}
              aria-controls='panel1-content'
              id='panel1-header'
            >
            <Grid container>
            {question.type_id===2 ? (
                <>
                <Grid item xs={12} sx={{marginBottom:0}}>
                    <Typography><b style={{fontSize:18}}>Thông tin chung:</b></Typography>
                </Grid>
                  <Grid item xs={3.3} sx={{  marginTop: 1}}>
                  <InputLabel>Môn</InputLabel>
                  <Select inputProps={{readOnly: true}} 
                  onChange={(e)=>{
                    thisRef.current.style.border="none";
                      if(!question.new_or_edit){
                        question.new_or_edit = true;
                      }
                      question.subject_id = e.target.value;
                      let lstChapter = subjects.find(item=>item.id === e.target.value).Chapters;
                      question.chapter_id = lstChapter[0]?.id ?? '';
                      setChapters(lstChapter);
                      setReload(!reload);
                    }} value={question.subject_id} sx={{width:'100%'}}>
                      {subjects?.map((subject)=>(<MenuItem value={subject.id}>{subject.name}</MenuItem>))}
                    </Select>
                  </Grid>
                  <Grid item xs={3.3} sx={{paddingLeft:3,  marginTop: 1}}>
                    <InputLabel>Chương</InputLabel>
                      <Select 
                      inputProps={{readOnly: true}} 
                      onChange={(e)=>{
                        thisRef.current.style.border="none";
                          if(!question.new_or_edit){
                            question.new_or_edit = true;
                          }
                          question.chapter_id = e.target.value;
                          setReload(!reload);
                        }} 
                        value={question.chapter_id} 
                        sx={{width:'100%'}}>
                            <MenuItem value=''>Chọn chương</MenuItem>
                            {chapters?.map((chapter)=>(<MenuItem value={chapter.id}>{chapter.name}</MenuItem>))}
                        </Select>
                  </Grid>
                  <Grid item xs={3.3} sx={{paddingLeft:3,   marginTop: 1}}>
                    <InputLabel>Độ khó</InputLabel>
                      <Select
                      inputProps={{readOnly: true}} 
                       onChange={(e)=>{
                        thisRef.current.style.border="none";
                          question.difficulty = e.target.value;
                          if(!question.new_or_edit){
                            question.new_or_edit = true;
                          }
                          setReload(!reload);
                        }} value={question.difficulty} sx={{width:'100%'}}>
                          <MenuItem value={1}>Dễ</MenuItem>
                          <MenuItem value={2}>Trung bình</MenuItem>
                          <MenuItem value={3}>Khó</MenuItem>
                        </Select>
                  </Grid>
                </>
              ):(
                <>
                  <Grid item xs={12} >
                  <Typography><b style={{fontSize:18}}>Các đáp án:</b></Typography>
                  </Grid>
                  <Grid item xs={12} >
                  </Grid>
                </>
              )}
              {question.type_id === 2 && (
                <Grid item xs={12} sx={{marginTop:1.5, marginBottom:1.5}}>
                    <Typography><b style={{fontSize:18}}>Nội dung câu hỏi:</b></Typography>
                </Grid>
              )}
                <Grid item xs={10}>
                  <CKEditor
                    id={generateId()}
                    editor={ ClassicEditor }
                    config={ {
                    plugins: [ Essentials, Bold, Italic, Paragraph ,Image, ImageToolbar,
                        ImageCaption, ImageStyle, ImageUpload, ImageResize, SimpleUploadAdapter,List,
                        ],
                    toolbar: [ 'undo', 'redo', '|', 'bold', 'italic','bulletedList', 'numberedList', '|','imageUpload' ],
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
                    data={question?.content}
                    onChange={(event, editor)=>{
                      thisRef.current.style.border="none";
                        const data = editor.getData(); 
                        question.content=data;
                        question.id = -1;
                        if(parentQuestion !== undefined){
                          if(parentQuestion.id !== -1)parentQuestion.id = -2;
                        }
                    }}
                  />
                </Grid>
                <Grid item xs={1.5} margin='20px 20px'>
                  {parentQuestion ? (
                    <Button onClick={onDeleteChildQuestion} color='error' variant='contained' >
                      Xóa
                    </Button>
                  ) : isExit ? (
                    <Button onClick={deleteInExam} color='error' variant='contained' >
                      Xóa khỏi đề
                    </Button>
                  ) : (
                    <Button onClick={addIntoExam} variant='contained' >
                      Thêm vào đề
                    </Button>
                  )}
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
            <Grid container spacing={gridSpacing}>
              {question.type_id === 2 && (
                <Grid item xs={12} sx={{marginBottom:-1.5}}>
                    <Typography><b style={{fontSize:18}}>Các đáp án:</b></Typography>
                </Grid>
              )}
              {question?.choices?.map((choice, index)=>{
                let idF = generateId();
                return (
                  <React.Fragment key={index}>
                  <Grid item xs={4}>
                    <TextField 
                      name={idF}
                      id={idF}
                      {...register(idF, { required: 'This field is required' })}
                      error={!!errors[idF]}
                      helperText={errors[idF] ? errors[idF].message : ''}
                      multiline 
                      onChange={(e)=>{
                      thisRef.current.style.border="none";
                      choice.content = e.target.value;
                      question.id = -1;
                      if(parentQuestion !== undefined){
                        parentQuestion.id = -1;
                      }
                      setReload(!reload);
                      }}
                    sx={{width:'100%'}} value={choice.content}>
                    </TextField>
                    </Grid>
                  <Grid item xs={1.5}>
                    <Select onChange={(e)=>{
                      e.stopPropagation();
                      thisRef.current.style.border="none";
                      choice.is_correct = e.target.value;
                      question.id = -1;
                      if(parentQuestion !== undefined){
                        parentQuestion.id = -1;
                      }
                      setReload(!reload);
                    }} value={choice.is_correct} sx={{width:'100%'}}>
                      <MenuItem value={true}>Đúng</MenuItem>
                      <MenuItem value={false}>Sai</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={1} sx={{display:'flex', alignItems:'flex-start'}}>
                    <Button sx={{marginTop:1}} onClick={()=>onDeleteChoice(choice)} variant='contained' color='error'>Xóa</Button>
                  </Grid>
                  <Grid item xs={5.5}/>
                </React.Fragment>
                )})}
                <Grid item xs={12}>
                  <Button onClick={addChoice} variant='contained' color='success'>Thêm đáp án</Button>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <NotificationComponent/>
        </Grid>
  </>
  );
};

export default QuestionItem;
