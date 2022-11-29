

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