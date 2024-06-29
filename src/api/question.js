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

const runGetQuestionDatas =async ()=>{
    const url = import.meta.env.VITE_APP_API_URL+'question';
    const data =await apiCall({method:'get', url});

    return data ;
}

const runDeleteQuestionDatas =async (id)=>{
    const url = import.meta.env.VITE_APP_API_URL+`question/${id}`;
    const data =await apiCall({method:'delete', url});
    return data ;
}

const runDeleteCommonQuestion = async (id)=>{
  const url = import.meta.env.VITE_APP_API_URL+`common-content/${id}`;
  const data =await apiCall({method:'delete', url});
  return data ;
}

const runAddOrUpdateQuestions =async (dataIn)=>{
  const url = import.meta.env.VITE_APP_API_URL+`question/create-or-update-many`;
  const data =await apiCall({method:'post', url,data:dataIn});
  return data ;
}

export { runGetQuestionDatas, runDeleteQuestionDatas, runAddOrUpdateQuestions, runDeleteCommonQuestion}