import apiCall from 'utils/callApi';

const BASE_URL = import.meta.env.VITE_APP_API_URL + 'room/';

// Hàm lấy thông tin phòng theo ID
const getRoomByID = async (id) => {
  const url = BASE_URL + `id/${id}`;
  const data = await apiCall({ method: 'get', url });

  return data;
};
// Hàm lấy thông tin phòng theo ID
const getAllRoom = async () => {
  const url = BASE_URL;
  const data = await apiCall({ method: 'get', url });

  return data;
};
// Hàm thêm phòng mới
const addRoom = async (newRoom) => {
  const url = BASE_URL;
  const data = await apiCall({ method: 'post', url, data: newRoom });

  return data;
};

// Hàm xóa phòng
const deleteRoom = async (id) => {
  const url = BASE_URL + id;
  const data = await apiCall({ method: 'delete', url });

  return data;
};

// Hàm cập nhật thông tin phòng
const updateRoom = async (updatedRoom) => {
  const url = BASE_URL + updatedRoom.RoomID;
  const data = await apiCall({ method: 'put', url, data: updatedRoom });

  return data;
};

export { getRoomByID, addRoom, deleteRoom, updateRoom, getAllRoom };
