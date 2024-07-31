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
import QuestionItemForm from './QuestionItemForm';
import { useDispatch, useSelector } from 'react-redux';
import { SET_COMMON_DATA, SET_LIST_QUESTION, SET_OBJ_EDITING } from 'store/actions';
import {
  runAddCommonQuestion,
  runCopyCommonQuestion,
  runDeleteCommonQuestion,
  runSetPrivateCommon,
  runSetPublicCommon,
  runUpdateCommonQuestion
} from 'api/question';
import ConfirmationDialog from 'ui-component/popup/confirmDelete';
import { scrollToCenter } from 'views/utilities/common';
import Cookies from 'js-cookie';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const CommonQuestionItemForm = ({ question, lstSubject, showNotification }) => {
  const [chapters, setChapters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [open, setOpen] = useState(false);
  const thisRef = useRef();
  const [chaptersController, setChaptersController] = useState(-1);
  const [subjectController, setSubjectController] = useState(-1);
  const [diffController, setDiffController] = useState(1);
  const dispatch = useDispatch();
  const content = useRef(question?.content);
  const listQuestion = useSelector((state) => {
    return state.customization.listQuestion;
  });
  const editing = useSelector((state) => {
    return state.customization.editing;
  });
  const user = useSelector((state) => {
    return state.customization.user;
  });

  let isEdit = question.id == editing?.id && question.type_id == editing?.type_id;

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
    let newData = [...listQuestion];
    runDeleteCommonQuestion(question.id).then((data) => {
      if (data.success) {
        if (data.success) {
          showNotification('Đã xóa thành công', 'success');
          newData = newData.filter((item) => !(item.type_id === question.type_id && item.id === question.id));
          dispatch({ type: SET_LIST_QUESTION, listQuestion: newData });
        } else {
          showNotification('Xóa không thành công', 'error');
        }
      }
    });
  };

  useEffect(() => {
    setSubjects(lstSubject);
    setSubjectController(question.subject_id);
    let arr = [];
    arr = lstSubject?.find((item) => item.id === question.subject_id)?.Chapters;
    setChapters(arr);
    setChaptersController(question.chapter_id);
  }, [lstSubject]);

  const onAddQuestion = () => {
    let newData = [...listQuestion];
    const id = Date.now() * -1;
    newData = newData.map((item) => {
      if (item.id == question.id && item.type_id === question.type_id) {
        return {
          ...item,
          questions: [
            ...item?.questions,
            {
              id: id,
              content: '',
              chapter_id: question.chapter_id,
              difficulty: question.difficulty,
              isEditing: true,
              hideEdit: false,
              authorId: user.id,
              canRemove: true,
              type_id: 1,
              choices: [{ id: -1, content: '', is_correct: true }]
            }
          ]
        };
      }
      return { ...item };
    });
    dispatch({ type: SET_LIST_QUESTION, listQuestion: newData });
    dispatch({ type: SET_OBJ_EDITING, editing: { id: id, type_id: 1 } });
    dispatch({ type: SET_COMMON_DATA, commonData: { id: question.id, chapter_id: question.chapter_id, difficulty: question.difficulty } });
  };

  const onChangeModeEdit = (e) => {
    e.stopPropagation();
    thisRef.current.style.border = '1px solid blue';
    dispatch({ type: SET_OBJ_EDITING, editing: { id: question.id, type_id: question.type_id } });
  };

  const onCopy = (e) => {
    e.stopPropagation();
    const dataMap = [...listQuestion];
    runCopyCommonQuestion(question.id).then((data) => {
      if (data.success) {
        const newData = data.data;
        dispatch({
          type: SET_LIST_QUESTION,
          listQuestion: [
            {
              ...newData,
              subject_id: subjectController,
              canRemove: true,
              authorId: user.id,
              shared: null,
              questions: newData.questions.map((item) => ({ ...item, canRemove: true, authorId: user.id, shared: null }))
            },
            ...dataMap
          ]
        });
        showNotification('Sao chép thành công', 'success');
        setTimeout(() => {
          scrollToCenter(`${newData.id}-${newData.type_id}`);
        }, 0);
      }
    });
  };

  const onChangeModeView = (e) => {
    e.stopPropagation();
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

    let dataMap = listQuestion.map((item) => {
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
    if (question.id < 0) {
      runAddCommonQuestion({
        content: content.current
      })
        .then((data) => {
          if (data.success) {
            dataMap = listQuestion.map((item) => {
              if (item.id === question.id)
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
            dispatch({ type: SET_LIST_QUESTION, listQuestion: dataMap });
            dispatch({ type: SET_OBJ_EDITING, editing: { id: -1, type_id: 1 } });
            dispatch({
              type: SET_COMMON_DATA,
              commonData: { id: data.data[0].id, chapter_id: chaptersController, difficulty: diffController }
            });

            showNotification('Lưu thành công!', 'success');
          } else {
            showNotification('Lưu không thành công! Vui lòng liên hệ người quản trị', 'error');
          }
        })
        .catch((e) => {
          showNotification('Lưu không thành công! Vui lòng liên hệ người quản trị', 'error');
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
    }
    thisRef.current.style.border = 'none';
  };

  return (
    <Grid item xs={12}>
      <Grid container sx={{ width: '100%' }}>
        <Accordion
          sx={{
            border: isEdit ? '1px solid blue' : 'none',
            width: '100%'
          }}
          id={`${question.id}-${question.type_id}`}
          ref={thisRef}
        >
          <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1-content" id="panel1-header">
            <Grid container spacing={1}>
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
                              let lstChapter = subjects.find((item) => item.id === e.target.value).Chapters;
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
                        <Tooltip title={subjects.find((item) => item.id === question.subject_id)?.name ?? ''}>
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
                            {subjects.find((item) => item.id === question.subject_id)?.name ?? ''}
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
                  <Grid
                    item
                    xs={12}
                    md={5.5}
                    lg={3}
                    display={{ xs: 'none', md: 'flex' }}
                    flexDirection="row"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
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
                            px={0.5}
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
                            px={0.5}
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
                  <Grid item xs={12} md={12} lg={5} display={{ xs: 'none', md: 'flex' }}>
                    {question.authorId !== user.id && (
                      <Box width="100%" display="flex" flexDirection="row" alignItems="center">
                        <b>Tác giả:</b>
                        <Box
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                          ml={0.5}
                          bgcolor="#00e676"
                          px={1}
                          borderRadius={5}
                          textAlign="center"
                          color="#fff"
                        >
                          {question.author?.name ?? ''}
                        </Box>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={5} md={4} lg={3} sx={{ display: 'flex', alignItems: 'start' }}>
                <Grid container>
                  {isEdit ? (
                    <Grid item sx={{ display: 'flex', alignItems: 'end', justifyContent: 'flex-end' }} xs={12}>
                      <Tooltip title="Lưu">
                        <Button onClick={onChangeModeView} variant="contained" color="success">
                          <SaveIcon />
                        </Button>
                      </Tooltip>
                    </Grid>
                  ) : editing === null ? (
                    <>
                      <Grid item xs={3} md={3} lg={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {question.authorId == user.id ? (
                          question.shared !== null ? (
                            <Tooltip title="Thu hồi câu hỏi">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  runSetPrivateCommon(question.id)
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
                            </Tooltip>
                          ) : (
                            <Tooltip title="Chia sẻ câu hỏi">
                              <Button
                                variant="contained"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  runSetPublicCommon(question.id)
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
                            </Tooltip>
                          )
                        ) : (
                          <Button disabled size="small">
                            <ShareRoundedIcon />
                          </Button>
                        )}
                      </Grid>
                      <Grid item xs={3} md={3} lg={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="Chỉnh sửa">
                          <div>
                            <Button
                              disabled={!question.canRemove || question.authorId !== user.id}
                              onClick={onChangeModeEdit}
                              sx={{ maxWidth: '100%' }}
                              color="primary"
                            >
                              <BorderColorRoundedIcon />
                            </Button>
                          </div>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={3} md={3} lg={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="Sao chép câu hỏi">
                          <Button onClick={onCopy} color="primary">
                            <ContentCopyRoundedIcon />
                          </Button>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={3} md={3} lg={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="Xóa">
                          <div>
                            <Button disabled={!question.canRemove || question.authorId !== user.id} onClick={handleClickOpen} color="error">
                              <DeleteForeverRoundedIcon />
                            </Button>
                          </div>
                        </Tooltip>
                      </Grid>
                    </>
                  ) : (
                    <Grid item sx={{ display: 'flex', alignItems: 'end', justifyContent: 'flex-end' }} xs={12}>
                      <Tooltip title="Lưu">
                        <div></div>
                      </Tooltip>
                    </Grid>
                  )}
                </Grid>
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
            <Grid container>
              <Grid item xs={12}>
                <Typography>
                  <b>Các câu hỏi:</b>
                </Typography>
              </Grid>
              {question?.questions?.map((questionItem, index) => (
                <Grid item xs={12} key={questionItem.id + '&' + questionItem.type_id}>
                  <QuestionItemForm showNotification={showNotification} parentQuestion={question} question={questionItem} />
                </Grid>
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
    </Grid>
  );
};

export default CommonQuestionItemForm;
