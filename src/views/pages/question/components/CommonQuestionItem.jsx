import React, { useEffect, useRef, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
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
import QuestionItem from './QuestionItem';
import generateId from 'utils/generate-id';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const CommonQuestionItem = ({ arrChapter = [], question, onDestroy, subjects }) => {
  const [reload, setReload] = useState(false);
  const [chapters, setChapters] = useState([]);
  const thisRef = useRef();
  const [chaptersController, setChaptersController] = useState(-1);
  const [subjectController, setSubjectController] = useState(-1);
  const [diffController, setDiffController] = useState(1);

  question.ref = thisRef.current;
  const onDeleteQuestion = (event) => {
    event.stopPropagation();
    onDestroy(question);
  };

  useEffect(() => {
    setChapters(arrChapter);
  }, []);
  useEffect(() => {
    if (chapters.length == 0) {
      setChaptersController(-1);
      setSubjectController(-1);
      setDiffController(1);
    } else {
      setChaptersController(question.chapter_id);
      setSubjectController(question.subject_id);
      setDiffController(question.difficulty);
    }
  }, [chapters]);

  const onAddQuestion = () => {
    if (question.questions.length >= 15) return;
    question.questions.push({
      id: -1,
      content: '',
      chapter_id: -1,
      subject_id: 1,
      difficulty: 1,
      new_or_edit: true,
      type_id: 1,
      choices: [{ id: -1, content: '', is_correct: true }]
    });
    setReload(!reload);
  };

  return (
    <>
      <Grid item xs={12} className="fade-in">
        <Accordion ref={thisRef}>
          <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1-content" id="panel1-header">
            <Grid container>
              <Grid item xs={12} sx={{ marginBottom: 1 }}>
                <Typography>
                  <b>Nội dung câu hỏi</b>
                </Typography>
              </Grid>
              <Grid item xs={5.8}>
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
                    if (!question.new_or_edit) {
                      question.new_or_edit = true;
                    }
                  }}
                />
              </Grid>
              <Grid item xs={0.2}></Grid>
              <Grid item xs={4}>
                <Grid container>
                  <Grid item xs={2}>
                    Môn:
                  </Grid>
                  <Grid item xs={10} sx={{ marginBottom: 1 }}>
                    <Select
                      style={{ height: '25px', overflow: 'hidden' }}
                      onChange={(e) => {
                        thisRef.current.style.border = 'none';
                        if (!question.new_or_edit) {
                          question.new_or_edit = true;
                        }
                        question.subject_id = e.target.value;
                        let lstChapter = subjects.find((item) => item.id === e.target.value)?.Chapters;
                        question.chapter_id = lstChapter[0]?.id ?? '';
                        setSubjectController(e.target.value);
                        setChapters(lstChapter);
                        setReload(!reload);
                      }}
                      value={subjectController}
                      sx={{ width: '100%' }}
                    >
                      <MenuItem value={-1}>Chọn Môn</MenuItem>
                      {subjects.map((subject, index) => (
                        <MenuItem key={index} value={subject.id}>
                          {subject.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item xs={2}>
                    Chương:
                  </Grid>
                  <Grid item xs={10} sx={{ marginBottom: 1 }}>
                    <Select
                      style={{ height: '25px', overflow: 'hidden' }}
                      onChange={(e) => {
                        thisRef.current.style.border = 'none';
                        if (!question.new_or_edit) {
                          question.new_or_edit = true;
                        }
                        question.chapter_id = e.target.value;
                        setChaptersController(e.target.value);
                        setReload(!reload);
                      }}
                      value={chaptersController}
                      sx={{ width: '100%' }}
                    >
                      <MenuItem value={-1}>Chọn chương</MenuItem>
                      {chapters?.map((chapter, index) => (
                        <MenuItem key={index} value={chapter.id}>
                          {chapter.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item xs={2}>
                    Độ khó:
                  </Grid>
                  <Grid item xs={10}>
                    <Select
                      style={{ height: '25px', overflow: 'hidden' }}
                      onChange={(e) => {
                        thisRef.current.style.border = 'none';
                        if (!question.new_or_edit) {
                          question.new_or_edit = true;
                        }
                        question.difficulty = e.target.value;
                        setDiffController(e.target.value);
                        setReload(!reload);
                      }}
                      value={diffController}
                      sx={{ width: '100%' }}
                    >
                      <MenuItem key={generateId()} value={1}>
                        Dễ
                      </MenuItem>
                      <MenuItem key={generateId()} value={2}>
                        Trung bình
                      </MenuItem>
                      <MenuItem key={generateId()} value={3}>
                        Khó
                      </MenuItem>
                    </Select>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={1.5} margin="20px 20px">
                <Button onClick={onDeleteQuestion} variant="contained" color="error">
                  Xóa
                </Button>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sx={{ marginBottom: -3 }}>
                <Typography>
                  <b>Các câu hỏi:</b>
                </Typography>
              </Grid>
              {question?.questions?.map((questionItem, index) => (
                <React.Fragment key={generateId()}>
                  <QuestionItem
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
      </Grid>
    </>
  );
};

export default CommonQuestionItem;
