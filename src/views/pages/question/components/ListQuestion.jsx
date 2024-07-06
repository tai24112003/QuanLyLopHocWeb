import React, { useEffect, useRef, useState } from 'react';

// material-ui

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
import { runDeleteCommonQuestion, runDeleteQuestionDatas } from 'api/question';
import ConfirmationDialog from 'ui-component/popup/confirmDelete';
import useNotification from './Notification';
import QuestionItemForm from './QuestionItemForm';
import CommonQuestionItemForm from './CommonQuestionItemForm';
import { useSelector } from 'react-redux';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const ListQuestion = ({ subjects, arrChapter }) => {
  const [open, setOpen] = useState(false);
  const [questionSelected, setQuestionSelected] = useState();
  const { showNotification, NotificationComponent } = useNotification();
  const listQuestion = useSelector((state) => {
    return state.customization.listQuestion;
  });
  // console.log(listQuestion);
  const handleClickOpen = (value) => {
    setQuestionSelected(value);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    //onDeleteQuestionChild(questionSelected);
    setOpen(false);
  };
  return (
    <>
      {listQuestion?.map((question, index) => {
        return question.type_id === 2 ? (
          <React.Fragment key={listQuestion.length - index}>
            <QuestionItemForm arrChapter={arrChapter[question.subject_id]} subjects={subjects} question={question} />
          </React.Fragment>
        ) : (
          <React.Fragment key={listQuestion.length - index}>
            <CommonQuestionItemForm arrChapter={arrChapter[question.subject_id]} subjects={subjects} question={question} />
          </React.Fragment>
        );
      })}
      <ConfirmationDialog open={open} handleClose={handleClose} handleConfirm={handleConfirm} />
      <NotificationComponent />
    </>
  );
};

export default ListQuestion;
