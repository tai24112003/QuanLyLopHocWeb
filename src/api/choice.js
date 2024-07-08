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
    throw error;
  }
};

const runDeleteChoice = async (id) => {
  const url = import.meta.env.VITE_APP_API_URL + `choice/${id}`;
  const data = await apiCall({ method: 'delete', url });

  return data;
};

export { runDeleteChoice };
