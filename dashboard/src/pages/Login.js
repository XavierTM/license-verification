import Page from "./Page";
import { css } from '@emotion/css';
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import { errorToast } from "../toast";
import { hideLoading, showLoading } from "../loading";
import request from "../request";

const divLoginCss = css({
   width: 300,
   border: '1px solid #ccc',
   padding: 20,
   borderRadius: 20,
   '& > *': {
      margin: '10px auto !important'
   }
})

class Login extends Page {

   login = async () => {

      const txtUsername = document.getElementById('txt-username');
      const txtPassword = document.getElementById('txt-password');

      const password = txtPassword.value;
      const username = txtUsername.value;

      if (!username) {
         errorToast('Username is required');
         return txtUsername.focus();
      }

      if (!password) {
         errorToast('Password is required');
         return txtPassword.focus();
      }

      try {
         showLoading();

         await request.post('/api/login', {
            username,
            password,
            type: 'admin',
         });

         window.App.redirect('/dashboard');

      } catch (err) {
         alert(String(err));
      } finally {
         hideLoading();
      }


   }

   _render() {
      return <div className="fill-parent vh-align">
         <div className={divLoginCss}>

            <h1 className="center-align">Login</h1>

            <TextField
               id="txt-username"
               fullWidth
               label="Username"
               variant="standard"
               size="small"
            />

            <TextField
               id="txt-password"
               fullWidth
               label="Username"
               variant="standard"
               size="small"
               type="password"
            />

            <Button
               variant="contained"
               size="large"
               fullWidth
               onClick={this.login}
            >LOGIN</Button>

         </div>
      </div>
   }
}

export default Login;