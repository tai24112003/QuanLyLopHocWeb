import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';

import { gapGrid, gridSpacing } from 'store/constant';
import { useForm, FormProvider } from 'react-hook-form';

// assets
import MainCard from 'ui-component/cards/MainCard';
import { Button, CardActions, CardContent, Snackbar, TextField } from '@mui/material';
import { runAddOrUpdateQuestions, runDeleteQuestionDatas, runGetQuestionDatas } from 'api/question';
import ListQuestion from './components/ListQuestion';
import { runGetSubjectOptions } from 'api/subject';
import useNotification from './components/Notification';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const QuestionScreen = () => {
  const [data, setData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [reloadActive, setReloadActive] = useState(false);
  const navigate = useNavigate();
  const methods = useForm();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = methods;
  const { showNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    runGetQuestionDatas().then((data) => {
      setData(formatData(data.data));
    });
  }, [reloadActive]);

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
                <Grid item xs={8}>
                  <TextField placeholder="Tìm kiếm nội dung câu hỏi" sx={{ width: '100%' }}></TextField>
                </Grid>
                <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'start', alignContent: 'center' }}>
                  <Button variant="contained" color="warning" sx={{ margin: '10px 0' }}>
                    Tìm kiếm
                  </Button>
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
