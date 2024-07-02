import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';

import { gapGrid, gridSpacing } from 'store/constant';
import { useForm, FormProvider } from 'react-hook-form';

// assets
import MainCard from 'ui-component/cards/MainCard';
import { Button, CardActions, CardContent, InputLabel, MenuItem, Select, Snackbar, TextField } from '@mui/material';
import { runAddOrUpdateQuestions, runDeleteQuestionDatas, runGetQuestionDatas } from 'api/question';
import ListQuestion from './components/ListQuestion';
import { runGetSubjectOptions } from 'api/subject';
import useNotification from './components/Notification';
import generateId from 'utils/generate-id';
import PopupSearchQuestion from './components/PopupSearchQuestion';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const ExamScreen = () => {
  const [data, setData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState('');
  const timeRef = useRef();
  const nameRef = useRef();
  const [reloadActive, setReloadActive] = useState(false);
  const [infoExam, setInfoExam] = useState({
    code: '',
    subject_id: '',
    time: 60,
    name: '',
    count: 50,
    questions: []
  });
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
    runGetQuestionDatas().then((data) => {
      setData(formatData(data.data));
    });
  }, [reloadActive]);

  useEffect(() => {
    infoExam.code = generateId().toUpperCase().substring(3);
    infoExam.subject_id = subjects[0]?.id;
    setInfoExam({ ...infoExam });
  }, [subjects]);

  useEffect(() => {
    runGetSubjectOptions().then((data) => {
      setSubjects(data.data);
    });
  }, []);

  const reloadList = (question) => {
    showNotification('Đã xóa thành công', 'success');
    const idx = infoExam.questions.indexOf(question);
    if (idx > -1) {
      infoExam.questions.splice(idx, 1);
    }
    setInfoExam({ ...infoExam });
  };

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
            questions: []
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

  const onSubmit = () => {
    let err = false;
    infoExam.questions.map((e) => {
      if (e.content === '' || e.chapter_id === '') {
        e.ref.style.border = '1px solid red';
        err = true;
      } else {
        e.ref.style.border = 'none';
      }
      if (!err) {
        e.choices?.forEach((element) => {
          if (element.content === '') {
            e.ref.style.border = '1px solid red';
            err = true;
          }
        });
        e.questions?.forEach((element) => {
          if (element.content === '') {
            e.ref.style.border = '1px solid red';
            err = true;
          }
          element.choices?.forEach((el) => {
            if (el.content === '') {
              e.ref.style.border = '1px solid red';
              err = true;
            }
          });
        });
      }
    });

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
    console.log(infoExam);
  };

  const onAddQuestion = () => {
    setData([
      {
        id: -1,
        content: '',
        subject_id: 1,
        difficulty: 1,
        chapter_id: ``,
        new_or_edit: true,
        type_id: 2,
        choices: [{ id: -1, content: '', is_correct: true }]
      },
      ...data
    ]);
  };

  const onAddCommonQuestion = () => {
    setData([
      {
        id: -1,
        content: '',
        new_or_edit: true,
        type_id: 1,
        subject_id: 1,
        difficulty: 1,
        chapter_id: ``,
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
      ...data
    ]);
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
                  <TextField InputProps={{ readOnly: true }} value={infoExam.code} placeholder="KTYAS" sx={{ width: '100%' }}></TextField>
                </Grid>
                <Grid item xs={3}>
                  <InputLabel>Môn</InputLabel>
                  <Select
                    onChange={(e) => {
                      infoExam.subject_id = e.target.value;
                      infoExam.questions = [];
                      setInfoExam({ ...infoExam });
                    }}
                    value={infoExam.subject_id}
                    sx={{ width: '100%' }}
                  >
                    {subjects.map((subject, index) => (
                      <MenuItem key={index} value={subject.id}>
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
                    ref={timeRef}
                    onChange={(e) => {
                      timeRef.current.querySelector('input').style.border = '0.2px solid #bfc0c2';
                      infoExam.time = e.target.value;
                      setInfoExam({ ...infoExam });
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
                      infoExam.name = e.target.value;
                      setInfoExam({ ...infoExam });
                    }}
                    value={infoExam.name}
                    placeholder="Nhập tên đề thi"
                    sx={{ width: '100%' }}
                  ></TextField>
                </Grid>
                <Grid item xs={1}>
                  <InputLabel>Số câu</InputLabel>
                  <TextField
                    inputProps={{ min: infoExam.questions.length }}
                    type="number"
                    onChange={(e) => {
                      infoExam.count = Math.abs(e.target.value);
                      if (Math.abs(e.target.value) < infoExam.questions.length) infoExam.count = infoExam.questions.length;
                      if (infoExam.count < 1) infoExam.count = 1;
                      setInfoExam({ ...infoExam });
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
            <MainCard>
              <Grid container spacing={1}>
                <Grid item xs={8}>
                  <TextField
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm kiếm nội dung câu hỏi"
                    sx={{ width: '100%' }}
                  ></TextField>
                </Grid>
                <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'start', alignContent: 'center' }}>
                  <Button variant="contained" color="warning" sx={{ margin: '10px 0' }}>
                    Tìm kiếm
                  </Button>
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'start', alignItems: 'end' }}>
                  <Button variant="contained" onClick={handleClickOpenSearch} sx={{ margin: '10px 0px' }}>
                    Thêm câu hỏi
                  </Button>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
          <ListQuestion reloadList={reloadList} inExam infoExam={infoExam} subjects={subjects} listQuestion={infoExam.questions} />
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
              <b>Số câu: {infoExam.questions.length + '/' + infoExam.count}</b>
            </div>
            <Button onClick={onSubmit} variant="contained">
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
