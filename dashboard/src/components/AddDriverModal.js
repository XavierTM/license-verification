
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormLabel, MenuItem, TextField } from "@mui/material";
import Component from "@xavisoft/react-component";
import { css } from '@emotion/css'
import CropImage from "./CropImage";
import { delay } from '../utils'
import { errorToast, successToast } from "../toast";
import { hideLoading, showLoading } from "../loading";
import request from "../request";


const formStyle = css({
   '& > *': {
      margin: '10px auto !important'
   }
})


// function createDefaultDate() {

//    const date = new Date();
//    const y = date.getFullYear();
//    let m = date.getMonth() + 1;
//    let d = date.getDate();

//    if (m < 10)
//       m = `0${m}`;

//    if (d < 10)
//       d = `0${d}`;
   
//    return `${y}-${m}-${d}`;

// }


class AddDriverModal extends Component {

   state = {
      values: {
         gender: '',
         class: ''
      }
   }

   submit = async () => {

      // presence check
      const txtName = document.getElementById('txt-name');
      const txtSurname = document.getElementById('txt-surname');
      const txtNationalID = document.getElementById('txt-national-id');
      const txtDOB = document.getElementById('txt-dob');
      const txtGender = document.getElementById('txt-gender');
      const txtClass = document.getElementById('txt-class');
      const divImage = document.getElementById('img-license');

      const name = txtName.value;
      const surname = txtSurname.value;
      const national_id_no = txtNationalID.value;
      const dob = txtDOB.value;
      const sex = this.state.values.gender;
      const licenseClass = this.state.values.class;
      const image = divImage.value;

      if (!name) {
         errorToast('Name is required');
         return txtName.focus();
      }

      if (!surname) {
         errorToast('Surname is required');
         return txtSurname.focus();
      }

      if (!national_id_no) {
         errorToast('National ID number is required');
         return txtNationalID.focus();
      }

      if (!dob) {
         errorToast('Date of birth is required is required');
         return txtDOB.focus();
      }

      if (!sex) {
         errorToast('Gender is required is required');
         return txtGender.focus();
      }

      if (!licenseClass) {
         errorToast('License class is required is required');
         return txtClass.focus();
      }

      if (!image) {
         errorToast('License picture is required is required');
         return divImage.focus();
      }

      try {

         showLoading();

         const data = {
            name,
            surname,
            dob,
            sex,
            national_id_no,
            image,
            class: licenseClass
         }

         successToast('Driver added');

         const res = await request.post('/api/drivers', data);
         await this.props.close();
         await delay(100);

         await this.props.onSuccess({
            ...data,
            ...res.data,
         });

      } catch (err) {
         alert(String(err));
      } finally {
         hideLoading();
      }

   }

   render() {

      return <Dialog open={this.props.open}>

         <DialogTitle>ADD DRIVER</DialogTitle>

         <DialogContent>
            <div className={formStyle}>

               <TextField
                  variant="standard"
                  size="small"
                  fullWidth
                  label="Name"
                  id="txt-name"
               />

               <TextField
                  variant="standard"
                  size="small"
                  fullWidth
                  label="Surname"
                  id="txt-surname"
               />

               <TextField
                  variant="standard"
                  size="small"
                  fullWidth
                  label="National ID No"
                  id="txt-national-id"
               />

               <div>
                  <FormLabel>Date of birth</FormLabel>

                  <TextField
                     variant="standard"
                     size="small"
                     fullWidth
                     id="txt-dob"
                     type="date"
                  />
               </div>

               <TextField
                  variant="standard"
                  size="small"
                  fullWidth
                  label="Gender"
                  id="txt-gender"
                  onChange={this.onChangeHandlerGenerator('gender')}
                  select
                  value={this.state.values.gender}
               >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Unspecified">Unspecified</MenuItem>
               </TextField>

               <TextField
                  variant="standard"
                  size="small"
                  fullWidth
                  label="License Class"
                  id="txt-class"
                  select
                  onChange={this.onChangeHandlerGenerator('class')}
                  value={this.state.values.class}
               >
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                  <MenuItem value="4">4</MenuItem>
               </TextField>

               <div className="h-align">
                  <div style={{ maxWidth: 200 }}>
                     <CropImage id="img-license" aspectRatio={612/408} />
                  </div>
               </div>

            </div>
         </DialogContent>

         <DialogActions>
            <Button variant="contained" size="large" onClick={this.submit}>
               SAVE
            </Button>

            <Button size="large" onClick={this.props.close}>
               CANCEL
            </Button>

         </DialogActions>
      </Dialog>
   }
}


export default AddDriverModal;