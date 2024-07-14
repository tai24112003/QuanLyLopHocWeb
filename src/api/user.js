import apiCall from 'utils/callApi';

const runGetAllUser = async () => {
  const url = import.meta.env.VITE_APP_API_URL + `user/all`;
  const data = await apiCall({ method: 'get', url });
  return data;
};

const runAddUser = async (userData) => {
  const url = import.meta.env.VITE_APP_API_URL + `user`;
  const data = await apiCall({ method: 'post', url, data: userData });
  return data;
};

const runUpdateUser = async (updatedData) => {
  const url = import.meta.env.VITE_APP_API_URL + `user/${updatedData.id}`;
  const data = await apiCall({ method: 'put', url, data: updatedData });
  return data;
};

const runToggleUserStatus = async (userId) => {
  const url = import.meta.env.VITE_APP_API_URL + `user/lock/${userId}`;
  const data = await apiCall({ method: 'put', url });
  return data;
};

export { runGetAllUser, runAddUser, runUpdateUser, runToggleUserStatus };
