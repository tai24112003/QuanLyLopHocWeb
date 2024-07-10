import React, { useEffect, useRef, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, MenuItem, Select, TextField, Typography } from '@mui/material';
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
import { useDispatch, useSelector } from 'react-redux';
import { SET_EXAM } from 'store/actions';
import useNotification from './Notification';
import { runGetSubjectOptions } from 'api/subject';
import QuestionItem from './QuestionItem';
import Cookies from 'js-cookie';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const CommonQuestionItemForm = ({ question }) => {
  const [chapters, setChapters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const thisRef = useRef();
  const [chaptersController, setChaptersController] = useState(-1);
  const [subjectController, setSubjectController] = useState(-1);
  const [diffController, setDiffController] = useState(1);
  const dispatch = useDispatch();
  const content = useRef(question?.content);
  const { showNotification, NotificationComponent } = useNotification();
  const exam = useSelector((state) => {
    return state.customization.exam;
  });
  const user = useSelector((state) => {
    return state.customization.user;
  });

  const isExits = exam.questions.find((item) => item.id === question.id && item.type_id === question.type_id);

  useEffect(() => {
    runGetSubjectOptions().then((data) => {
      setSubjects(data.data);
      setSubjectController(question.subject_id);
      let arr = [];
      arr = data.data?.find((item) => item.id === question.subject_id)?.Chapters;
      setChapters(arr);
      setChaptersController(question.chapter_id);
    });
  }, []);

  useEffect(() => {
    if (chapters?.length == 0) {
      setChaptersController(-1);
      setSubjectController(-1);
      setDiffController(1);
    } else {
      setChaptersController(question.chapter_id);
      setSubjectController(question.subject_id);
      setDiffController(question.difficulty);
    }
  }, [chapters]);

  const addInExam = (e) => {
    e.stopPropagation();
    if (exam.count === exam.questions.length) {
      showNotification('Đề đã đủ câu không thể thêm', 'error');
      return;
    }
    dispatch({ type: SET_EXAM, exam: { ...exam, questions: [...exam.questions, { ...question, canRemove: true }] } });
  };

  const removeOutExam = (e) => {
    e.stopPropagation();
    let newData = [...exam.questions];

    newData = newData.filter((item) => !(item.type_id === question.type_id && item.id === question.id));
    dispatch({ type: SET_EXAM, exam: { ...exam, questions: newData } });
  };

  return (
    <>
      <Grid item xs={12}>
        <Accordion sx={{ marginBottom: 3 }} id={`${question.id}-${question.type_id}`} ref={thisRef}>
          <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1-content" id="panel1-header">
            <Grid container>
              <Grid item xs={10} mb={1}>
                <Grid container>
                  <Grid item xs={12} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
                    <Box width="100%" display="flex" flexDirection="row" alignItems="center">
                      <b> Môn:</b>
                      <Box bgcolor="#2196f3" ml={0.5} mr={1.5} px={1} borderRadius={5} textAlign={'center'} color={'#ffff'}>
                        {subjects.find((item) => item.id === question.subject_id)?.name ?? ''}
                      </Box>
                      <b> Chương:</b>
                      <Box ml={0.5} mr={1.5} bgcolor="#00e676" px={1} borderRadius={5} textAlign={'center'} color={'#ffff'}>
                        {chapters?.find((item) => item.id === question.chapter_id)?.name ?? ''}
                      </Box>
                      <b>Độ khó:</b>
                      <Box ml={0.5} mr={1.5} bgcolor="#ffe57f" px={1} borderRadius={5} textAlign={'center'} color={'#000000'}>
                        {question.difficulty == 1 ? 'Dễ' : question.difficulty == 2 ? 'Trung bình' : 'Khó'}
                      </Box>
                      <b>Trạng thái:</b>
                      {!question.canRemove ? (
                        <Box ml={0.5} mr={1.5} bgcolor="#f44336" px={1} borderRadius={5} textAlign={'center'} color={'#fff'}>
                          Đã được dùng
                        </Box>
                      ) : (
                        <Box ml={0.5} mr={1.5} bgcolor="#e0e0e0" px={1} borderRadius={5} textAlign={'center'} color={'#000000'}>
                          Chưa dùng
                        </Box>
                      )}
                      {question.authorId !== user.id && (
                        <>
                          <b>Chủ sở hữu:</b>
                          <Box ml={0.5} mr={1.5} bgcolor="#00e676" px={1} borderRadius={5} textAlign={'center'} color={'#ffff'}>
                            {question.author?.name ?? ''}
                          </Box>
                        </>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={9.8}>
                <CKEditor
                  disabled={true}
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
                        Authorization: `Bearer ${Cookies.get('asset_token')}`
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
                  data={content.current}
                  onChange={(event, editor) => {
                    thisRef.current.style.border = 'none';
                    const data = editor.getData();
                    content.current = data;
                  }}
                  onReady={(editor) => {
                    editor.ui.view.editable.element.addEventListener('click', (event) => {
                      event.stopPropagation();
                    });
                  }}
                />
              </Grid>
              <Grid item xs={0.1}></Grid>
              <Grid item xs={1.6} margin="20px 20px">
                <>
                  <Grid item mt={1} xs={12}>
                    {isExits ? (
                      <Button variant="contained" color="error" onClick={removeOutExam}>
                        Xóa khỏi đề
                      </Button>
                    ) : (
                      <Button variant="contained" onClick={addInExam}>
                        {question.authorId === user.id ? 'Thêm vào đề' : 'Copy vào đề'}
                      </Button>
                    )}
                  </Grid>
                </>
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
                <React.Fragment key={questionItem.id}>
                  <QuestionItem parentQuestion={question} question={questionItem} />
                </React.Fragment>
              ))}
              <Grid item xs={12}></Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <NotificationComponent />
      </Grid>
    </>
  );
};

export default CommonQuestionItemForm;
