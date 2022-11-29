import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import Component from "@xavisoft/react-component";
import { hideLoading, showLoading } from "../loading";
import request from "../request";
import { delay } from '../utils';
import { errorToast } from "../toast";


class AddUserModal extends Component {

   submit = async () => {

      // presence check
      const txtUsername = document.getElementById('txt-username');
      const txtPassword = document.getElementById('txt-password');
      const txtConfirm = document.getElementById('txt-confirm');

      const username = txtUsername.value;
      const password = txtPassword.value;
      const confirm = txtConfirm.value;

      if (!username) {
         errorToast('Username is required');
         return txtUsername.focus()
      }

      if (!password) {
         errorToast('Password is required');
         return txtPassword.focus()
      }

      if (!confirm) {
         errorToast('Comfirm your password');
         return txtConfirm.focus()
      }

      if (confirm !== password) {
         errorToast('Passwords not matching');
         txtPassword.value = '';
         txtConfirm.value = '';
         return txtPassword.focus();
      }


      try {

         showLoading();

         const data = {
            username,
            password
         }

         const res= await request.post('/api/users', data);

         await this.props.onSuccess({
            ...data,
            ...res.data
         });

         await delay(100);
         await this.props.close();

      } catch (err) {
         alert(String(err));
      } finally {
         hideLoading();
      }



   }

   render() {

      return <Dialog open={this.props.open}>
         <DialogTitle>ADD USER</DialogTitle>

         <DialogContent>
            <div>

               <TextField
                  fullWidth
                  id="txt-username"
                  label="Username"
                  variant="standard"
                  size="small"
               />

               <TextField
                  fullWidth
                  id="txt-password"
                  label="Password"
                  variant="standard"
                  size="small"
                  type="password"
               />
               
               <TextField
                  fullWidth
                  id="txt-confirm"
                  label="Confirm password"
                  variant="standard"
                  size="small"
                  type="password"
               />

            </div>
         </DialogContent>

         <DialogActions>
            <Button variant="contained" onClick={this.submit}>
               SAVE
            </Button>

            <Button onClick={this.props.close}>
               CLOSE
            </Button>
         </DialogActions>
      </Dialog>
   }
}

export default AddUserModal;