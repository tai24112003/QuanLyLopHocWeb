import React, { useEffect, useRef, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionSummary, Button, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  Bold,
  ClassicEditor,
  Essentials,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Italic,
  List,
  Paragraph,
  SimpleUploadAdapter
} from 'ckeditor5';
import { gridSpacing } from 'store/constant';
import generateId from 'utils/generate-id';
import { useFormContext } from 'react-hook-form';
import { runDeleteChoice } from 'api/choice';
import useNotification from './Notification';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const QuestionItem = ({ question, onDestroy, parentQuestion, subjects, infoExam, inExam, updateList }) => {
  const [reload, setReload] = useState(false);
  const {
    register,
    setValue,
    triggerValidation,
    formState: { errors }
  } = useFormContext();
  const [chapters, setChapters] = useState([]);
  const [isEditing, setIsEditing] = useState({
    subject: false,
    chapter: false,
    difficulty: false,
    content: false
  });
  const thisRef = useRef();
  const { showNotification, NotificationComponent } = useNotification();
  const [isExit, setIsExit] = useState(infoExam?.questions.some((item) => item.id === question.id));

  useEffect(() => {
    let lstChapter = subjects.find((item) => item.id === question.subject_id)?.Chapters;
    setChapters(lstChapter);
  }, []);

  question.ref = thisRef.current;
  const addChoice = () => {
    const length = question.choices.length;
    if (question.choices[length - 1]?.content == '') {
      showNotification('Không để trống đáp án', 'error');
      return;
    }
    if (length >= 10) return;
    question.choices.push({
      id: -1,
      content: '',
      is_correct: false
    });
    question.id = -1;
    setReload(!reload);
  };

  const onDeleteChoice = (value) => {
    const idx = question.choices.indexOf(value);
    if (question.choices.length < 2) {
      showNotification('Phải có ít nhất 1 đáp án', 'error');
      return;
    }
    if (idx > -1) {
      question.choices.splice(idx, 1);
      question.id = -1;
      if (parentQuestion !== undefined) {
        if (parentQuestion.id !== -1) parentQuestion.id = -2;
      }
      setReload(!reload);
    }
  };

  const onDeleteChildQuestion = (event) => {
    event.stopPropagation();
    parentQuestion.id = -1;
    onDestroy(question);
  };

  const addIntoExam = (event) => {
    event.stopPropagation();
    setIsEditing({ subject: false, chapter: false, difficulty: false, content: false });
    if (infoExam.questions.length === infoExam.count) {
      showNotification('Đề đã đủ số câu', 'error');
      return;
    }
    infoExam.questions = [question, ...infoExam.questions];
    setIsExit(true);
    setTimeout(() => {
      showNotification('Đã thêm thành công', 'success');
    }, 0);
  };

  const deleteInExam = (event) => {
    event.stopPropagation();
    if (!inExam) {
      infoExam.questions = infoExam.questions.filter((item) => item.id !== question.id);
      setIsExit(false);
      setTimeout(() => {
        showNotification('Đã xóa thành công', 'success');
      }, 0);
    } else {
      updateList(question);
    }
  };

  return (
    <>
      <Grid item xs={12} sx={question.type_id === 2 && { marginBottom: 3 }}>
        <Accordion ref={thisRef} sx={question.type_id === 1 ? { border: '1px solid #ccced2' } : {}}>
          <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1-content" id="panel1-header">
            <Grid container>
              <Grid item xs={12} sx={{ marginBottom: 1.5 }}>
                <b>Nội dung câu hỏi</b>
              </Grid>
              <Grid item xs={6}>
                <CKEditor
                  id={generateId()}
                  editor={ClassicEditor}
                  config={{
                    plugins: [
                      Essentials,
                      Bold,
                      Italic,
                      Paragraph,
                      Image,
                      ImageToolbar,
                      ImageCaption,
                      ImageStyle,
                      ImageUpload,
                      ImageResize,
                      SimpleUploadAdapter,
                      List
                    ],
                    toolbar: ['undo', 'redo', '|', 'bold', 'italic', 'bulletedList', 'numberedList', '|', 'imageUpload'],
                    simpleUpload: {
                      uploadUrl: `${import.meta.env.VITE_APP_API_URL}upload`,
                      headers: {
                        'X-CSRF-TOKEN': 'CSRF-Token',
                        Authorization: 'Bearer <JSON Web Token>'
                      }
                    },
                    image: {
                      toolbar: [
                        'imageStyle:alignLeft',
                        'imageStyle:full',
                        'imageStyle:inline',
                        'imageStyle:alignRight',
                        '|',
                        'imageResize',
                        'imageTextAlternative',
                        'imageCaption'
                      ],
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
                  }}
                  data={question?.content}
                  onChange={(event, editor) => {
                    thisRef.current.style.border = 'none';
                    const data = editor.getData();
                    question.content = data;
                    if (question.id !== -1) {
                      question.id = -1;
                    }
                    if (parentQuestion !== undefined) {
                      if (parentQuestion.id !== -1) parentQuestion.id = -2;
                    }
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <Grid container>
                  {question.type_id === 2 ? (
                    <>
                      <Grid item xs={12}>
                        <Typography sx={{ margin: 2, marginTop: 0 }}>
                          Môn: <b>{subjects.find((item) => item.id == question.subject_id).name}</b>
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography sx={{ margin: 2, marginTop: 0 }}>
                          Chương: <b>{chapters?.find((item) => item.id == question.chapter_id)?.name}</b>
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography sx={{ margin: 2, marginTop: 0 }}>
                          Độ khó: <b>{question.difficulty == 1 ? 'Dễ' : question.difficulty == 2 ? 'Trung bình' : 'Khó'}</b>
                        </Typography>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={12}></Grid>
                    </>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={1.5} margin="20px 20px">
                {parentQuestion ? (
                  <Button onClick={onDeleteChildQuestion} color="error" variant="contained">
                    Xóa
                  </Button>
                ) : isExit ? (
                  <Button onClick={deleteInExam} color="error" variant="contained">
                    Xóa khỏi đề
                  </Button>
                ) : (
                  <Button onClick={addIntoExam} variant="contained">
                    Thêm vào đề
                  </Button>
                )}
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={gridSpacing}>
              {question.type_id === 2 && (
                <Grid item xs={12} sx={{ marginBottom: -1.5 }}>
                  <Typography>
                    <b>Các đáp án:</b>
                  </Typography>
                </Grid>
              )}
              {question?.choices?.map((choice, index) => {
                let idF = generateId();
                return (
                  <React.Fragment key={index}>
                    <Grid item xs={4}>
                      <TextField
                        size="small"
                        name={idF}
                        id={idF}
                        {...register(idF, { required: 'This field is required' })}
                        error={!!errors[idF]}
                        helperText={errors[idF] ? errors[idF].message : ''}
                        multiline
                        onChange={(e) => {
                          thisRef.current.style.border = 'none';
                          choice.content = e.target.value;
                          question.id = -1;
                          if (parentQuestion !== undefined) {
                            parentQuestion.id = -1;
                          }
                          setReload(!reload);
                        }}
                        sx={{ width: '100%' }}
                        value={choice.content}
                      ></TextField>
                    </Grid>
                    <Grid item xs={1.5}>
                      <Select
                        size="small"
                        onChange={(e) => {
                          e.stopPropagation();
                          thisRef.current.style.border = 'none';
                          choice.is_correct = e.target.value;
                          question.id = -1;
                          if (parentQuestion !== undefined) {
                            parentQuestion.id = -1;
                          }
                          setReload(!reload);
                        }}
                        value={choice.is_correct ?? ''}
                        sx={{ width: '100%' }}
                      >
                        <MenuItem value={true}>Đúng</MenuItem>
                        <MenuItem value={false}>Sai</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button size="small" onClick={() => onDeleteChoice(choice)} variant="contained" color="error">
                        Xóa
                      </Button>
                    </Grid>
                    <Grid item xs={5.5} />
                  </React.Fragment>
                );
              })}
              <Grid item xs={12}>
                <Button onClick={addChoice} variant="contained" color="success">
                  Thêm đáp án
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <NotificationComponent />
      </Grid>
    </>
  );
};

export default QuestionItem;
