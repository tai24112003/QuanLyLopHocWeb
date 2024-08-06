import { useEffect, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import { Button, MenuItem, Select, TextField, Tooltip, Typography } from '@mui/material';
import { gridSpacing } from 'store/constant';
import AddIcon from '@mui/icons-material/Add';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { SET_COMMON_DATA, SET_LIST_QUESTION, SET_OBJ_EDITING } from 'store/actions';

// assets
import MainCard from 'ui-component/cards/MainCard';
import { runGetQuestionDatas } from 'api/question';
import ListQuestion from './components/ListQuestion';
import { runGetSubjectOptions } from 'api/subject';
import { formatData, scrollToCenter } from 'views/utilities/common';
import Loading from 'ui-component/loading/loading';
import BubbleComponent from './components/BubbleComponent';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const QuestionScreen = () => {
  const [arrChapter, setArrChapter] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [toggleAdd, setToggleAdd] = useState(0);
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
    setTimeout(() => scrollToCenter(`${-1}-${2}`), 0);
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
    setTimeout(() => scrollToCenter(`${idTmp}-${1}`), 0);
  };
  return loading ? (
    <Loading></Loading>
  ) : (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <MainCard sx={{ position: { xs: 'none', md: 'sticky' }, top: 90, zIndex: 99, boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.2)' }}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={12} lg={4.5}>
                <TextField
                  onChange={(e) => {
                    setQValue(e.target.value);
                  }}
                  value={qValue}
                  placeholder="Tìm kiếm nội dung câu hỏi"
                  sx={{ width: '100%' }}
                  size="small"
                ></TextField>
              </Grid>
              <Grid item xs={6} md={4} lg={2}>
                <Select
                  onChange={(e) => {
                    setSubjectValue(Number(e.target.value));
                    setListChapterValue(subjects.find((item) => item.id === Number(e.target.value))?.Chapters ?? []);
                  }}
                  value={subjectValue}
                  size="small"
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
                  size="small"
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
                  size="small"
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
            <BubbleComponent>
              <Grid container sx={{ position: 'relative' }}>
                <Grid
                  item
                  xs={12}
                  sx={{
                    transition: 'all .5s ease',
                    position: 'absolute',
                    bottom: toggleAdd,
                    opacity: toggleAdd,
                    width: '100%',
                    left: 0
                  }}
                >
                  <Tooltip disableHoverListener={toggleAdd == 0} title="Thêm câu hỏi đơn" placement="top">
                    <div>
                      <Button
                        disabled={toggleAdd == 0}
                        sx={{ padding: '0 10px', width: '100%' }}
                        variant="contained"
                        onClick={onAddQuestion}
                      >
                        <AddIcon /> Đơn
                      </Button>
                    </div>
                  </Tooltip>
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={(e) => (toggleAdd == 0 ? setToggleAdd(60) : setToggleAdd(0))}
                    sx={{
                      borderRadius: '100%',
                      height: 50,
                      width: 50,
                      minWidth: 0,
                      padding: 0,
                      position: 'relative',
                      zIndex: 999
                    }}
                  >
                    <AddIcon />
                  </Button>
                </Grid>
                <Grid
                  sx={{
                    transition: 'all .5s ease',
                    position: 'absolute',
                    top: toggleAdd,
                    left: 0,
                    opacity: toggleAdd
                  }}
                >
                  <Tooltip disableHoverListener={toggleAdd == 0} title="Thêm câu hỏi chung">
                    <div>
                      <Button disabled={toggleAdd == 0} sx={{ padding: '0 10px' }} variant="contained" onClick={onAddCommonQuestion}>
                        <AddIcon /> chung
                      </Button>
                    </div>
                  </Tooltip>
                </Grid>
              </Grid>
            </BubbleComponent>
          </Grid>
          <ListQuestion arrChapter={arrChapter} subjects={subjects} />
        </Grid>
      </Grid>
    </>
  );
};

export default QuestionScreen;
