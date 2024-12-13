import axios from 'axios';

const token = localStorage.getItem('token'); 

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  timeout: 30000,
});

export const updateAxiosToken = (newToken) => {
  axiosInstance.defaults.headers['Authorization'] = `${newToken}`;
};

export default axiosInstance