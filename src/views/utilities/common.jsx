const scrollToCenter = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
};
const flattenArray = (arr) => {
  return arr.flatMap((item) => {
    if (Array.isArray(item.questions)) {
      return flattenArray(item.questions);
    } else {
      return item;
    }
  });
};

const isPhoneNumberValid = (phone) => {
  const phoneRegex = /^(09|08|03|07|05)\d{8}$/;
  return phoneRegex.test(phone);
};

const isEmailValid = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const formatData = (data) => {
  return data?.reduce((result, question) => {
    question.isEditing = false;
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
          questions: [],
          canRemove: question.canRemove,
          authorId: question.authorId,
          shared: question.shared,
          author: question.author
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

export { scrollToCenter, flattenArray, isPhoneNumberValid, isEmailValid, formatData };
