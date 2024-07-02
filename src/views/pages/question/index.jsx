import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';

import { gapGrid, gridSpacing } from 'store/constant';
import { useForm, FormProvider } from 'react-hook-form';

// assets
import MainCard from 'ui-component/cards/MainCard';
import { Button, CardActions, CardContent, MenuItem, Select, Snackbar, TextField, Typography } from '@mui/material';
import { runAddOrUpdateQuestions, runDeleteQuestionDatas, runGetQuestionDatas } from 'api/question';
import ListQuestion from './components/ListQuestion';
import { runGetSubjectOptions } from 'api/subject';
import useNotification from './components/Notification';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const QuestionScreen = () => {
  const [data, setData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [reloadActive, setReloadActive] = useState(false);
  const [qValue, setQValue] = useState('');
  const [subjectValue, setSubjectValue] = useState(-1);
  const [diffValue, setDiffValue] = useState(-1);
  const [chapterValue, setChapterValue] = useState(-1);
  const [listChapterValue, setListChapterValue] = useState([]);
  const [search, setSearch] = useState({ q: '' });
  const methods = useForm();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = methods;
  const { showNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    const searchParams = {
      ...search
    };
    if (diffValue !== -1) searchParams.difficult = diffValue;
    if (chapterValue !== -1) searchParams.chapter_id = chapterValue;
    if (subjectValue !== -1) searchParams.subject_id = subjectValue;
    runGetQuestionDatas(searchParams).then((data) => {
      setData(formatData(data.data));
    });
  }, [reloadActive, search]);

  useEffect(() => {
    runGetSubjectOptions().then((data) => {
      setSubjects(data.data);
    });
  }, []);

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
    data.map((e) => {
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

    if (err) {
      showNotification('Không để trống các câu hỏi!', 'error');
      return;
    } else {
      let dataChanged = data.filter((e) => e.new_or_edit);
      dataChanged = dataChanged.map((e) => {
        const { ref, ...cleanedItem } = e;
        cleanedItem.questions = cleanedItem.questions?.map((e) => {
          const { ref, ...cleanedItem } = e;
          return cleanedItem;
        });
        return cleanedItem;
      });
      runAddOrUpdateQuestions(dataChanged)
        .then((data) => {
          if (data.success) {
            showNotification('Cập nhật thành công!', 'success');
            setReloadActive(!reloadActive);
          } else showNotification('Cập nhật thất bại!', 'error');
        })
        .catch((err) => {
          showNotification('Cập nhật thất bại!', 'error');
        });
    }
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
            <MainCard>
              <Grid container spacing={1}>
                <Grid item xs={4.5}>
                  <TextField
                    onChange={(e) => {
                      setQValue(e.target.value);
                    }}
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
                <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'start', alignContent: 'center' }}>
                  <Button
                    onClick={(e) => {
                      setSearch({ q: qValue });
                    }}
                    variant="contained"
                    color="warning"
                    sx={{ margin: '10px 0' }}
                  >
                    Tìm kiếm
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    Có <b>{data.length}</b> kết quả cho "{search.q}"
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'start', alignItems: 'end' }}>
                  <Button variant="contained" onClick={onAddQuestion} sx={{ margin: '10px 0px' }}>
                    Thêm câu hỏi
                  </Button>
                  <Button variant="contained" onClick={onAddCommonQuestion} sx={{ margin: '10px 10px' }}>
                    Thêm câu hỏi chung
                  </Button>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
          <ListQuestion subjects={subjects} listQuestion={data} register={register} errors={errors} />
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', position: 'sticky', bottom: 20 }}>
            <Button onClick={onSubmit} variant="contained">
              Cập nhật
            </Button>
          </Grid>
        </Grid>
        <NotificationComponent />
      </form>
    </FormProvider>
  );
};

export default QuestionScreen;
