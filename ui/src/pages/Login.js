import Page from "./Page";
import { VStack, Spacer } from '@chakra-ui/react';
import Button from "@mui/material/Button";
import zrpLogo from '../media/img/zrp.webp';
import { TextField } from "@mui/material";
import { css } from "@emotion/css";
import { errorToast } from "../toast";
import actions from "../actions";
import { hideLoading, showLoading } from '../loading';
import request from "../request";


const formStyle = css({
   '& .form-control': {
      margin: '10px auto',
   }
})

class Login extends Page {


   login = async () => {

      const txtUsername = document.getElementById('txt-username');
      const txtPassword = document.getElementById('txt-password');

      const username = txtUsername.value.toLowerCase().trim();
      const password = txtPassword.value;

      if (!username) {
         errorToast("Username is required");
         return txtUsername.focus();
      }

      if (!password) {
         errorToast("Password is required");
         return txtPassword.focus();
      }

   
      try {

         showLoading();

         await request.post('/api/login', {
            username,
            password,
            type: 'officer'
         });

         window.App.redirect("/lookup");
         actions.setAuthenticated();

      } catch (err) {
         alert(String(err));
      } finally {
         hideLoading();
      }

   }


   _render() {

      return <div style={{ display: 'flex' }} className="fill-container">
         <VStack>

            <Spacer />
            
            <div 
               className={`center-align ${formStyle}`}
               style={{
                  padding: 20
               }}
            >
               <img 
                  src={zrpLogo} 
                  alt="" 
                  style={{
                     width: '100%',
                  }}
               />


               <TextField
                  fullWidth
                  variant="standard"
                  size="small"
                  label="Username"
                  className="form-control"
                  id="txt-username"
               />


               <TextField
                  fullWidth
                  variant="standard"
                  size="small"
                  label="Username"
                  className="form-control"
                  id="txt-password"
                  type={"password"}
               />

               <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  className="form-control"
                  onClick={this.login}
               >
                  LOGIN
               </Button>
            </div>

            <Spacer />
         </VStack>
      </div>
   }
}

export default Login;