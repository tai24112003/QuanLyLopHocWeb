import apiCall from 'utils/callApi';

const BASE_URL = import.meta.env.VITE_APP_API_URL + 'computer/';

// Lấy danh sách máy theo RoomID
const getComputerByRoomID = async (roomID) => {
    const url = BASE_URL + `room/${roomID}`;
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
const deleteComputer = async (roomID, computerName) => {
    const url = BASE_URL + `room/${roomID}/computer/${computerName}`;
    const data = await apiCall({ method: 'delete', url });

    return data;
};

// Sửa máy tính
const updateComputer = async (roomID, computerName, updatedData) => {
    const url = BASE_URL + `room/${roomID}/computer/${computerName}`;
    const data = await apiCall({ method: 'put', url, data: updatedData });

    return data;
};

export { getComputerByRoomID, addComputer, deleteComputer, updateComputer };
