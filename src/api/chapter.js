import apiCall from 'utils/callApi';

const runGetChapters = async () => {
  const url = import.meta.env.VITE_APP_API_URL + 'chapter';
  const data = await apiCall({ method: 'get', url });

  return data;
};

const runDeleteChapter = async (id) => {
  const url = import.meta.env.VITE_APP_API_URL + `chapter/${id}`;
  const data = await apiCall({ method: 'delete', url });

  return data;
};

const runUpdateChapter = async (chapter) => {
  const url = import.meta.env.VITE_APP_API_URL + `chapter/${chapter.id}`;
  const data = await apiCall({ method: 'put', url, data: chapter });
  return data;
};

const runAddChapter = async (chapter) => {
  const url = import.meta.env.VITE_APP_API_URL + `chapter`;
  const data = await apiCall({ method: 'post', url, data: chapter });
  return data;
};

export { runGetChapters, runDeleteChapter, runUpdateChapter, runAddChapter };
