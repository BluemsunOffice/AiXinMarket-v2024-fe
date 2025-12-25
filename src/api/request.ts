import axios from 'axios';
const authToken = localStorage.getItem('token');
const clientId = localStorage.getItem('clientid');
const request = axios.create({
  baseURL: 'http://59.110.62.188:8080/',
  timeout: 60000,
  headers: {
    'Authorization': `Bearer ${authToken}`,
    'clientId': `${clientId}`
  }
});

export default request;