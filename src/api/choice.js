import apiCall from 'utils/callApi';

const runDeleteChoice = async (id) => {
  const url = import.meta.env.VITE_APP_API_URL + `choice/${id}`;
  const data = await apiCall({ method: 'delete', url });

  return data;
};

export { runDeleteChoice };
