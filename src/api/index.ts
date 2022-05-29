import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://gorest.co.in',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = '601ae69ca74186575aaea9bc8368de819d919f91b030bd96cc667daa29afa525';
    const auth = token ? `Bearer ${token}` : '';
    if (config.headers) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    let res = error.response;
    // if (res.status == 401) {
    //   window.location.href = "";
    // }

    return Promise.reject(error);
  }
);

export default axiosClient;
