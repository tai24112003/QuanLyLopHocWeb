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
import { SET_COMMON_DATA, SET_EXAM, SET_LIST_QUESTION, SET_OBJ_EDITING } from 'store/actions';
import useNotification from './Notification';
import { runAddCommonQuestion, runCopyCommonQuestion, runDeleteCommonQuestion, runUpdateCommonQuestion } from 'api/question';
import { runGetSubjectOptions } from 'api/subject';
import ConfirmationDialog from 'ui-component/popup/confirmDelete';
import { scrollToCenter } from 'views/utilities/common';
import QuestionItemInExam from './QuestionItemInExam';
import Cookies from 'js-cookie';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const CommonQuestionItemInExam = ({ question }) => {
  const [chapters, setChapters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [open, setOpen] = useState(false);

  const thisRef = useRef();
  const [chaptersController, setChaptersController] = useState(-1);
  const [subjectController, setSubjectController] = useState(-1);
  const [diffController, setDiffController] = useState(1);
  const dispatch = useDispatch();
  const { showNotification, NotificationComponent } = useNotification();
  const content = useRef(question?.content);
  const exam = useSelector((state) => {
    return state.customization.exam;
  });
  const listQuestion = useSelector((state) => {
    return state.customization.listQuestion;
  });
  const editing = useSelector((state) => {
    return state.customization.editing;
  });

  let isEdit = question.id == editing?.id && question.type_id == editing?.type_id;

  const onDeleteQuestion = (event) => {
    event.stopPropagation();
    onDestroy(question);
  };

  const handleClickOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    onRemove();
    setOpen(false);
  };

  const onRemove = () => {
    let newData = [...exam.questions];
    newData = newData.filter((item) => !(item.type_id === question.type_id && item.id === question.id));
    dispatch({ type: SET_EXAM, exam: { ...exam, questions: newData } });
  };

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

  const onAddQuestion = () => {
    let newData = [...exam.questions];
    const id = Date.now() * -1;
    newData = newData.map((item) => {
      if (item.id == question.id) {
        return {
          ...item,
          questions: [
            ...item.questions,
            {
              id: id,
              content: '',
              chapter_id: question.chapter_id,
              difficulty: question.difficulty,
              isEditing: true,
              hideEdit: false,
              type_id: 1,
              canRemove: question.canRemove,
              choices: [{ id: -1, content: '', is_correct: true }]
            }
          ]
        };
      }
      return { ...item };
    });
    dispatch({ type: SET_EXAM, exam: { ...exam, questions: newData } });
    dispatch({ type: SET_OBJ_EDITING, editing: { id: id, type_id: 1 } });
    dispatch({ type: SET_COMMON_DATA, commonData: { id: question.id, chapter_id: question.chapter_id, difficulty: question.difficulty } });
  };

  const onChangeModeEdit = (e) => {
    e.stopPropagation();
    dispatch({ type: SET_OBJ_EDITING, editing: { id: question.id, type_id: question.type_id } });
  };

  const onCopy = (e) => {
    e.stopPropagation();
    const dataMap = [...exam.questions];
    runCopyCommonQuestion(question.id).then((data) => {
      if (data.success) {
        const newData = data.data;
        dispatch({
          type: SET_EXAM,
          exam: {
            ...exam,
            questions: [
              {
                ...newData,
                subject_id: subjectController,
                canRemove: true,
                questions: newData.questions.map((item) => ({ ...item, canRemove: true }))
              },
              ...dataMap
            ]
          }
        });
        setTimeout(() => {
          showNotification('Sao chép thành công', 'success'), scrollToCenter(`${newData.id}-${newData.type_id}`);
        }, 100);
      }
    });
  };

  const onChangeModeView = (e) => {
    e.stopPropagation();
    if (subjectController === -1) {
      thisRef.current.style.border = '1px solid red';
      showNotification('Vui lòng chọn chủ đề!', 'error');
      return;
    }
    if (chaptersController === -1 || diffController === -1) {
      thisRef.current.style.border = '1px solid red';
      showNotification('Vui lòng chọn chương!', 'error');
      return;
    }
    if (diffController === -1) {
      thisRef.current.style.border = '1px solid red';
      showNotification('Vui lòng chọn độ khó!', 'error');
      return;
    }
    if (content.current === '') {
      thisRef.current.style.border = '1px solid red';
      showNotification('Không để trống nội dung câu hỏi!', 'error');
      return;
    }

    const dataMap = exam.questions.map((item) => {
      if (item.id === question.id)
        return {
          ...item,
          subject_id: subjectController,
          chapter_id: chaptersController,
          difficulty: diffController,
          content: content.current
        };
      return {
        ...item
      };
    });
    if (question.id == -2) {
      runAddCommonQuestion({
        content: content.current
      })
        .then((data) => {
          if (data.success) {
            const dataMap = exam.questions.map((item) => {
              if (item.id === question.id && item.type_id === question.type_id)
                return {
                  ...item,
                  id: data.data[0].id,
                  subject_id: subjectController,
                  chapter_id: chaptersController,
                  difficulty: diffController,
                  content: content.current
                };
              return {
                ...item
              };
            });
            dispatch({
              type: SET_EXAM,
              exam: {
                ...exam,
                questions: dataMap
              }
            });
            dispatch({ type: SET_OBJ_EDITING, editing: { id: -1, type_id: 1 } });
            dispatch({
              type: SET_COMMON_DATA,
              commonData: { id: data.data[0].id, chapter_id: chaptersController, difficulty: diffController }
            });
            setTimeout(() => showNotification('Lưu thành công!', 'success'), 100);
          } else {
            setTimeout(() => showNotification('Lưu không thành công! Vui lòng liên hệ người quản trị', 'error'), 0);
          }
        })
        .catch((e) => {
          setTimeout(() => showNotification('Lưu không thành công! Vui lòng liên hệ người quản trị', 'error'), 0);
        });
    } else {
      runUpdateCommonQuestion({
        id: question.id,
        content: content.current,
        difficulty: diffController,
        chapter_id: chaptersController
      })
        .then((data) => {
          if (data.success) {
            dispatch({ type: SET_EXAM, exam: { ...exam, questions: dataMap } });
            dispatch({ type: SET_OBJ_EDITING, editing: null });
            setTimeout(() => showNotification('Lưu thành công!', 'success'), 100);
          } else {
            setTimeout(() => showNotification('Lưu không thành công! Vui lòng liên hệ người quản trị', 'error'), 0);
          }
        })
        .catch((e) => {
          setTimeout(() => showNotification('Lưu không thành công! Vui lòng liên hệ người quản trị', 'error'), 0);
        });
    }
    thisRef.current.style.border = 'none';
  };

  return (
    <>
      <Grid item xs={12}>
        <Accordion id={`${question.id}-${question.type_id}`} ref={thisRef}>
          <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1-content" id="panel1-header">
            <Grid container>
              <Grid item xs={10} mb={1}>
                <Grid container>
                  <Grid item xs={12} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
                    <Box width="100%" display="flex" flexDirection="row" alignItems="center">
                      <b>Chủ đề:</b>
                      {isEdit ? (
                        <>
                          <Box mx={0.5}></Box>
                          <Select
                            disabled={true}
                            style={{ height: '25px', overflow: 'hidden' }}
                            size="small"
                            inputProps={{
                              style: {
                                fontSize: '20px',
                                padding: '10px'
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              let lstChapter = subjects.find((item) => item.id === e.target.value).Chapters;
                              setSubjectController(e.target.value);
                              setChapters(lstChapter);
                              setChaptersController(-1);
                            }}
                            value={subjectController}
                          >
                            <MenuItem value={-1}>Chọn chủ đề</MenuItem>
                            {subjects?.map((subject, index) => (
                              <MenuItem key={index} value={subject.id}>
                                {subject.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <Box mx={2}></Box>
                        </>
                      ) : (
                        <Box bgcolor="#2196f3" ml={0.5} mr={1.5} px={1} borderRadius={5} textAlign={'center'} color={'#ffff'}>
                          {subjects.find((item) => item.id === question.subject_id)?.name ?? ''}
                        </Box>
                      )}
                      <b> Chương:</b>
                      {isEdit ? (
                        <>
                          <Box mx={0.5}></Box>
                          <Select
                            style={{ height: '25px', overflow: 'hidden' }}
                            size="small"
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              setChaptersController(e.target.value);
                            }}
                            value={chaptersController}
                          >
                            <MenuItem value={-1}>Chọn chương</MenuItem>
                            {chapters?.map((chapter, index) => (
                              <MenuItem key={index} value={chapter.id}>
                                {chapter.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <Box mx={2}></Box>
                        </>
                      ) : (
                        <Box ml={0.5} mr={1.5} bgcolor="#00e676" px={1} borderRadius={5} textAlign={'center'} color={'#ffff'}>
                          {chapters?.find((item) => item.id === question.chapter_id)?.name ?? ''}
                        </Box>
                      )}
                      <b>Độ khó:</b>
                      {isEdit ? (
                        <>
                          <Box mx={0.5}></Box>
                          <Select
                            style={{ height: '25px', overflow: 'hidden' }}
                            size="small"
                            inputProps={{ padding: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              setDiffController(e.target.value);
                            }}
                            value={diffController}
                            sx={{ padding: 0 }}
                          >
                            <MenuItem value={1}>Dễ</MenuItem>
                            <MenuItem value={2}>Trung bình</MenuItem>
                            <MenuItem value={3}>Khó</MenuItem>
                          </Select>
                        </>
                      ) : (
                        <Box ml={0.5} mr={1.5} bgcolor="#ffe57f" px={1} borderRadius={5} textAlign={'center'} color={'#000000'}>
                          {question.difficulty == 1 ? 'Dễ' : question.difficulty == 2 ? 'Trung bình' : 'Khó'}
                        </Box>
                      )}
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
              <Grid item xs={9.8}>
                <CKEditor
                  disabled={!isEdit}
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
                    isEdit &&
                      editor.ui.view.editable.element.addEventListener('click', (event) => {
                        event.stopPropagation();
                      });
                  }}
                />
              </Grid>
              <Grid item xs={0.1}></Grid>
              <Grid item xs={1.6} margin="0px 20px">
                {isEdit ? (
                  <>
                    <Button onClick={onChangeModeView} variant="contained" color="success">
                      Lưu
                    </Button>
                  </>
                ) : editing === null ? (
                  <>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Button
                          sx={{ width: '100%' }}
                          disabled={!question.canRemove}
                          onClick={onChangeModeEdit}
                          variant="contained"
                          color="warning"
                        >
                          Sửa
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button sx={{ width: '100%' }} onClick={onCopy} variant="contained" color="success">
                          Copy
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid item mt={1} xs={12}>
                      <Button
                        disabled={!question.canRemove}
                        sx={{ width: '100%' }}
                        onClick={handleClickOpen}
                        variant="contained"
                        color="error"
                      >
                        Xóa khỏi đề
                      </Button>
                    </Grid>
                  </>
                ) : (
                  <></>
                )}
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
                  <QuestionItemInExam parentQuestion={question} question={questionItem} />
                </React.Fragment>
              ))}
              <Grid item xs={12}>
                {isEdit && question.id > 0 && (
                  <Button onClick={onAddQuestion} variant="contained">
                    Thêm câu hỏi
                  </Button>
                )}
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
      <ConfirmationDialog open={open} handleClose={handleClose} handleConfirm={handleConfirm} />
      <NotificationComponent />
    </>
  );
};

export default CommonQuestionItemInExam;
