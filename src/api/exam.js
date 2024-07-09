import apiCall from 'utils/callApi';

const runCreateExam = async (exam) => {
  const url = import.meta.env.VITE_APP_API_URL + `exam`;
  const data = await apiCall({ method: 'post', url, data: exam });

  return data;
};

const runGetExams = async () => {
  const url = import.meta.env.VITE_APP_API_URL + 'exam';
  const data = await apiCall({ method: 'get', url });

  return data;
};

const runGetExam = async (id) => {
  const url = import.meta.env.VITE_APP_API_URL + `exam/${id}`;
  const data = await apiCall({ method: 'get', url });

  return data;
};

export { runCreateExam, runGetExams, runGetExam };
