import apiCall from 'utils/callApi';

const runGetUser = async () => {
  const url = import.meta.env.VITE_APP_API_URL + `user`;
  const data = await apiCall({ method: 'get', url, headers: { authorization: 'Bearer ' } });

  return data;
};

const login = async (user) => {
  const url = import.meta.env.VITE_APP_API_URL + `auth/login`;
  const data = await apiCall({ method: 'post', url, data: user });

  return data;
};

export { runGetUser, login };
