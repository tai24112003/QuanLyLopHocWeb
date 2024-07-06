import React, { useEffect, useRef, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
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
import QuestionItem from './QuestionItem';
import generateId from 'utils/generate-id';
import useNotification from './Notification';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const CommonQuestionItem = ({ question, onDestroy, subjects, infoExam, inExam, updateList = () => {} }) => {
  const [reload, setReload] = useState(false);
  const [chapters, setChapters] = useState([]);
  const thisRef = useRef();
  const [isExit, setIsExit] = useState(infoExam?.questions.some((item) => item.id === question.id));
  const { showNotification, NotificationComponent } = useNotification();

  question.ref = thisRef.current;
  const onDeleteQuestion = (event) => {
    event.stopPropagation();
    onDestroy(question);
  };

  useEffect(() => {
    let lstChapter = subjects.find((item) => item.id === question.subject_id)?.Chapters;
    setChapters(lstChapter);
  }, []);

  useEffect(() => {
    setReload(!reload);
  }, [chapters]);

  const onAddQuestion = () => {
    if (question.questions.length >= 15) return;
    question.questions.push({
      id: -1,
      content: '',
      chapter_id: ``,
      subject_id: 1,
      difficulty: 1,
      new_or_edit: true,
      type_id: 1,
      choices: [{ id: -1, content: '', is_correct: true }]
    });
    setReload(!reload);
  };

  const addIntoExam = (event) => {
    event.stopPropagation();
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
      <Grid item xs={12}>
        <Accordion ref={thisRef} sx={{ marginBottom: 3 }}>
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
                  }}
                />
              </Grid>
              <Grid item xs={4}>
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
              </Grid>
              <Grid item xs={1.5} margin="20px 20px">
                {isExit ? (
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
              <Grid item xs={12} sx={{ marginBottom: -2 }}>
                <Typography>
                  <b>Các câu hỏi con:</b>
                </Typography>
              </Grid>
              {question?.questions?.map((questionItem, index) => (
                <React.Fragment key={index}>
                  <QuestionItem
                    infoExam={infoExam}
                    parentQuestion={question}
                    subjects={subjects}
                    onDestroy={onDestroy}
                    question={questionItem}
                    lenght={question?.questions}
                  />
                </React.Fragment>
              ))}
              <Grid item xs={12}>
                <Button onClick={onAddQuestion} variant="contained">
                  Thêm câu hỏi
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

export default CommonQuestionItem;
