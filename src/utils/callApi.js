import Cookies from 'js-cookie';
import axios from 'axios';
const apiCall = async ({ method = 'get', url, headers = {}, data = null }) => {
  try {
    const token = Cookies.get('asset_token');
    headers['ngrok-skip-browser-warning'] = '69420';
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

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

export default apiCall;
