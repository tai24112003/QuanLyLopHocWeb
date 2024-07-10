import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, MenuItem, Select, TextField } from '@mui/material';
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
import Cookies from 'js-cookie';

const QuestionItemInExam = ({ question, parentQuestion }) => {
  const [choiceController, setChoiceController] = useState(question?.choices ?? []);
  const thisRef = useRef();
  const content = useRef(question?.content);

  return (
    <>
      <Grid item xs={12}>
        <Accordion id={`${question.id}-${question.type_id}`} ref={thisRef}>
          <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1-content" id="panel1-header">
            <Grid container>
              {question.type_id === 2 ? (
                <Grid item xs={10} mb={1}>
                  <Grid container>
                    <Grid item xs={12} display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
                      <Box width="100%" display="flex" flexDirection="row" alignItems="center">
                        <b> Môn:</b>
                        <Box bgcolor="#4673fe" ml={0.5} mr={1.5} px={1} borderRadius={5} textAlign={'center'} color={'#ffff'}>
                          {question.subject ?? ''}
                        </Box>
                        <b> Chương:</b>
                        <Box ml={0.5} mr={1.5} bgcolor="#00e676" px={1} borderRadius={5} textAlign={'center'} color={'#ffff'}>
                          {question.chapter ?? ''}
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
              ) : (
                <Grid item xs={6} />
              )}
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
                        Authorization: `Bearer ${Cookies.get('asset_token')}`
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
              <Grid item xs={12}>
                <b>Các đáp án:</b>
              </Grid>
              {choiceController?.map((choice, index) => {
                let idF = generateId();
                return (
                  <React.Fragment key={index}>
                    <Grid item xs={4} style={{ paddingTop: 10 }}>
                      <TextField
                        size="small"
                        name={idF}
                        id={idF}
                        multiline
                        inputProps={{ readOnly: true }}
                        onChange={(e) => {
                          thisRef.current.style.border = 'none';
                          let newData = [...choiceController];
                          newData[index] = { ...choice, content: e.target.value };
                          setChoiceController(newData);
                        }}
                        sx={{ width: '100%' }}
                        value={choice.content}
                      ></TextField>
                    </Grid>
                    <Grid item xs={1.5} style={{ paddingTop: 10 }}>
                      <Select
                        size="small"
                        inputProps={{ readOnly: true }}
                        onChange={(e) => {
                          e.stopPropagation();
                          thisRef.current.style.border = 'none';
                          let newData = [...choiceController];
                          newData[index] = { ...choice, is_correct: e.target.value };
                          setChoiceController(newData);
                        }}
                        value={choice.is_correct}
                        sx={{ width: '100%' }}
                      >
                        <MenuItem value={true}>Đúng</MenuItem>
                        <MenuItem value={false}>Sai</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={1} style={{ paddingTop: 10, display: 'flex', alignItems: 'center' }}></Grid>
                    <Grid item xs={5.5} md={0} />
                  </React.Fragment>
                );
              })}
              <Grid item xs={12}></Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </>
  );
};

export default QuestionItemInExam;
