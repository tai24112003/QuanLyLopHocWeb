import apiCall from 'utils/callApi';

const runGetSessionComputerWithMismatch = async () => {
  const url = import.meta.env.VITE_APP_API_URL + `session_computer/with-mismatch-info`;
  const data = await apiCall({ method: 'get', url });
  return data;
};

const runGetSessionComputerById = async (id) => {
  const url = import.meta.env.VITE_APP_API_URL + `session_computer/with-mismatch-info/${id}`;
  const data = await apiCall({ method: 'get', url });
  return data;
};

const runGetSessionComputerByComputerId = async (id) => {
  const url = import.meta.env.VITE_APP_API_URL + `session_computer/get-session-by-computer/${id}`;
  const data = await apiCall({ method: 'get', url });
  return data;
};

const runUpdateMaintainTime = async (dataUpdate) => {
  const url = import.meta.env.VITE_APP_API_URL + `session_computer/update-maintenance-time`;
  const data = await apiCall({ method: 'put', url, data: dataUpdate });
  return data;
};

export { runGetSessionComputerWithMismatch, runUpdateMaintainTime, runGetSessionComputerById, runGetSessionComputerByComputerId };
