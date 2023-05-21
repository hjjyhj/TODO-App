// api.js
import axios from 'axios';

export const registerUser = async (username, password) => {
  try {
    const response = await axios.post('http://localhost:3001/register', {
      username,
      password
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post('http://localhost:3001/login', {
      username,
      password
    });
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createAxiosInstance = () => {
  return axios.create({
    baseURL: 'http://localhost:3001/',
    headers: { 'x-access-token': localStorage.getItem('token') }
  });
};

// you can also add methods for fetching, creating, updating, and deleting todos here
