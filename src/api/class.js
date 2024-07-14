import apiCall from 'utils/callApi';

const BASE_URL = import.meta.env.VITE_APP_API_URL + 'class/';

// Lấy danh sách lớp theo UserID
const getClassesByUserId = async () => {
  const url = BASE_URL + `userID`;
  const data = await apiCall({ method: 'get', url });

  return data;
};

// Thêm lớp
const addClass = async (classData) => {
  const url = BASE_URL;
  const data = await apiCall({ method: 'post', url, data: classData });

  return data;
};

// Xóa lớp
const deleteClass = async (classId) => {
  const url = BASE_URL + `${classId}`;
  const data = await apiCall({ method: 'delete', url });

  return data;
};

// Sửa lớp
const updateClass = async (classId, updatedData) => {
  const url = BASE_URL + `${classId}`;
  const data = await apiCall({ method: 'put', url, data: updatedData });

  return data;
};

export { getClassesByUserId, addClass, deleteClass, updateClass };
