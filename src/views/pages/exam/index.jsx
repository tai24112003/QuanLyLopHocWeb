import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';

import { gapGrid, gridSpacing } from 'store/constant';
import { useForm, FormProvider } from 'react-hook-form';

// assets
import MainCard from 'ui-component/cards/MainCard';
import { Button, CardActions, CardContent, InputLabel, MenuItem, Select, Snackbar, TextField } from '@mui/material';
import { runGetSubjectOptions } from 'api/subject';
import useNotification from './components/Notification';
import generateId from 'utils/generate-id';
import PopupSearchQuestion from './components/PopupSearchQuestion';
import { useDispatch, useSelector } from 'react-redux';
import { SET_COMMON_DATA, SET_EXAM, SET_LIST_QUESTION, SET_OBJ_EDITING } from 'store/actions';
import ListQuestionInExam from './components/ListQuestionInExam';
import { flattenArray } from 'views/utilities/common';
import { runCreateExam } from 'api/exam';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const ExamScreen = () => {
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const timeRef = useRef();
  const nameRef = useRef();
  const dispatch = useDispatch();
  const [reloadActive, setReloadActive] = useState(false);
  const [chapterValue, setChapterValue] = useState(-1);
  const [diffValue, setDiffValue] = useState(-1);
  const [listChapterFilter, setListChapterFilter] = useState([]);
  const infoExam = useSelector((state) => {
    return state.customization.exam;
  });
  const editing = useSelector((state) => {
    return state.customization.editing;
  });
  const user = useSelector((state) => {
    return state.customization.user;
  });
  const [subjectController, setSubjectController] = useState(infoExam.subject_id);

  const methods = useForm();

  const { showNotification, NotificationComponent } = useNotification();
  const [openSearchQuestion, setOpenSearchQuestion] = useState(false);

  const handleClickOpenSearch = () => {
    setOpenSearchQuestion(true);
  };

  const handleCloseSearch = () => {
    setOpenSearchQuestion(false);
  };

  useEffect(() => {
    runGetSubjectOptions().then((data) => {
      setSubjects(data.data);
    });
    return () => {
      dispatch({
        type: SET_EXAM,
        exam: {
          code: '',
          subject_id: '',
          time: 60,
          name: '',
          count: 50,
          questions: []
        }
      });
      dispatch({ type: SET_OBJ_EDITING, editing: null });
      dispatch({ type: SET_COMMON_DATA, commonData: null });
      dispatch({ type: SET_LIST_QUESTION, listQuestion: [] });
    };
  }, []);

  useEffect(() => {
    let newData = { ...infoExam };
    newData.code = generateId().toUpperCase().substring(3);
    if (newData.subject_id === '' || newData.subject_id == undefined) newData.subject_id = subjects[0]?.id;
    setListChapterFilter(subjects.find((item) => item.id === infoExam.subject_id)?.Chapters);
    setSubjectController(newData.subject_id ?? subjects[0]?.id);
    dispatch({ type: SET_EXAM, exam: { ...newData } });
  }, [subjects]);

  const onAddQuestion = () => {
    if (editing) return;
    if (infoExam.count === infoExam.questions.length) {
      showNotification('Đề đã đủ câu không thể thêm', 'error');
      return;
    }
    const dataMap = [...infoExam.questions];
    dispatch({
      type: SET_EXAM,
      exam: {
        ...infoExam,
        questions: [
          {
            id: -1,
            content: '',
            subject_id: subjectController,
            difficulty: 1,
            chapter_id: -1,
            new_or_edit: true,
            type_id: 2,
            canRemove: true,
            choices: [{ id: -1, content: '', is_correct: true }]
          },
          ...dataMap
        ]
      }
    });
    dispatch({ type: SET_OBJ_EDITING, editing: { id: -1, type_id: 2 } });
  };

  const onAddCommonQuestion = () => {
    if (editing) return;
    if (infoExam.count === infoExam.questions.length) {
      showNotification('Đề đã đủ câu không thể thêm', 'error');
      return;
    }
    const dataMap = [...infoExam.questions];
    dispatch({
      type: SET_EXAM,
      exam: {
        ...infoExam,
        questions: [
          {
            id: -2,
            content: '',
            new_or_edit: true,
            type_id: 1,
            subject_id: subjectController,
            difficulty: 1,
            chapter_id: -1,
            isEditing: true,
            canRemove: true,
            questions: [
              {
                id: -1,
                content: '',
                type_id: 1,
                choices: [{ id: -1, content: '', is_correct: true }]
              }
            ],
            choices: []
          },
          ...dataMap
        ]
      }
    });
    dispatch({ type: SET_OBJ_EDITING, editing: { id: -2, type_id: 1 } });
  };

  // const formatData = (data) => {
  //   return data?.reduce((result, question) => {
  //     let isCommon = question.type_id === 1;
  //     if (isCommon) {
  //       let isExits = result.find((item) => item.id === question.common_content_id && item.type_id === 1);
  //       if (isExits) {
  //         isExits.questions.push(question);
  //       } else {
  //         let commonQuestion = {
  //           id: question.common_content_id,
  //           content: question.common_content,
  //           type_id: 1,
  //           chapter_id: question.chapter_id,
  //           difficulty: question.difficulty,
  //           subject_id: question.subject_id,
  //           choices: [],
  //           questions: [],
  //           canRemove: question.canRemove
  //         };
  //         commonQuestion.questions.push(question);
  //         result.push(commonQuestion);
  //       }
  //     } else {
  //       result.push(question);
  //     }

  //     return result;
  //   }, []);
  // };

  const onSubmit = () => {
    let err = false;

    if (!infoExam.time) {
      err = true;
      timeRef.current.querySelector('input').style.border = '1px solid red';
    }

    if (!infoExam.name) {
      err = true;
      nameRef.current.querySelector('input').style.border = '1px solid red';
    }

    if (err) {
      showNotification('Không để trống thông tin!', 'error');
      return;
    }
    if (infoExam.questions.length < infoExam.count) {
      showNotification('Đề chưa đủ câu', 'error');
      return;
    }
    runCreateExam({
      ...infoExam,
      authorId: user.id,
      duration: infoExam.time,
      questionCount: infoExam.count,
      questions: flattenArray(infoExam.questions).map((e) => {
        return e.id;
      })
    })
      .then((data) => {
        if (data.success) {
          showNotification('Tạo đề thành công', 'success');
          setTimeout(() => navigate(`/exam/view/${data.data.id}`), 2000);
        } else {
          showNotification('Tạo đề không thành công', 'error');
        }
      })
      .catch((e) => {
        showNotification('Tạo đề không thành công', 'error');
      });
  };

  return (
    <FormProvider {...methods}>
      <form>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12}>
            <MainCard title="Thông tin đề">
              <Grid container spacing={gridSpacing}>
                <Grid item xs={3}>
                  <InputLabel>Mã đề</InputLabel>
                  <TextField inputProps={{ readOnly: true }} value={infoExam.code} placeholder="KTYAS" sx={{ width: '100%' }}></TextField>
                </Grid>
                <Grid item xs={3}>
                  <InputLabel>Chủ đề</InputLabel>
                  <Select
                    onChange={(e) => {
                      setSubjectController(e.target.value);
                      setListChapterFilter(subjects.find((item) => item.id === e.target.value)?.Chapters ?? []);
                      dispatch({ type: SET_EXAM, exam: { ...infoExam, questions: [], subject_id: e.target.value } });
                    }}
                    value={subjectController}
                    sx={{ width: '100%' }}
                  >
                    {subjects.map((subject, index) => (
                      <MenuItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={2}>
                  <InputLabel>
                    Thời gian (phút) <span style={{ color: 'red' }}>*</span>
                  </InputLabel>
                  <TextField
                    type="number"
                    ref={timeRef}
                    onChange={(e) => {
                      timeRef.current.querySelector('input').style.border = '0.2px solid #bfc0c2';
                      dispatch({ type: SET_EXAM, exam: { ...infoExam, time: e.target.value } });
                    }}
                    value={infoExam.time}
                    sx={{ width: '100%' }}
                  ></TextField>
                </Grid>
                <Grid item xs={4} />
                <Grid item xs={3}>
                  <InputLabel>
                    Tên đề <span style={{ color: 'red' }}>*</span>
                  </InputLabel>
                  <TextField
                    ref={nameRef}
                    onChange={(e) => {
                      nameRef.current.querySelector('input').style.border = '0.2px solid #bfc0c2';
                      dispatch({ type: SET_EXAM, exam: { ...infoExam, name: e.target.value } });
                    }}
                    value={infoExam.name}
                    placeholder="Nhập tên đề thi"
                    sx={{ width: '100%' }}
                  ></TextField>
                </Grid>
                <Grid item xs={1}>
                  <InputLabel>Số câu</InputLabel>
                  <TextField
                    inputProps={{ min: infoExam?.questions?.length }}
                    type="number"
                    onChange={(e) => {
                      let tmpC = Math.abs(e.target.value);
                      if (tmpC < infoExam.questions.length) tmpC = infoExam.questions.length;
                      if (tmpC < 1) tmpC = 1;
                      if (tmpC > 100) tmpC = 100;
                      dispatch({ type: SET_EXAM, exam: { ...infoExam, count: tmpC } });
                    }}
                    value={infoExam.count}
                    sx={{ width: '100%' }}
                  ></TextField>
                </Grid>
                <Grid item xs={8} />
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12}>
            {/* <MainCard>
              <Grid container spacing={1}>
                <Grid item xs={5.5}>
                  <TextField
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm kiếm câu hỏi trong đề"
                    sx={{ width: '100%' }}
                  ></TextField>
                </Grid>
                <Grid item xs={2}>
                  <Select
                    onChange={(e) => {
                      setChapterValue(Number(e.target.value));
                    }}
                    value={chapterValue}
                    sx={{ width: '100%' }}
                  >
                    <MenuItem value={-1}>Chọn chương</MenuItem>
                    {listChapterFilter?.map((chapter, index) => (
                      <MenuItem key={index} value={chapter.id}>
                        {chapter.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={1.5}>
                  <Select
                    onChange={(e) => {
                      setDiffValue(Number(e.target.value));
                    }}
                    value={diffValue}
                    sx={{ width: '100%' }}
                  >
                    <MenuItem value={-1}>Chọn độ khó</MenuItem>
                    <MenuItem value={1}>Dễ</MenuItem>
                    <MenuItem value={2}>Trung bình</MenuItem>
                    <MenuItem value={3}>Khó</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                  <Button size="small" variant="contained" color="warning">
                    Tìm kiếm
                  </Button>
                </Grid>
              </Grid>
            </MainCard> */}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'start', alignItems: 'end' }}>
              <Button variant="contained" onClick={handleClickOpenSearch} sx={{ margin: '10px 0px' }}>
                Ngân hàng câu hỏi
              </Button>
            </Grid>
          </Grid>
          <ListQuestionInExam inExam infoExam={infoExam} subjects={subjects} listQuestion={infoExam.questions} />
          <Grid
            item
            xs={12}
            sx={{
              backgroundColor: '#eef2f6',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              bottom: 0,
              paddingTop: '10px !important',
              paddingLeft: '3 !important',
              paddingBottom: '10px !important',
              paddingRight: '0 !important'
            }}
          >
            <div style={{ backgroundColor: '#ffe57f', padding: 10 }}>
              <b>Số câu: {infoExam.questions?.length + '/' + infoExam.count}</b>
            </div>
            <div>
              <Button sx={{ marginRight: 1 }} onClick={onAddQuestion} variant="contained">
                Thêm câu hỏi mới
              </Button>
              <Button onClick={onAddCommonQuestion} variant="contained">
                Thêm câu hỏi chung mới
              </Button>
            </div>
            <Button disabled={editing} onClick={onSubmit} color="success" variant="contained">
              Tạo đề
            </Button>
          </Grid>
        </Grid>
        <NotificationComponent />
        <PopupSearchQuestion
          chapters={subjects.find((item) => item.id === infoExam.subject_id)?.Chapters}
          infoExam={infoExam}
          search={search}
          open={openSearchQuestion}
          handleClose={handleCloseSearch}
        />
      </form>
    </FormProvider>
  );
};

export default ExamScreen;
