import React, { useEffect, useRef, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionSummary, Button, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
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
import { useFormContext } from 'react-hook-form';
import { runDeleteChoice } from 'api/choice';
import useNotification from './Notification';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const QuestionItem = ({ arrChapter = [], question, onDestroy, parentQuestion, subjects }) => {
  const [reload, setReload] = useState(false);
  const {
    register,
    setValue,
    triggerValidation,
    formState: { errors }
  } = useFormContext();
  const [chapters, setChapters] = useState([]);
  const [chaptersController, setChaptersController] = useState(-1);
  const [subjectController, setSubjectController] = useState(-1);
  const [diffController, setDiffController] = useState(1);
  const thisRef = useRef();
  const { showNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    setChapters(arrChapter);
  }, []);
  useEffect(() => {
    if (chapters.length == 0) {
      setChaptersController(-1);
      setSubjectController(-1);
      setDiffController(1);
    } else {
      setChaptersController(question.chapter_id);
      setSubjectController(question.subject_id);
      setDiffController(question.difficulty);
    }
  }, [chapters]);

  question.ref = thisRef.current;
  const addChoice = () => {
    const length = question.choices.length;
    if (question.choices[length - 1]?.content == '') {
      showNotification('Không để trống đáp án', 'error');
      return;
    }
    if (length >= 10) return;
    question.choices.push({
      id: -1,
      content: '',
      is_correct: false
    });
    question.new_or_edit = true;
    setReload(!reload);
  };

  const onDeleteChoice = (value) => {
    const idx = question.choices.indexOf(value);
    if (question.choices.length < 2) {
      showNotification('Phải có ít nhất 1 đáp án', 'error');
      return;
    }
    if (value.id !== -1) {
      runDeleteChoice(value.id)
        .then((data) => {
          if (data.success) {
            showNotification('Xóa thành công', 'success');
            question.choices.splice(idx, 1);
            setTimeout(() => setReload(!reload), 1000);
          } else {
            showNotification('Xóa thất bại', 'error');
          }
        })
        .catch((err) => {
          showNotification('Xóa thất bại', 'error');
        });
    } else if (idx > -1) {
      question.choices.splice(idx, 1);
      setReload(!reload);
    }
  };

  const onDeleteQuestion = (event) => {
    event.stopPropagation();
    onDestroy(question);
  };

  return (
    <>
      <Grid item xs={12} className="fade-in">
        <Accordion ref={thisRef}>
          <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1-content" id="panel1-header">
            <Grid container>
              {question.type_id === 2 && (
                <Grid item xs={12} sx={{ marginBottom: 1 }}>
                  <b>Nội dung câu hỏi</b>
                </Grid>
              )}
              <Grid item xs={5.8}>
                <CKEditor
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
                        Authorization: 'Bearer <JSON Web Token>'
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
                  data={question?.content}
                  onChange={(event, editor) => {
                    thisRef.current.style.border = 'none';
                    const data = editor.getData();
                    question.content = data;
                    if (!question.new_or_edit) {
                      question.new_or_edit = true;
                    }
                    if (parentQuestion !== undefined && !parentQuestion?.new_or_edit) {
                      parentQuestion.new_or_edit = true;
                    }
                  }}
                />
              </Grid>
              <Grid item xs={0.2}></Grid>
              <Grid item xs={4}>
                <Grid container>
                  {question.type_id === 2 ? (
                    <>
                      <Grid item xs={2}>
                        Môn:
                      </Grid>
                      <Grid item xs={10} sx={{ marginBottom: 1 }}>
                        <Select
                          style={{ height: '25px', overflow: 'hidden' }}
                          size="small"
                          inputProps={{
                            style: {
                              fontSize: '20px',
                              padding: '10px'
                            }
                          }}
                          onChange={(e) => {
                            thisRef.current.style.border = 'none';
                            if (!question.new_or_edit) {
                              question.new_or_edit = true;
                            }
                            question.subject_id = e.target.value;
                            let lstChapter = subjects.find((item) => item.id === e.target.value).Chapters;
                            question.chapter_id = lstChapter[0]?.id ?? '';
                            setSubjectController(e.target.value);
                            setChapters(lstChapter);
                            setReload(!reload);
                          }}
                          value={subjectController}
                          sx={{ width: '100%' }}
                        >
                          <MenuItem value={-1}>Chọn Môn</MenuItem>
                          {subjects?.map((subject, index) => (
                            <MenuItem key={index} value={subject.id}>
                              {subject.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid item xs={2}>
                        Chương:
                      </Grid>
                      <Grid item xs={10} sx={{ marginBottom: 1 }}>
                        <Select
                          style={{ height: '25px', overflow: 'hidden' }}
                          size="small"
                          onChange={(e) => {
                            thisRef.current.style.border = 'none';
                            if (!question.new_or_edit) {
                              question.new_or_edit = true;
                            }
                            question.chapter_id = e.target.value;
                            setChaptersController(e.target.value);
                            setReload(!reload);
                          }}
                          value={chaptersController}
                          sx={{ width: '100%' }}
                        >
                          <MenuItem value={-1}>Chọn chương</MenuItem>
                          {chapters?.map((chapter, index) => (
                            <MenuItem key={index} value={chapter.id}>
                              {chapter.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid item xs={2}>
                        Độ khó:
                      </Grid>
                      <Grid item xs={10}>
                        <Select
                          style={{ height: '25px', overflow: 'hidden' }}
                          size="small"
                          inputProps={{ padding: 0 }}
                          onChange={(e) => {
                            thisRef.current.style.border = 'none';
                            question.difficulty = e.target.value;
                            if (!question.new_or_edit) {
                              question.new_or_edit = true;
                            }
                            setDiffController(e.target.value);
                            setReload(!reload);
                          }}
                          value={diffController}
                          sx={{ width: '100%', padding: 0 }}
                        >
                          <MenuItem value={1}>Dễ</MenuItem>
                          <MenuItem value={2}>Trung bình</MenuItem>
                          <MenuItem value={3}>Khó</MenuItem>
                        </Select>
                      </Grid>
                    </>
                  ) : (
                    <></>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={1.5} margin="20px 20px">
                <Button onClick={onDeleteQuestion} variant="contained" color="error">
                  Xóa
                </Button>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <b>Các đáp án:</b>
              </Grid>
              {question?.choices?.map((choice, index) => {
                let idF = generateId();
                return (
                  <React.Fragment key={index}>
                    <Grid item xs={4} style={{ paddingTop: 10 }}>
                      <TextField
                        size="small"
                        name={idF}
                        id={idF}
                        {...register(idF, { required: 'This field is required' })}
                        error={!!errors[idF]}
                        helperText={errors[idF] ? errors[idF].message : ''}
                        multiline
                        onChange={(e) => {
                          thisRef.current.style.border = 'none';
                          choice.content = e.target.value;
                          if (!question.new_or_edit) {
                            question.new_or_edit = true;
                          }
                          if (parentQuestion !== undefined && !parentQuestion?.new_or_edit) {
                            parentQuestion.new_or_edit = true;
                          }
                          setReload(!reload);
                        }}
                        sx={{ width: '100%' }}
                        value={choice.content}
                      ></TextField>
                    </Grid>
                    <Grid item xs={1.5} style={{ paddingTop: 10 }}>
                      <Select
                        size="small"
                        onChange={(e) => {
                          e.stopPropagation();
                          thisRef.current.style.border = 'none';
                          choice.is_correct = e.target.value;
                          if (!question.new_or_edit) {
                            question.new_or_edit = true;
                          }
                          if (parentQuestion !== undefined && !parentQuestion?.new_or_edit) {
                            parentQuestion.new_or_edit = true;
                          }
                          setReload(!reload);
                        }}
                        value={choice.is_correct}
                        sx={{ width: '100%' }}
                      >
                        <MenuItem value={true}>Đúng</MenuItem>
                        <MenuItem value={false}>Sai</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={1} style={{ paddingTop: 10, display: 'flex', alignItems: 'center' }}>
                      <Button size="small" onClick={() => onDeleteChoice(choice)} variant="contained" color="error">
                        Xóa
                      </Button>
                    </Grid>
                    <Grid item xs={5.5} />
                  </React.Fragment>
                );
              })}
              <Grid item xs={12}>
                <Button onClick={addChoice} variant="contained" color="success">
                  Thêm đáp án
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <NotificationComponent />
      </Grid>
    </>
  );
};

export default QuestionItem;
