import React, { useEffect, useRef, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, MenuItem, Select, TextField, Typography } from '@mui/material';
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
import { runGetSubjectOptions } from 'api/subject';
import QuestionItemInExam from './QuestionItemInExam';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const CommonQuestionItemInExam = ({ question }) => {
  const thisRef = useRef();
  const content = useRef(question?.content);

  return (
    <>
      <Grid item xs={12}>
        <Accordion id={`${question.id}-${question.type_id}`} ref={thisRef}>
          <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1-content" id="panel1-header">
            <Grid container>
              <Grid item xs={10} mb={1}>
                <Grid container>
                  <Grid item xs={12} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
                    <Box width="100%" display="flex" flexDirection="row" alignItems="center">
                      <b> Môn:</b>
                      <Box bgcolor="#2196f3" ml={0.5} mr={1.5} px={1} borderRadius={5} textAlign={'center'} color={'#ffff'}>
                        {question.questions[0].subject ?? ''}
                      </Box>
                      <b> Chương:</b>
                      <Box ml={0.5} mr={1.5} bgcolor="#00e676" px={1} borderRadius={5} textAlign={'center'} color={'#ffff'}>
                        {question.questions[0].chapter ?? ''}
                      </Box>
                      <b>Độ khó:</b>
                      <Box ml={0.5} mr={1.5} bgcolor="#ffe57f" px={1} borderRadius={5} textAlign={'center'} color={'#000000'}>
                        {question.difficulty == 1 ? 'Dễ' : question.difficulty == 2 ? 'Trung bình' : 'Khó'}
                      </Box>
                      <b>Trạng thái:</b>
                      <Box ml={0.5} mr={1.5} bgcolor="#f44336" px={1} borderRadius={5} textAlign={'center'} color={'#fff'}>
                        Đã được dùng
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={11}>
                <CKEditor
                  disabled={true}
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
                  data={content.current}
                  onChange={(event, editor) => {
                    thisRef.current.style.border = 'none';
                    const data = editor.getData();
                    content.current = data;
                  }}
                  onReady={(editor) => {
                    editor.ui.view.editable.element.addEventListener('click', (event) => {
                      event.stopPropagation();
                    });
                  }}
                />
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12} sx={{ marginBottom: -3 }}>
                <Typography>
                  <b>Các câu hỏi:</b>
                </Typography>
              </Grid>
              {question?.questions?.map((questionItem, index) => (
                <React.Fragment key={questionItem.id}>
                  <QuestionItemInExam parentQuestion={question} question={questionItem} />
                </React.Fragment>
              ))}
              <Grid item xs={12}></Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </>
  );
};

export default CommonQuestionItemInExam;
