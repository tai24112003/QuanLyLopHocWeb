import apiCall from 'utils/callApi';

const runGetAllUser = async () => {
  const url = import.meta.env.VITE_APP_API_URL + `user/all`;
  const data = await apiCall({ method: 'get', url });
  return data;
};

export { runGetAllUser };
