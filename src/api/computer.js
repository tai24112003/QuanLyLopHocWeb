import apiCall from 'utils/callApi';

const BASE_URL = import.meta.env.VITE_APP_API_URL + 'computer/';

// Lấy danh sách máy theo RoomID
const getComputerByRoomID = async (roomID) => {
  const url = BASE_URL + `${roomID}`;
  const data = await apiCall({ method: 'get', url });

  return data;
};

const getComputerByID = async (id) => {
  const url = BASE_URL + `/computerID/${id}`;
  const data = await apiCall({ method: 'get', url });

  return data;
};

// Thêm máy tính
const addComputer = async (computerData) => {
  const url = BASE_URL;
  const data = await apiCall({ method: 'post', url, data: computerData });

  return data;
};

// Xóa máy tính
const deleteComputer = async ({ idRoom, computerID }) => {
  const url = BASE_URL + ``;
  const data = await apiCall({ method: 'delete', url, data: { RoomID: idRoom, ComputerID: computerID } });

  return data;
};

// Sửa máy tính
const updateComputer = async (dataNew) => {
  const url = BASE_URL + ``;
  const data = await apiCall({ method: 'put', url, data: { ...dataNew, ComputerName: dataNew.Computer.ComputerName } });

  return data;
};

export { getComputerByRoomID, addComputer, deleteComputer, updateComputer, getComputerByID };
