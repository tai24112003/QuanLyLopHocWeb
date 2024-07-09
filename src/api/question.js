import apiCall from 'utils/callApi';

const runGetQuestionDatas = async (searchParams = {}) => {
  const url = new URL(import.meta.env.VITE_APP_API_URL + 'question');

  if (searchParams.q) {
    url.searchParams.append('q', searchParams.q);
  }
  if (searchParams.subject_id) {
    url.searchParams.append('subject_id', searchParams.subject_id);
  }
  if (searchParams.chapter_id) {
    url.searchParams.append('chapter_id', searchParams.chapter_id);
  }
  if (searchParams.difficult) {
    url.searchParams.append('difficult', searchParams.difficult);
  }

  // Gọi API
  const data = await apiCall({ method: 'get', url: url.toString() });

  return data;
};

const runDeleteQuestionDatas = async (id) => {
  const url = import.meta.env.VITE_APP_API_URL + `question/${id}`;
  const data = await apiCall({ method: 'delete', url });
  return data;
};

const runDeleteCommonQuestion = async (id) => {
  const url = import.meta.env.VITE_APP_API_URL + `common-content/${id}`;
  const data = await apiCall({ method: 'delete', url });
  return data;
};

const runCopyCommonQuestion = async (id) => {
  const url = import.meta.env.VITE_APP_API_URL + `common-content/copy/${id}`;
  const data = await apiCall({ method: 'put', url });
  return data;
};

const runUpdateCommonQuestion = async (question) => {
  const url = import.meta.env.VITE_APP_API_URL + `common-content/${question.id}`;
  const data = await apiCall({ method: 'put', url, data: question });
  return data;
};

const runAddCommonQuestion = async (question) => {
  const url = import.meta.env.VITE_APP_API_URL + `common-content`;
  const data = await apiCall({ method: 'post', url, data: question });
  return data;
};

const runAddQuestion = async (question) => {
  const url = import.meta.env.VITE_APP_API_URL + `question`;
  const data = await apiCall({ method: 'post', url, data: question });
  return data;
};

const runUpdateQuestion = async (question) => {
  const url = import.meta.env.VITE_APP_API_URL + `question/${question.id}`;
  const data = await apiCall({ method: 'put', url, data: question });
  return data;
};

const runSetPublic = async (id) => {
  const url = import.meta.env.VITE_APP_API_URL + `question/public/${id}`;
  const data = await apiCall({ method: 'put', url });
  return data;
};

const runAddOrUpdateQuestions = async (dataIn) => {
  const url = import.meta.env.VITE_APP_API_URL + `question/create-or-update-many`;
  const data = await apiCall({ method: 'post', url, data: dataIn });
  return data;
};

export {
  runGetQuestionDatas,
  runDeleteQuestionDatas,
  runUpdateCommonQuestion,
  runAddOrUpdateQuestions,
  runDeleteCommonQuestion,
  runAddQuestion,
  runUpdateQuestion,
  runAddCommonQuestion,
  runCopyCommonQuestion,
  runSetPublic
};
