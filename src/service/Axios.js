import axios from 'axios';

const _axios = axios.create({
  // timeout:60000, // 10 seconds  if we give timeout, while multiple room booking we may get timeout issue
  headers: {
    "secret-code": process.env.REACT_APP_SECRET_CODE,
    // "Content-Type": "multipart/form-data"
  }
});

export default _axios;