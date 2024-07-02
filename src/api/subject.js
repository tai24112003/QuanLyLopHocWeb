import axios from 'axios';

const apiCall = async ({
  method = 'get',
  url,
  headers = {},
  data = null,
}) => {
  try {
    const response = await axios({
      method,
      url,
      headers,
      data,
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error; // Ném lỗi để component xử lý
  }
};

const runGetSubjectOptions =async ()=>{
    const url = import.meta.env.VITE_APP_API_URL+'subject';
    const data =await apiCall({method:'get', url});

    return data ;
}

export { runGetSubjectOptions}