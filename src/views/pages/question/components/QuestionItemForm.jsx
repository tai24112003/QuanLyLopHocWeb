import React, { useEffect, useRef, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import SaveIcon from '@mui/icons-material/Save';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
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
import { useDispatch, useSelector } from 'react-redux';
import { SET_COMMON_DATA, SET_LIST_QUESTION, SET_OBJ_EDITING, TRIGGER_RELOAD } from 'store/actions';
import { runAddQuestion, runDeleteQuestionDatas, runSetPrivate, runSetPublic, runUpdateQuestion } from 'api/question';
import ConfirmationDialog from 'ui-component/popup/confirmDelete';
import { scrollToCenter } from 'views/utilities/common';
import Cookies from 'js-cookie';

const QuestionItemForm = React.memo(({ question, parentQuestion, lstSubject, showNotification }) => {
  const [reload, setReload] = useState(false);
  const [open, setOpen] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chaptersController, setChaptersController] = useState(-1);
  const [subjectController, setSubjectController] = useState(-1);
  const [diffController, setDiffController] = useState(1);
  const [choiceController, setChoiceController] = useState(question?.choices ?? []);
  const thisRef = useRef();
  const dispatch = useDispatch();
  const content = useRef(question?.content);
  const listQuestion = useSelector((state) => {
    return state.customization.listQuestion;
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
  const user = useSelector((state) => {
    return state.customization.user;
  });
  let isEdit = question.id == editing?.id && question.type_id == editing?.type_id;

  useEffect(() => {
    setSubjects(lstSubject);
    if (!chapters) {
      let arr = [];
      arr = lstSubject?.find((item) => item.id === question.subject_id)?.Chapters;
      setChapters(arr);
    }
    content.current = question?.content;
    if (parentQuestion) {
      setChoiceController(parentQuestion.questions.find((item) => item.id === question.id)?.choices);
      setChaptersController(parentQuestion.questions.find((item) => item.id === question.id)?.chapter_id);
      content.current = parentQuestion.questions.find((item) => item.id === question.id)?.content;
    }
  }, [lstSubject]);

  useEffect(() => {
    let arr = [];
    arr = lstSubject?.find((item) => item.id === question.subject_id)?.Chapters;
    setChapters(arr);
    setSubjectController(question.subject_id);
    setChaptersController(question.chapter_id);
    if (isEdit) thisRef.current.style.border = '1px solid blue';
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
    const dataMap = [...listQuestion];
    runAddQuestion({ ...question, authorId: user.id }).then((data) => {
      if (data.success) {
        let newQuestion = {};
        newQuestion = data.data;
        dispatch({
          type: SET_LIST_QUESTION,
          listQuestion: [
            {
              ...newQuestion,
              subject_id: subjectController,
              chapters: question.chapters,
              canRemove: true,
              shared: null
            },
            ...dataMap
          ]
        });
        showNotification('Sao chép thành công', 'success'), setTimeout(() => scrollToCenter(`${newQuestion.id}-${newQuestion.type_id}`), 0);
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
            setReload(!reload);
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
    thisRef.current.style.border = '1px solid blue';
    dispatch({ type: SET_OBJ_EDITING, editing: { id: question.id, type_id: question.type_id } });
  };

  const onRemove = () => {
    let newData = [...listQuestion];
    runDeleteQuestionDatas(question.id)
      .then((data) => {
        if (data.success) {
          showNotification('Đã xóa thành công', 'success');
          if (parentQuestion) {
            thisRef.current.style.display = 'none';
          } else {
            newData = newData.filter((item) => !(item.type_id === question.type_id && item.id === question.id));
            dispatch({ type: SET_LIST_QUESTION, listQuestion: newData });
          }
        } else {
          showNotification('Xóa không thành công', 'error');
        }
      })
      .catch((e) => {
        showNotification('Có lỗi xảy ra, liên hệ quản trị viên', 'error');
      });
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
      dataMap = listQuestion.map((item) => {
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

      dataMap = listQuestion.map((item) => {
        if (item.id === tmp.id && item.type_id === tmp.type_id)
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
          choices: choiceController,
          authorId: user.id
        })
          .then((data) => {
            if (data.success) {
              dataMap = listQuestion.map((item) => {
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
              showNotification('Lưu thành công!', 'success');
              dispatch({ type: SET_LIST_QUESTION, listQuestion: dataMap });
              dispatch({ type: SET_OBJ_EDITING, editing: null });
            } else {
              showNotification('Lưu không thành công! Vui lòng liên hệ người quản trị', 'error');
            }
          })
          .catch((e) => {
            showNotification('Lưu không thành công! Vui lòng liên hệ người quản trị', 'error');
          });
      } else {
        runAddQuestion({
          type_id: 1,
          content: content.current,
          difficulty: commonData.difficulty,
          common_content_id: commonData.id,
          chapter_id: commonData.chapter_id,
          choices: choiceController,
          authorId: user.id
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

              dataMap = listQuestion.map((item) => {
                if (item.id === tmp.id && item.type_id === tmp.type_id)
                  return {
                    ...tmp
                  };
                return {
                  ...item
                };
              });
              dispatch({ type: SET_LIST_QUESTION, listQuestion: [...dataMap] });
              dispatch({ type: SET_COMMON_DATA, commonData: null });
              dispatch({ type: SET_OBJ_EDITING, editing: null });
            } else {
              showNotification('Lưu không thành công! Vui lòng liên hệ người quản trị', 'error');
            }
          })
          .catch((e) => {
            showNotification('Lưu không thành công! Vui lòng liên hệ người quản trị', 'error');
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
              showNotification('Lưu thành công!', 'success');
              dispatch({ type: SET_LIST_QUESTION, listQuestion: [...dataMap] });
              if (parentQuestion) dispatch({ type: TRIGGER_RELOAD, trigger: trigger + 1 });
              dispatch({ type: SET_OBJ_EDITING, editing: null });
            } else {
              showNotification('Lưu không thành công! Vui lòng liên hệ người quản trị', 'error');
            }
          })
          .catch((e) => {
            showNotification('Lưu không thành công! Vui lòng liên hệ người quản trị', 'error');
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
              dispatch({ type: SET_LIST_QUESTION, listQuestion: [...dataMap] });
              if (parentQuestion) dispatch({ type: TRIGGER_RELOAD, trigger: trigger + 1 });
              dispatch({ type: SET_OBJ_EDITING, editing: null });
              showNotification('Lưu thành công!!!!', 'success');
            } else {
              showNotification('Lưu không thành công! Vui lòng liên hệ người quản trị', 'error');
            }
          })
          .catch((e) => {
            showNotification('Lưu không thành công! Vui lòng liên hệ người quản trị', 'error');
          });
      }
    }
    thisRef.current.style.border = 'none';
  };

  return (
    <>
      <Grid item xs={12}>
        <Accordion id={`${question.id}-${question.type_id}`} ref={thisRef}>
          <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1-content" id="panel1-header">
            <Grid container spacing={1}>
              {question.type_id === 2 ? (
                <Grid item xs={7} md={8} lg={9} mb={1}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={5.5} lg={3} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
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
                          <Tooltip title={subjects?.find((item) => item.id === question.subject_id)?.name ?? ''}>
                            <Box
                              style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                              bgcolor="#4673fe"
                              ml={0.5}
                              mr={1.5}
                              px={1}
                              borderRadius={5}
                              textAlign={'center'}
                              color={'#ffff'}
                            >
                              {subjects?.find((item) => item.id === question.subject_id)?.name ?? ''}
                            </Box>
                          </Tooltip>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={5.5} lg={3} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
                      <Box width="100%" display="flex" flexDirection="row" alignItems="center">
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
                          <Tooltip title={chapters?.find((item) => item.id === question.chapter_id)?.name ?? ''}>
                            <Box
                              style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                              ml={0.5}
                              mr={1.5}
                              bgcolor="#00e676"
                              px={1}
                              borderRadius={5}
                              textAlign={'center'}
                              color={'#ffff'}
                            >
                              {chapters?.find((item) => item.id === question.chapter_id)?.name ?? ''}
                            </Box>
                          </Tooltip>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={5.5} lg={2.5} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
                      <Box width="100%" display="flex" flexDirection="row" alignItems="center">
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
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={5.5} lg={3} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
                      <Box width="100%" display="flex" flexDirection="row" alignItems="center">
                        <b>Trạng thái:</b>
                        {!question.canRemove ? (
                          <Tooltip title="Đã được dùng">
                            <Box
                              style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                              ml={0.5}
                              mr={1.5}
                              bgcolor="#f44336"
                              px={1}
                              borderRadius={5}
                              textAlign={'center'}
                              color={'#fff'}
                            >
                              Đã được dùng
                            </Box>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Chưa dùng">
                            <Box
                              style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                              ml={0.5}
                              mr={1.5}
                              bgcolor="#e0e0e0"
                              px={1}
                              borderRadius={5}
                              textAlign={'center'}
                              color={'#000000'}
                            >
                              Chưa dùng
                            </Box>
                          </Tooltip>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={5.5} lg={3} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
                      <Box width="100%" display="flex" flexDirection="row" alignItems="center">
                        {question.authorId !== user.id && (
                          <>
                            <b>Tác giả:</b>
                            <Box ml={0.5} mr={1.5} bgcolor="#00e676" px={1} borderRadius={5} textAlign={'center'} color={'#ffff'}>
                              {question.author?.name ?? ''}
                            </Box>
                          </>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <Grid item xs={7} md={8} lg={9} mb={1} />
              )}
              <Grid item xs={5} md={4} lg={3} container>
                {isEdit ? (
                  <Grid item sx={{ display: 'flex', alignItems: 'start', justifyContent: 'flex-end' }} xs={12}>
                    <Tooltip title="Lưu">
                      <Button onClick={onChangeModeView} variant="contained" color="success">
                        <SaveIcon />
                      </Button>
                    </Tooltip>
                  </Grid>
                ) : editing === null ? (
                  <>
                    {question.authorId == user.id && question.type_id === 2 ? (
                      <Grid item xs={3} md={3} lg={3} sx={{ display: 'flex', alignItems: 'start', justifyContent: 'flex-end' }}>
                        <Tooltip title="Chia sẻ câu hỏi">
                          <span>
                            {question.shared !== null ? (
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  runSetPrivate(question.id)
                                    .then((data) => {
                                      if (data.success) {
                                        showNotification('Đã đặt câu hỏi sang riêng tư', 'success');
                                        let newData = [...listQuestion];
                                        newData = newData.map((item) => {
                                          if (item.id === question.id && item.type_id === question.type_id) {
                                            return { ...item, shared: null };
                                          }
                                          return { ...item };
                                        });
                                        dispatch({ type: SET_LIST_QUESTION, listQuestion: newData });
                                      } else {
                                        showNotification('Cập nhật không thành công', 'error');
                                      }
                                    })
                                    .catch((e) => {
                                      showNotification('Cập nhật không thành công', 'error');
                                    });
                                }}
                                size="small"
                              >
                                <ShareRoundedIcon />
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  runSetPublic(question.id)
                                    .then((data) => {
                                      if (data.success) {
                                        showNotification('Đã công khai câu hỏi', 'success');
                                        let newData = [...listQuestion];
                                        newData = newData.map((item) => {
                                          if (item.id === question.id && item.type_id === question.type_id) {
                                            return { ...item, shared: 1 };
                                          }
                                          return { ...item };
                                        });
                                        dispatch({ type: SET_LIST_QUESTION, listQuestion: newData });
                                      } else {
                                        showNotification('Công khai không thành công', 'error');
                                      }
                                    })
                                    .catch((e) => {
                                      showNotification('Công khai không thành công', 'error');
                                    });
                                }}
                                size="small"
                              >
                                <ShareRoundedIcon />
                              </Button>
                            )}
                          </span>
                        </Tooltip>
                      </Grid>
                    ) : (
                      <Grid item xs={3} md={3} lg={3} sx={{ display: 'flex', alignItems: 'start', justifyContent: 'flex-end' }}>
                        <Button size="small" disabled>
                          <ShareRoundedIcon />
                        </Button>
                      </Grid>
                    )}
                    <Grid item xs={3} md={3} lg={3} sx={{ display: 'flex', alignItems: 'start', justifyContent: 'flex-end' }}>
                      <Tooltip title="Chỉnh sửa">
                        <span>
                          <Button
                            disabled={!question.canRemove || question.authorId !== user.id}
                            onClick={onChangeModeEdit}
                            color="primary"
                          >
                            <BorderColorRoundedIcon />
                          </Button>
                        </span>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={3} md={3} lg={3} sx={{ display: 'flex', alignItems: 'start', justifyContent: 'flex-end' }}>
                      <Tooltip title="Sao chép câu hỏi">
                        <span>
                          <Button disabled={!!parentQuestion} onClick={onCopy} color="primary">
                            <ContentCopyRoundedIcon />
                          </Button>
                        </span>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={3} md={3} lg={3} sx={{ display: 'flex', alignItems: 'start', justifyContent: 'flex-end' }}>
                      <Tooltip title="Xóa">
                        <div>
                          <Button
                            disabled={!question.canRemove || question.authorId !== user.id}
                            onClick={(e) => {
                              handleClickOpen(e);
                            }}
                            color="error"
                          >
                            <DeleteForeverRoundedIcon />
                          </Button>
                        </div>
                      </Tooltip>
                    </Grid>
                  </>
                ) : (
                  <></>
                )}
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
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
                    thisRef.current.style.border = '1px solid blue';
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
                          thisRef.current.style.border = '1px solid blue';
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
                          thisRef.current.style.border = '1px solid blue';
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
      </Grid>
    </>
  );
});

export default QuestionItemForm;
