import { css } from "@emotion/css";
import { Button } from "@mui/material";
import Page from "./Page";
import QrCodeIcon from '@mui/icons-material/QrCode';
import { errorToast } from "../toast";
import LookupModal from "../components/LookupModal";
import LicenseModal from "../components/LicenseModal";
import axios from "axios";
import { hideLoading, showLoading } from "../loading";
import { delay } from "../utils";



if (process.env.NODE_ENV === 'production') {
   axios.interceptors.request.use((config) => {
      config.url = `${process.env.REACT_APP_BACKEND_URL}${config.url}`;
      return config;
   });
}



const actionsDivStyle = css({
   '& .btn': {
      margin: '10px auto'
   },
   '& .btn-icon': {
      marginRight: 10
   }
});


class Lookup extends Page {

   state = {
      lookupModalOpen: false,
      lookupMode: null,
      license: {},
      licenseModalOpen: false
   }

   scanLicense = async () => {

      if (process.env.NODE_ENV !== 'production') {
         return errorToast('Feature only available in production');
      }

      try {
         await window.codescanner.start();
         const code = await window.codescanner.scan();
         await window.codescanner.stop();
         const license_no = code.trim();
         await this.lookup('license_no', license_no);

      } catch (err) {
         
         if (String(err).indexOf('cancelled') !== -1) {
            return;
         }

         alert(String(err));

      }
   }

   lookup = async(variableName, value) => {

      try {
   
         showLoading();
   
         const response = await axios.get(`/api/license/?${variableName}=${value}`);
         const { data } = response;
   

         if (this.state.lookupModalOpen) {
            console.log('Closing lookup modal');
            await this.closeLookupModal();
         }

         await delay(100);
         await this.openLicenseModal(data);
   
      } catch (err) {
   
         const status = err.response.status;
   
         if (status === 404) {
            alert(`No matches for ${variableName} '${value}'`);
         } else {
            alert(err.message);
         }
   
      } finally {
         hideLoading();
      }
   }

   lookupLicenseNumber = () => {
      return this.openLookupModal("LICENSE");
   }

   lookupNationIdNumber = () => {
      return this.openLookupModal("NATIONAL_ID");
   }

   openLookupModal = (lookupMode) => {
      return this.updateState({ lookupMode, lookupModalOpen: true});
   }

   closeLookupModal = () => {
      return this.updateState({ lookupModalOpen: false });
   }

   openLicenseModal = (license) => {
      return this.updateState({ licenseModalOpen: true, license });
   }

   closeLicenseModal = () => {
      return this.updateState({ licenseModalOpen: false });
   }

   _render() {

      return <div className="fill-container vhalign">
         <div style={{ width: 200 }} className={actionsDivStyle}>

            <h3 className="center-align">Look Up License</h3>

            <Button
               variant="contained"
               className="rounded btn"
               size="small"
               fullWidth
               onClick={this.scanLicense}
            >
               <QrCodeIcon className="btn-icon" />
               SCAN QR CODE
            </Button>

            <Button
               variant="contained"
               className="rounded btn"
               size="small"
               fullWidth
               color="secondary"
               onClick={this.lookupLicenseNumber}
            >
               ENTER LICENSE NO
            </Button>


            <Button
               variant="outlined"
               className="rounded btn"
               size="small"
               fullWidth
               onClick={this.lookupNationIdNumber}
            >
               ENTER NATIONAL ID
            </Button>

            <LookupModal
               open={this.state.lookupModalOpen}
               close={this.closeLookupModal}
               mode={this.state.lookupMode}
               lookup={this.lookup}
            />

            <LicenseModal
               open={this.state.licenseModalOpen}
               data={this.state.license}
               close={this.closeLicenseModal}
            />
         </div>
      </div>
   }
}


export default Lookup;
