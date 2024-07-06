import axios from 'axios';

const apiCall = async ({ method = 'get', url, headers = {}, data = null }) => {
  try {
    const response = await axios({
      method,
      url,
      headers,
      data
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error; // Ném lỗi để component xử lý
  }
};

const runGetQuestionDatas = async (searchParams = {}) => {
  // Xây dựng URL với các tham số query
  const url = new URL(import.meta.env.VITE_APP_API_URL + 'question');

  // Thêm các tham số query vào URL nếu có
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
  runAddCommonQuestion
};
