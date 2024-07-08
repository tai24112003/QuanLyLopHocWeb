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

const runGetSubjectOptions = async () => {
  const url = import.meta.env.VITE_APP_API_URL + 'subject';
  const data = await apiCall({ method: 'get', url });

  return data;
};

const runGetSubjects = async () => {
  const url = import.meta.env.VITE_APP_API_URL + 'subject/list';
  const data = await apiCall({ method: 'get', url });

  return data;
};

const runDeleteSubject = async (id) => {
  const url = import.meta.env.VITE_APP_API_URL + `subject/${id}`;
  const data = await apiCall({ method: 'delete', url });

  return data;
};

const runUpdateSubject = async (subject) => {
  const url = import.meta.env.VITE_APP_API_URL + `subject/${subject.id}`;
  const data = await apiCall({ method: 'put', url, data: subject });
  return data;
};

const runAddSubject = async (subject) => {
  const url = import.meta.env.VITE_APP_API_URL + `subject`;
  const data = await apiCall({ method: 'post', url, data: subject });
  return data;
};

export { runGetSubjectOptions, runGetSubjects, runDeleteSubject, runUpdateSubject, runAddSubject };
