import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, MenuItem, Select, TextField } from '@mui/material';
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
import useNotification from './Notification';
import { useDispatch, useSelector } from 'react-redux';
import { SET_COMMON_DATA, SET_EXAM, SET_LIST_QUESTION, SET_OBJ_EDITING, TRIGGER_RELOAD } from 'store/actions';
import { runGetSubjectOptions } from 'api/subject';

const QuestionItem = ({ question, parentQuestion }) => {
  const [chapters, setChapters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chaptersController, setChaptersController] = useState(-1);
  const [subjectController, setSubjectController] = useState(-1);
  const [choiceController, setChoiceController] = useState(question?.choices ?? []);
  const thisRef = useRef();
  const dispatch = useDispatch();
  const { showNotification, NotificationComponent } = useNotification();
  const content = useRef(question?.content);
  const exam = useSelector((state) => {
    return state.customization.exam;
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
      content.current = question?.content;
      if (parentQuestion) {
        setChoiceController(parentQuestion.questions.find((item) => item.id === question.id)?.choices);
        setChaptersController(parentQuestion.questions.find((item) => item.id === question.id)?.chapter_id);
        content.current = parentQuestion.questions.find((item) => item.id === question.id)?.content;
      }
    });
  }, []);

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
      <Grid mb={2} item xs={12}>
        <Accordion id={`${question.id}-${question.type_id}`} ref={thisRef}>
          <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1-content" id="panel1-header">
            <Grid container>
              {question.type_id === 2 ? (
                <Grid item xs={10} mb={1}>
                  <Grid container>
                    <Grid item xs={12} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
                      <Box width="100%" display="flex" flexDirection="row" alignItems="center">
                        <b> Môn:</b>
                        <Box bgcolor="#4673fe" ml={0.5} mr={1.5} px={1} borderRadius={5} textAlign={'center'} color={'#ffff'}>
                          {subjects?.find((item) => item.id === question.subject_id)?.name ?? ''}
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
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <Grid item xs={6} />
              )}
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
                {!parentQuestion && (
                  <>
                    {isExits ? (
                      <Button variant="contained" color="error" onClick={removeOutExam}>
                        Xóa khỏi đề
                      </Button>
                    ) : (
                      <Button variant="contained" onClick={addInExam}>
                        Thêm vào đề
                      </Button>
                    )}
                  </>
                )}
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <b>Các đáp án:</b>
              </Grid>
              {choiceController?.map((choice, index) => {
                let idF = generateId();
                return (
                  <React.Fragment key={index}>
                    <Grid item xs={4} style={{ paddingTop: 10 }}>
                      <TextField
                        size="small"
                        name={idF}
                        id={idF}
                        multiline
                        inputProps={{ readOnly: true }}
                        onChange={(e) => {
                          thisRef.current.style.border = 'none';
                          let newData = [...choiceController];
                          newData[index] = { ...choice, content: e.target.value };
                          setChoiceController(newData);
                        }}
                        sx={{ width: '100%' }}
                        value={choice.content}
                      ></TextField>
                    </Grid>
                    <Grid item xs={1.5} style={{ paddingTop: 10 }}>
                      <Select
                        size="small"
                        inputProps={{ readOnly: true }}
                        onChange={(e) => {
                          e.stopPropagation();
                          thisRef.current.style.border = 'none';
                          let newData = [...choiceController];
                          newData[index] = { ...choice, is_correct: e.target.value };
                          setChoiceController(newData);
                        }}
                        value={choice.is_correct}
                        sx={{ width: '100%' }}
                      >
                        <MenuItem value={true}>Đúng</MenuItem>
                        <MenuItem value={false}>Sai</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={1} style={{ paddingTop: 10, display: 'flex', alignItems: 'center' }}></Grid>
                    <Grid item xs={5.5} md={0} />
                  </React.Fragment>
                );
              })}
              <Grid item xs={12}></Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <NotificationComponent />
      </Grid>
    </>
  );
};

export default QuestionItem;
