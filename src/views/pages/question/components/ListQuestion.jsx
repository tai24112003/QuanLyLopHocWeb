import React, { useEffect, useRef, useState } from 'react';

// material-ui

import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
import QuestionItem from './QuestionItem';
import CommonQuestionItem from './CommonQuestionItem';
import { runDeleteCommonQuestion, runDeleteQuestionDatas } from 'api/question';
import ConfirmationDialog from 'ui-component/popup/confirmDelete';
import useNotification from './Notification';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const ListQuestion = ({listQuestion, subjects}) => {
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

  

  const onDeleteQuestionChild = (value)=>{
    listQuestion.forEach((e)=>{
        e.ref.style.border = 'none';
    })
    if(value.id === -1){
      const index = listQuestion.indexOf(value);
      if (index > -1) {
       listQuestion.splice(index, 1);
       showNotification('Xóa thành công!', 'success');
        setReload(!reload);
      }else{
        let indexChild = -1;
        listQuestion.forEach((e)=>{
        indexChild = e.questions?.indexOf(value);
        if(indexChild > -1) {
          e.questions.splice(indexChild,1);
          showNotification('Xóa thành công!', 'success');
          setReload(!reload);
        };
      })
      }
    }else if(value.type_id === 2){
      runDeleteQuestionDatas(value.id).then((data)=>{
        if(data.success) {
          const index = listQuestion.indexOf(value);
          if (index > -1) {
            listQuestion.splice(index, 1);
             setReload(!reload);
           }
        showNotification('Xóa thành công!', 'success');
        }else{
       showNotification('Xóa thất bại!', 'error');
        }
      });
    }else if ((value.common_content_id)){
      runDeleteQuestionDatas(value.id).then((data)=>{
        if(data.success) {
          let indexChild = -1;
          listQuestion.forEach((e)=>{
          indexChild = e.questions?.indexOf(value);
          if(indexChild > -1) {
            e.questions.splice(indexChild,1);
            showNotification('Xóa thành công!', 'success');
          };
          setReload(!reload);
        })
        }else{
          showNotification('Xóa thất bại!', 'error');
        }
      });
    }else {
      runDeleteCommonQuestion(value.id).then((data)=>{
        if(data.success) {
          const index = listQuestion.indexOf(value);
          if (index > -1) {
            listQuestion.splice(index, 1);
             setReload(!reload);
           }
        showNotification('Xóa thành công!', 'success');
        }else{
       showNotification('Xóa thất bại!', 'error');
        }
      });
    }
  }
  return (
  <>
    {listQuestion?.map((question, index)=>{
      return (
        question.type_id === 2 ?
        (
        <React.Fragment key={index}>
          <QuestionItem subjects={subjects} onDestroy={handleClickOpen} question={question} lenght={listQuestion.lenght}/>
        </React.Fragment>
        ):
        (
        <React.Fragment key={index}>
          <CommonQuestionItem subjects={subjects} onDestroy={handleClickOpen} question={question} lenght={listQuestion.lenght}/>
        </React.Fragment>
        )
      )
    })}
    <ConfirmationDialog 
    open={open}
    handleClose={handleClose}
    handleConfirm={handleConfirm}
    />
    <NotificationComponent/>
  </>
  );
};

export default ListQuestion;
