import axios from 'axios';
import config from '../config';
import storage from '../utils/Storage';

const baseUrl = config.base_url;

const server = axios.create({
  baseURL: config.base_url,
});

/**
 * Login a user
 * 
 * @param {String} email
 * @param {String} password
 */
const login = async (email, password) => {
  const res = await server.post(baseUrl + 'api/v1/auth/login', {email: email, password: password});

  if (res.status !== 200) {
    return null; // TODO: Return proper indications
  }

  storage.setAuthToken(res.data.token);
  storage.setUserInfo(res.data.data);
  window.location.reload(); // TODO: Redirect to content page
};

/**
 * Register a user
 * 
 * @param {String} username 
 * @param {String} email 
 * @param {String} password 
 */
const register = async (username, email, password) => {
  const payload = {username: username, email: email, password: password};

  const res = await server.post(baseUrl + 'api/v1/auth/register', payload);

  if (res.status !== 201) {
    return null; // TODO: Return proper indications
  }

  storage.setAuthToken(res.data.token);
  storage.setUserInfo(res.data.data);
  window.location.reload(); // TODO: Redirect to content page
};

export default {
  login,
  register,
};
