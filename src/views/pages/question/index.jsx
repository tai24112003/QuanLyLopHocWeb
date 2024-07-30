import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import { Button, MenuItem, Select, TextField, Typography } from '@mui/material';
import { gridSpacing } from 'store/constant';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { SET_COMMON_DATA, SET_LIST_QUESTION, SET_OBJ_EDITING } from 'store/actions';

// assets
import MainCard from 'ui-component/cards/MainCard';
import { runGetQuestionDatas } from 'api/question';
import ListQuestion from './components/ListQuestion';
import { runGetSubjectOptions } from 'api/subject';
import { formatData } from 'views/utilities/common';
import Loading from 'ui-component/loading/loading';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const QuestionScreen = () => {
  const [arrChapter, setArrChapter] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [qValue, setQValue] = useState('');
  const [subjectValue, setSubjectValue] = useState(-1);
  const [diffValue, setDiffValue] = useState(-1);
  const [chapterValue, setChapterValue] = useState(-1);
  const [listChapterValue, setListChapterValue] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const listQuestion = useSelector((state) => {
    return state.customization.listQuestion;
  });
  const editing = useSelector((state) => {
    return state.customization.editing;
  });
  const user = useSelector((state) => {
    return state.customization.user;
  });

  // useEffect(() => {
  //   console.log(listQuestion);
  // }, [listQuestion]);

  useEffect(() => {
    runGetQuestionDatas({}).then((data) => {
      dispatch({ type: SET_LIST_QUESTION, listQuestion: formatData(data.data) });
      setTimeout(() => setLoading(false), 500);
    });
    return () => {
      dispatch({ type: SET_LIST_QUESTION, listQuestion: [] });
      setLoading(true);
    };
  }, []);

  useEffect(() => {
    runGetSubjectOptions().then(async (data) => {
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
  return loading ? (
    <Loading></Loading>
  ) : (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <MainCard>
            <Grid container spacing={1}>
              <Grid item xs={12} md={12} lg={4.5}>
                <TextField
                  onChange={(e) => {
                    setQValue(e.target.value);
                  }}
                  value={qValue}
                  placeholder="Tìm kiếm nội dung câu hỏi"
                  sx={{ width: '100%' }}
                ></TextField>
              </Grid>
              <Grid item xs={6} md={4} lg={2}>
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
              <Grid item xs={6} md={4} lg={2}>
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
              <Grid item xs={6} md={4} lg={1.5}>
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
              <Grid item xs={6} md={4} lg={2} sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                <Button
                  onClick={(e) => {
                    setLoading(true);
                    const searchParams = {
                      q: qValue
                    };
                    if (diffValue !== -1) searchParams.difficult = diffValue;
                    if (chapterValue !== -1) searchParams.chapter_id = chapterValue;
                    if (subjectValue !== -1) searchParams.subject_id = subjectValue;
                    runGetQuestionDatas(searchParams).then((data) => {
                      dispatch({ type: SET_LIST_QUESTION, listQuestion: formatData(data.data) });
                      setTimeout(() => setLoading(false), 100);
                    });
                  }}
                  variant="contained"
                  color="warning"
                >
                  Tìm kiếm
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  Có <b>{listQuestion.length}</b> kết quả {qValue !== '' ? `cho "${qValue}"` : ''}
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
          <ListQuestion arrChapter={arrChapter} subjects={subjects} />
        </Grid>
      </Grid>
    </>
  );
};

export default QuestionScreen;
