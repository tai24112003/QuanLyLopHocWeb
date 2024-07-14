import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';

import { gapGrid, gridSpacing } from 'store/constant';
import { useForm, FormProvider } from 'react-hook-form';

import { SET_COMMON_DATA, SET_LIST_QUESTION, SET_OBJ_EDITING } from 'store/actions';

// assets
import MainCard from 'ui-component/cards/MainCard';
import { Button, CardActions, CardContent, MenuItem, Select, Snackbar, TextField, Typography } from '@mui/material';
import { runGetQuestionDatas } from 'api/question';
import ListQuestion from './components/ListQuestion';
import { runGetSubjectOptions } from 'api/subject';
import useNotification from './components/Notification';
import { useDispatch, useSelector } from 'react-redux';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const QuestionScreen = () => {
  const [data, setData] = useState([]);
  const [arrChapter, setArrChapter] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [qValue, setQValue] = useState('');
  const [subjectValue, setSubjectValue] = useState(-1);
  const [diffValue, setDiffValue] = useState(-1);
  const [chapterValue, setChapterValue] = useState(-1);
  const [listChapterValue, setListChapterValue] = useState([]);
  const [search, setSearch] = useState({ q: '' });
  const [triggerSearch, setTriggerSearch] = useState(false);
  const methods = useForm();
  const dispatch = useDispatch();
  const listQuestion = useSelector((state) => {
    return state.customization.listQuestion;
  });
  const editing = useSelector((state) => {
    return state.customization.editing;
  });
  const user = useSelector((state) => {
    return state.customization.user;
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = methods;
  const { showNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    const searchParams = {
      q: qValue
    };
    if (diffValue !== -1) searchParams.difficult = diffValue;
    if (chapterValue !== -1) searchParams.chapter_id = chapterValue;
    if (subjectValue !== -1) searchParams.subject_id = subjectValue;
    runGetQuestionDatas(searchParams).then((data) => {
      dispatch({ type: SET_LIST_QUESTION, listQuestion: formatData(data.data) });
    });
    return () => {
      dispatch({ type: SET_LIST_QUESTION, listQuestion: [] });
    };
  }, [triggerSearch]);

  // useEffect(() => {
  //   console.log(listQuestion);
  // }, [listQuestion]);

  useEffect(() => {
    runGetSubjectOptions().then((data) => {
      setSubjects(data.data);
      let arr = [];
      data.data?.forEach((item) => {
        arr[item.id] = item.Chapters;
      });
      setArrChapter(arr);
    });
    return () => {
      dispatch({ type: SET_OBJ_EDITING, editing: null });
      dispatch({ type: SET_COMMON_DATA, commonData: null });
      dispatch({ type: SET_LIST_QUESTION, listQuestion: [] });
    };
  }, []);

  const formatData = (data) => {
    return data?.reduce((result, question) => {
      question.isEditing = false;
      let isCommon = question.type_id === 1;
      if (isCommon) {
        let isExits = result.find((item) => item.id === question.common_content_id && item.type_id === 1);
        if (isExits) {
          isExits.questions.push(question);
        } else {
          let commonQuestion = {
            id: question.common_content_id,
            content: question.common_content,
            type_id: 1,
            chapter_id: question.chapter_id,
            difficulty: question.difficulty,
            subject_id: question.subject_id,
            choices: [],
            questions: [],
            canRemove: question.canRemove,
            authorId: question.authorId,
            shared: question.shared,
            author: question.author
          };
          commonQuestion.questions.push(question);
          result.push(commonQuestion);
        }
      } else {
        result.push(question);
      }

      return result;
    }, []);
  };

  const onAddQuestion = () => {
    if (editing) return;
    const dataMap = [...listQuestion];
    dispatch({
      type: SET_LIST_QUESTION,
      listQuestion: [
        {
          id: -1,
          content: '',
          subject_id: 1,
          difficulty: 1,
          chapter_id: -1,
          new_or_edit: true,
          type_id: 2,
          canRemove: true,
          authorId: user.id,
          shared: null,
          choices: [{ id: -1, content: '', is_correct: true }]
        },
        ...dataMap
      ]
    });
    dispatch({ type: SET_OBJ_EDITING, editing: { id: -1, type_id: 2 } });
  };

  const onAddCommonQuestion = () => {
    if (editing) return;
    const dataMap = [...listQuestion];
    const idTmp = Date.now() * -1;
    dispatch({
      type: SET_LIST_QUESTION,
      listQuestion: [
        {
          id: idTmp,
          content: '',
          new_or_edit: true,
          type_id: 1,
          subject_id: 1,
          difficulty: 1,
          chapter_id: -1,
          canRemove: true,
          authorId: user.id,
          shared: null,
          questions: [
            {
              id: -1,
              content: '',
              type_id: 1,
              authorId: user.id,
              canRemove: true,
              choices: [{ id: -1, content: '', is_correct: true }]
            }
          ],
          choices: []
        },
        ...dataMap
      ]
    });
    dispatch({ type: SET_OBJ_EDITING, editing: { id: idTmp, type_id: 1 } });
  };

  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <MainCard>
            <Grid container spacing={1}>
              <Grid item xs={4.5}>
                <TextField
                  onChange={(e) => {
                    setQValue(e.target.value);
                  }}
                  value={qValue}
                  placeholder="Tìm kiếm nội dung câu hỏi"
                  sx={{ width: '100%' }}
                ></TextField>
              </Grid>
              <Grid item xs={2}>
                <Select
                  onChange={(e) => {
                    setSubjectValue(Number(e.target.value));
                    setListChapterValue(subjects.find((item) => item.id === Number(e.target.value))?.Chapters ?? []);
                  }}
                  value={subjectValue}
                  sx={{ width: '100%' }}
                >
                  <MenuItem value={-1}>Chọn môn</MenuItem>
                  {subjects?.map((chapter, index) => (
                    <MenuItem key={index} value={chapter.id}>
                      {chapter.name}
                    </MenuItem>
                  ))}
                </Select>
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
                  {listChapterValue?.map((chapter, index) => (
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
                <Button
                  onClick={(e) => {
                    setTriggerSearch(!triggerSearch);
                  }}
                  variant="contained"
                  color="warning"
                >
                  Tìm kiếm
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  Có <b>{listQuestion.length}</b> kết quả cho "{search.q}"
                </Typography>
              </Grid>
            </Grid>
          </MainCard>
          <Grid container>
            <Grid item xs={12} sx={{ marginBottom: -3, paddingRight: 0, display: 'flex', justifyContent: 'end', alignItems: 'end' }}>
              <Button variant="contained" onClick={onAddQuestion} sx={{ margin: '10px 0px', marginRight: '10px' }}>
                Thêm câu hỏi
              </Button>
              <Button variant="contained" onClick={onAddCommonQuestion} sx={{ margin: '10px 0px' }}>
                Thêm câu hỏi chung
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <ListQuestion arrChapter={arrChapter} subjects={subjects} listQuestion={data} register={register} errors={errors} />
      </Grid>
      <NotificationComponent />
    </>
  );
};

export default QuestionScreen;
