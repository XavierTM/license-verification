

import axios from 'axios';


const request = axios;

class MyError extends Error {

   toString() {
      return this.message;
   }

   constructor(msg, status) {
      super(msg);
      this.status = status;
   }
}

if (process.env.NODE_ENV === 'production') {
   request.interceptors.request.use((config) => {
      config.url = `${process.env.REACT_APP_BACKEND_URL}${config.url}`;
      return config;
   });
}

request.interceptors.response.use(null, (err) => {

 
   if (err && err.response) {
      const msg = err.response.data;
      const status = err.response.status

      throw new MyError(msg, status);
   } else {
      throw err;
   }
});

export default request;