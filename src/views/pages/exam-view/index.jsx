import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';

import { gapGrid, gridSpacing } from 'store/constant';

// assets
import MainCard from 'ui-component/cards/MainCard';
import { Button, CardActions, CardContent, InputLabel, MenuItem, Select, Snackbar, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ListQuestionInExam from './components/ListQuestionInExam';
import { runCreateExam, runGetExam } from 'api/exam';
import { CopyAll, GetApp } from '@mui/icons-material';
import { runGetSubjectOptions } from 'api/subject';
import { SET_EXAM } from 'store/actions';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const ExamViewScreen = () => {
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState('');
  const timeRef = useRef();
  const nameRef = useRef();
  const [chapterValue, setChapterValue] = useState(-1);
  const [diffValue, setDiffValue] = useState(-1);
  const [listChapterFilter, setListChapterFilter] = useState([]);
  const dispatch = useDispatch();
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

  const { id } = useParams();

  useEffect(() => {
    runGetSubjectOptions().then((data) => {
      setSubjects(data.data);
    });
    runGetExam(id)
      .then((data) => {
        if (data.success) {
          setData({
            ...data.data,
            questions: formatData(data.data.questions)
          });
        }
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    setListChapterFilter(subjects.find((item) => item.id === infoExam.subject_id)?.Chapters);
    setSubjectController(subjects[0]?.id ?? '');
  }, [subjects]);

  const formatData = (data) => {
    return data?.reduce((result, question) => {
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
            canRemove: question.canRemove
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

  const onSubmit = () => {};
  const onCopyExam = () => {
    dispatch({
      type: SET_EXAM,
      exam: {
        id: '',
        subject_id: data.subject_id,
        time: data.duration,
        name: data.name,
        count: data.questionCount,
        questions: data.questions?.map((item) => ({ ...item, canRemove: true }))
      }
    });
    navigate('/exam/create');
  };

  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <MainCard title="Thông tin đề">
            <Grid container spacing={gridSpacing}>
              <Grid item xs={3}>
                <InputLabel>Mã đề</InputLabel>
                <TextField inputProps={{ readOnly: true }} value={data.code} placeholder="KTYAS" sx={{ width: '100%' }}></TextField>
              </Grid>
              <Grid item xs={3}>
                <InputLabel>Môn</InputLabel>
                <TextField inputProps={{ readOnly: true }} value={data?.subject?.name}></TextField>
              </Grid>
              <Grid item xs={2}>
                <InputLabel>
                  Thời gian (phút) <span style={{ color: 'red' }}>*</span>
                </InputLabel>
                <TextField
                  inputProps={{ readOnly: true }}
                  type="number"
                  ref={timeRef}
                  onChange={(e) => {}}
                  value={data.duration}
                  sx={{ width: '100%' }}
                ></TextField>
              </Grid>
              <Grid item xs={4} />
              <Grid item xs={3}>
                <InputLabel>
                  Tên đề <span style={{ color: 'red' }}>*</span>
                </InputLabel>
                <TextField
                  inputProps={{ readOnly: true }}
                  ref={nameRef}
                  onChange={(e) => {}}
                  value={data.name}
                  placeholder="Nhập tên đề thi"
                  sx={{ width: '100%' }}
                ></TextField>
              </Grid>
              <Grid item xs={1}>
                <InputLabel>Số câu</InputLabel>
                <TextField
                  inputProps={{ readOnly: true }}
                  type="number"
                  onChange={(e) => {}}
                  value={data.questionCount}
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
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'start', alignItems: 'end' }}></Grid>
        </Grid>
        <ListQuestionInExam inExam infoExam={infoExam} subjects={subjects} listQuestion={data.questions} />
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
            <b>Số câu: {data.questions?.length + '/' + data.questionCount}</b>
          </div>
          {data.authorId === user.id && (
            <Button disabled={editing} onClick={onCopyExam} color="success" variant="contained">
              Sao chép đề
              <CopyAll />
            </Button>
          )}
          <Button disabled={editing} onClick={onSubmit} color="success" variant="contained">
            <GetApp></GetApp> Tải đề
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default ExamViewScreen;
