import React, { useEffect, useRef, useState } from 'react';

// material-ui

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
import ConfirmationDialog from 'ui-component/popup/confirmDelete';
import useNotification from './Notification';
import QuestionItemInExam from './QuestionItemInExam';
import CommonQuestionItemInExam from './CommonQuestionItemInExam';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const ListQuestionInExam = ({ listQuestion, subjects, infoExam, inExam = false }) => {
  const [reload, setReload] = useState(false);
  const [open, setOpen] = useState(false);
  const [questionSelected, setQuestionSelected] = useState();
  const { showNotification, NotificationComponent } = useNotification();

  const handleClickOpen = (value) => {
    setQuestionSelected(value);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    onDeleteQuestionChild(questionSelected);
    setOpen(false);
  };

  const onDeleteQuestionChild = (value) => {
    listQuestion.forEach((e) => {
      e.ref.style.border = 'none';
    });
    const index = listQuestion.indexOf(value);
    if (index > -1) {
      listQuestion.splice(index, 1);
      showNotification('Xóa thành công!', 'success');
      setReload(!reload);
    } else {
      let indexChild = -1;
      listQuestion.forEach((e) => {
        indexChild = e.questions?.indexOf(value);
        if (indexChild > -1) {
          e.questions.splice(indexChild, 1);
          showNotification('Xóa thành công!', 'success');
          setReload(!reload);
        }
      });
    }
  };
  return (
    <>
      {listQuestion?.map((question, index) => {
        return question.type_id === 2 ? (
          <React.Fragment key={`${question.id}-${question.type_id}`}>
            <QuestionItemInExam
              inExam={inExam}
              infoExam={infoExam}
              subjects={subjects}
              onDestroy={handleClickOpen}
              question={question}
              lenght={listQuestion.lenght}
            />
          </React.Fragment>
        ) : (
          <React.Fragment key={`${question.id}-${question.type_id}`}>
            <CommonQuestionItemInExam
              inExam={inExam}
              infoExam={infoExam}
              subjects={subjects}
              onDestroy={handleClickOpen}
              question={question}
              lenght={listQuestion.lenght}
            />
          </React.Fragment>
        );
      })}
      <ConfirmationDialog open={open} handleClose={handleClose} handleConfirm={handleConfirm} />
      <NotificationComponent />
    </>
  );
};

export default ListQuestionInExam;
