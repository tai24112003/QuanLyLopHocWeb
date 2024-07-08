import React, { useEffect, useRef, useState } from 'react';

// material-ui

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
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

  return (
    <>
      {listQuestion?.map((question, index) => {
        return question.type_id === 2 ? (
          <React.Fragment key={`${question.id}-${question.type_id}`}>
            <QuestionItemForm question={question} />
          </React.Fragment>
        ) : (
          <React.Fragment key={`${question.id}-${question.type_id}`}>
            <CommonQuestionItemForm question={question} />
          </React.Fragment>
        );
      })}
      <NotificationComponent />
    </>
  );
};

export default ListQuestion;
