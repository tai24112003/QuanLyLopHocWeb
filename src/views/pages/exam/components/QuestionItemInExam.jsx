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
import { runDeleteChoice } from 'api/choice';
import useNotification from './Notification';
import { useDispatch, useSelector } from 'react-redux';
import { SET_COMMON_DATA, SET_EXAM, SET_LIST_QUESTION, SET_OBJ_EDITING, TRIGGER_RELOAD } from 'store/actions';
import { runGetSubjectOptions } from 'api/subject';
import { runAddQuestion, runDeleteQuestionDatas, runUpdateQuestion } from 'api/question';
import ConfirmationDialog from 'ui-component/popup/confirmDelete';
import { scrollToCenter } from 'views/utilities/common';

const QuestionItemInExam = ({ question, parentQuestion }) => {
  const [reload, setReload] = useState(false);
  const [open, setOpen] = useState(false);
  const [questionSelected, setQuestionSelected] = useState();
  const [chapters, setChapters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chaptersController, setChaptersController] = useState(-1);
  const [subjectController, setSubjectController] = useState(-1);
  const [diffController, setDiffController] = useState(1);
  const [choiceController, setChoiceController] = useState(question?.choices ?? []);
  const thisRef = useRef();
  const { showNotification, NotificationComponent } = useNotification();
  const dispatch = useDispatch();
  const content = useRef(question?.content);
  const listQuestion = useSelector((state) => {
    return state.customization.listQuestion;
  });
  const exam = useSelector((state) => {
    return state.customization.exam;
  });
  const editing = useSelector((state) => {
    return state.customization.editing;
  });
  const commonData = useSelector((state) => {
    return state.customization.commonData;
  });
  const trigger = useSelector((state) => {
    return state.customization.trigger;
  });
  let isEdit = question.id == editing?.id && question.type_id == editing?.type_id;

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

  const addChoice = () => {
    const length = choiceController?.length ?? 1;
    if (choiceController[length - 1]?.content == '') {
      showNotification('Không để trống đáp án', 'error');
      return;
    }
    if (length >= 10) return;
    setChoiceController([
      ...choiceController,
      {
        id: -1,
        content: '',
        is_correct: false
      }
    ]);
  };

  const onCopy = (e) => {
    e.stopPropagation();
    const dataMap = [...exam.questions];
    runAddQuestion(question).then((data) => {
      if (data.success) {
        let newQuestion = {};
        newQuestion = data.data;
        dispatch({
          type: SET_EXAM,
          exam: {
            ...exam,
            questions: [
              {
                ...newQuestion,
                subject_id: subjectController,
                chapters: question.chapters,
                canRemove: true
              },
              ...dataMap
            ]
          }
        });
        setTimeout(() => {
          showNotification('Sao chép thành công', 'success'), scrollToCenter(`${newQuestion.id}-${newQuestion.type_id}`);
        }, 100);
      } else {
        showNotification('Sao chép không thành công', 'error');
      }
    });
  };

  const onDeleteChoice = (value) => {
    const idx = choiceController.indexOf(value);
    if (choiceController.length < 2) {
      showNotification('Phải có ít nhất 1 đáp án', 'error');
      return;
    }
    if (value.id !== -1) {
      runDeleteChoice(value.id)
        .then((data) => {
          if (data.success) {
            showNotification('Xóa thành công', 'success');
            let newData = [...choiceController];
            newData.splice(idx, 1);
            setChoiceController(newData);
            setTimeout(() => setReload(!reload), 1000);
          } else {
            showNotification('Xóa thất bại', 'error');
          }
        })
        .catch((err) => {
          showNotification('Xóa thất bại', 'error');
        });
    } else if (idx > -1) {
      let newData = [...choiceController];
      newData.splice(idx, 1);
      setChoiceController(newData);
    }
  };

  const onChangeModeEdit = (e) => {
    e.stopPropagation();
    dispatch({ type: SET_OBJ_EDITING, editing: { id: question.id, type_id: question.type_id } });
  };

  const onRemove = () => {
    if (parentQuestion) {
      let newData = [...exam.questions];
      runDeleteQuestionDatas(question.id)
        .then((data) => {
          if (data.success) {
            showNotification('Đã xóa thành công', 'success');
            setTimeout(() => {
              let parent = newData.find((item) => {
                return item.id === parentQuestion.id && item.type_id === parentQuestion.type_id;
              });
              let newParent = {
                ...parent,
                questions: parent.questions.filter((item) => !(item.type_id === question.type_id && item.id === question.id))
              };
              newData = newData.map((item) => {
                if (item.id === parentQuestion.id && item.type_id === parentQuestion.type_id) {
                  return newParent;
                }
                return { ...item };
              });
              dispatch({ type: SET_EXAM, exam: { ...exam, questions: newData } });
            }, 2000);
          } else {
            showNotification('Xóa không thành công', 'error');
          }
        })
        .catch((e) => {
          showNotification('Có lỗi xảy ra, liên hệ quản trị viên', 'error');
        });
    } else {
      let newData = [...exam.questions];
      newData = newData.filter((item) => !(item.type_id === question.type_id && item.id === question.id));
      dispatch({ type: SET_EXAM, exam: { ...exam, questions: newData } });
    }
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

  const onChangeModeView = (e) => {
    e.stopPropagation();
    let dataMap;
    if (subjectController === -1) {
      thisRef.current.style.border = '1px solid red';
      showNotification('Vui lòng chọn môn!', 'error');
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
    let err = false;
    choiceController?.forEach((item) => {
      err = item.content === '';
    });
    if (err) {
      thisRef.current.style.border = '1px solid red';
      showNotification('Không để trống đáp án', 'error');
      return;
    }

    if (question.type_id == 2) {
      dataMap = exam.questions.map((item) => {
        if (item.id === question.id && item.type_id === question.type_id)
          return {
            ...item,
            subject_id: subjectController,
            chapter_id: chaptersController,
            difficulty: diffController,
            content: content.current,
            choices: choiceController
          };
        return {
          ...item
        };
      });
    } else {
      const tmp = { ...parentQuestion };
      tmp.questions = parentQuestion.questions.map((item) => {
        if (item.id == question.id) {
          return {
            ...item,
            subject_id: subjectController,
            chapter_id: chaptersController,
            difficulty: diffController,
            content: content.current,
            choices: choiceController
          };
        }
        return { ...item };
      });

      dataMap = exam.questions.map((item) => {
        if (item.id === tmp.id)
          return {
            ...tmp
          };
        return {
          ...item
        };
      });
    }

    if (question.id < 0) {
      if (!commonData) {
        runAddQuestion({
          type_id: 2,
          content: content.current,
          difficulty: diffController,
          common_content_id: null,
          chapter_id: chaptersController,
          choices: choiceController
        })
          .then((data) => {
            if (data.success) {
              dataMap = exam.questions.map((item) => {
                if (item.id === question.id && item.type_id === question.type_id)
                  return {
                    ...item,
                    id: data.data.id,
                    subject_id: subjectController,
                    chapter_id: chaptersController,
                    difficulty: diffController,
                    content: content.current,
                    choices: choiceController
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
              dispatch({ type: SET_OBJ_EDITING, editing: null });
              setTimeout(() => showNotification('Lưu thành công!', 'success'), 100);
            } else {
              setTimeout(() => showNotification('Lưu không thành công! Vui lòng liên hệ người quản trị', 'error'), 0);
            }
          })
          .catch((e) => {
            setTimeout(() => showNotification('Lưu không thành công! Vui lòng liên hệ người quản trị', 'error'), 0);
          });
      } else {
        runAddQuestion({
          type_id: 1,
          content: content.current,
          difficulty: commonData.difficulty,
          common_content_id: commonData.id,
          chapter_id: commonData.chapter_id,
          choices: choiceController
        })
          .then((data) => {
            if (data.success) {
              showNotification('Lưu thành công!!!', 'success');
              const tmp = { ...parentQuestion };
              tmp.questions = parentQuestion.questions.map((item) => {
                if (item.id == question.id) {
                  return {
                    ...item,
                    id: data.data.id,
                    subject_id: subjectController,
                    chapter_id: chaptersController,
                    difficulty: diffController,
                    content: content.current,
                    choices: choiceController,
                    canRemove: true
                  };
                }
                return { ...item };
              });

              dataMap = exam.questions.map((item) => {
                if (item.id === tmp.id && item.type_id === tmp.type_id)
                  return {
                    ...tmp
                  };
                return {
                  ...item
                };
              });
              setTimeout(() => {
                dispatch({ type: SET_EXAM, exam: { ...exam, questions: [...dataMap] } });
                dispatch({ type: SET_COMMON_DATA, commonData: null });
                dispatch({ type: SET_OBJ_EDITING, editing: null });
              }, 0);
            } else {
              setTimeout(() => showNotification('Lưu không thành công! Vui lòng liên hệ người quản trị', 'error'), 0);
            }
          })
          .catch((e) => {
            setTimeout(() => showNotification('Lưu không thành công! Vui lòng liên hệ người quản trị', 'error'), 0);
          });
      }
    } else {
      if (!parentQuestion) {
        runUpdateQuestion({
          id: question.id,
          type_id: question.type_id,
          content: content.current,
          difficulty: diffController,
          common_content_id: question.common_content_id,
          chapter_id: chaptersController,
          choices: choiceController
        })
          .then((data) => {
            if (data.success) {
              setTimeout(() => showNotification('Lưu thành công!!!!', 'success'), 100);
              //   dispatch({ type: SET_EXAM, exam: { ...exam, questions: [...] } });
              if (parentQuestion) dispatch({ type: TRIGGER_RELOAD, trigger: trigger + 1 });
              dispatch({ type: SET_OBJ_EDITING, editing: null });
            } else {
              setTimeout(() => showNotification('Lưu không thành công! Vui lòng liên hệ người quản trị', 'error'), 0);
            }
          })
          .catch((e) => {
            setTimeout(() => showNotification('Lưu không thành công! Vui lòng liên hệ người quản trị', 'error'), 0);
          });
      } else {
        runUpdateQuestion({
          id: question.id,
          type_id: question.type_id,
          content: content.current,
          difficulty: diffController,
          common_content_id: question.common_content_id,
          chapter_id: parentQuestion.chapter_id,
          choices: choiceController
        })
          .then((data) => {
            if (data.success) {
              showNotification('Lưu thành công!!!!', 'success');
              setTimeout(() => {
                dispatch({
                  type: SET_EXAM,
                  exam: {
                    ...exam,
                    questions: [...dataMap]
                  }
                });
                if (parentQuestion) dispatch({ type: TRIGGER_RELOAD, trigger: trigger + 1 });
                dispatch({ type: SET_OBJ_EDITING, editing: null });
              }, 100);
            } else {
              setTimeout(() => showNotification('Lưu không thành công! Vui lòng liên hệ người quản trị', 'error'), 0);
            }
          })
          .catch((e) => {
            setTimeout(() => showNotification('Lưu không thành công! Vui lòng liên hệ người quản trị', 'error'), 0);
          });
      }
    }
    thisRef.current.style.border = 'none';
  };
  // const onDeleteQuestion = (event) => {
  //   event.stopPropagation();
  //   onDestroy(question);
  // };

  return (
    <>
      <Grid item xs={12}>
        <Accordion id={`${question.id}-${question.type_id}`} ref={thisRef}>
          <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1-content" id="panel1-header">
            <Grid container>
              {question.type_id === 2 ? (
                <Grid item xs={10} mb={1}>
                  <Grid container>
                    <Grid item xs={12} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
                      <Box width="100%" display="flex" flexDirection="row" alignItems="center">
                        <b> Môn:</b>
                        {isEdit ? (
                          <>
                            <Box mx={0.5}></Box>
                            <Select
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
                                let lstChapter = subjects?.find((item) => item.id === e.target.value).Chapters;
                                setSubjectController(e.target.value);
                                setChapters(lstChapter);
                                setChaptersController(-1);
                              }}
                              disabled={true}
                              value={subjectController}
                            >
                              <MenuItem value={-1}>Chọn Môn</MenuItem>
                              {subjects?.map((subject, index) => (
                                <MenuItem key={index} value={subject.id}>
                                  {subject.name}
                                </MenuItem>
                              ))}
                            </Select>
                            <Box mx={2}></Box>
                          </>
                        ) : (
                          <Box bgcolor="#4673fe" ml={0.5} mr={1.5} px={1} borderRadius={5} textAlign={'center'} color={'#ffff'}>
                            {subjects?.find((item) => item.id === question.subject_id)?.name ?? ''}
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
              ) : (
                <Grid item xs={6} />
              )}
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
                      {
                        <Grid item xs={6}>
                          <Button disabled={parentQuestion} sx={{ width: '100%' }} onClick={onCopy} variant="contained" color="success">
                            Copy
                          </Button>
                        </Grid>
                      }
                    </Grid>
                    {!parentQuestion ? (
                      <Grid item mt={1} xs={12}>
                        <Button
                          sx={{ width: '100%' }}
                          onClick={(e) => {
                            handleClickOpen(e);
                          }}
                          disabled={!question.canRemove}
                          variant="contained"
                          color="error"
                        >
                          Xóa khỏi đề
                        </Button>
                      </Grid>
                    ) : (
                      <Grid item mt={1} xs={12}>
                        <Button
                          disabled={!question.canRemove}
                          sx={{ width: '100%' }}
                          onClick={(e) => {
                            handleClickOpen(e);
                          }}
                          variant="contained"
                          color="error"
                        >
                          Xóa
                        </Button>
                      </Grid>
                    )}
                  </>
                ) : (
                  <></>
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
                        inputProps={{ readOnly: !isEdit }}
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
                        inputProps={{ readOnly: !isEdit }}
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
                    <Grid item xs={1} style={{ paddingTop: 10, display: 'flex', alignItems: 'center' }}>
                      {isEdit && (
                        <Button size="small" onClick={() => onDeleteChoice(choice)} variant="contained" color="error">
                          Xóa
                        </Button>
                      )}
                    </Grid>
                    <Grid item xs={5.5} md={0} />
                  </React.Fragment>
                );
              })}
              <Grid item xs={12}>
                {isEdit && (
                  <Button onClick={addChoice} variant="contained" color="success">
                    Thêm đáp án
                  </Button>
                )}
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <ConfirmationDialog open={open} handleClose={handleClose} handleConfirm={handleConfirm} />
        <NotificationComponent />
      </Grid>
    </>
  );
};

export default QuestionItemInExam;
