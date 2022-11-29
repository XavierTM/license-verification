
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import Component from "@xavisoft/react-component";
import { errorToast } from "../toast";


class LookupModal extends Component {

   search = async () => {
      const txtInput = document.getElementById('txt-input');
      const value = txtInput.value;

      if (!value) {
         errorToast("Provide a value");
         return txtInput.focus();
      }

      const variableName = this.props.mode === 'LICENSE' ? 'license_no' : 'national_id_no';
      this.props.lookup(variableName, value);

   }

   render() {

      const title = this.props.mode === 'LICENSE' ? 'ENTER LICENSE NUMBER' : 'ENTER NATIONAL ID'
      return <Dialog open={this.props.open}>

         <DialogTitle>{title}</DialogTitle>

         <DialogContent>
            <TextField
               fullWidth
               id="txt-input"
               size="small"
               variant="standard"
            />
         </DialogContent>

         <DialogActions>

            <Button variant={"contained"} onClick={this.search}>
               SEARCH
            </Button>

            <Button onClick={this.props.close}>
               CLOSE
            </Button>
         </DialogActions>
      </Dialog>
   }
}


export default LookupModal;