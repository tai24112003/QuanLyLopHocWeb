import React, { useEffect, useRef, useState } from 'react';

// material-ui

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
import useNotification from './Notification';
import QuestionItemForm from './QuestionItemForm';
import CommonQuestionItemForm from './CommonQuestionItemForm';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@mui/material';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const ListQuestion = React.memo(({ subjects, arrChapter }) => {
  const { showNotification, NotificationComponent } = useNotification();

  const listQuestion = useSelector((state) => {
    return state.customization.listQuestion;
  });

  return (
    <Grid container mt={3} gap={5}>
      {listQuestion?.map((question) => {
        const Component = question.type_id === 2 ? QuestionItemForm : CommonQuestionItemForm;
        return (
          <Component
            showNotification={showNotification}
            key={question.id + ' ' + question.type_id}
            arrChapter={arrChapter[question.subject_id]}
            lstSubject={subjects}
            question={question}
          />
        );
      })}
      <NotificationComponent />
    </Grid>
  );
});

export default ListQuestion;
