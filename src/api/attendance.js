import apiCall from 'utils/callApi';

const BASE_URL = import.meta.env.VITE_APP_API_URL + 'attendance/';

// Lấy danh sách lớp theo UserID
const getAttendance = async (classID) => {
  const url = BASE_URL + `${classID}`;
  const data = await apiCall({ method: 'get', url });

  return data;
};

const updateAttendance = async (updateData) => {
  const url = BASE_URL + ``;
  const data = await apiCall({ method: 'put', url, data: updateData });

  return data;
};

export { getAttendance, updateAttendance };
