import { Button, Dialog, DialogActions, DialogContent, Divider, Grid } from "@mui/material";
import React from "react";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Blockquote from "./Blockquote";
import { Disclosure } from "@headlessui/react";


function geneateImageUrl(license_no) {

   const path = `/img/drivers/${license_no}.jpg`;
   if (process.env.NODE_ENV !== 'production')
      return path;

   return process.env.REACT_APP_BACKEND_URL + path;
}

function LicenseModal(props) {

   const { close, data, open } = props; console.log({ open });
   const [ disclosureOpen, setDisclosureStatus ] = React.useState(false);

   const disclosureVerb = disclosureOpen ?  'Hide' : 'Show';
   const disclosureIcon = disclosureOpen ? <ExpandLess /> : <ExpandMore />
   const offenseCount = data.offenses ? data.offenses.length : 0;

   let offensesJSX;

   if (offenseCount) {

      offensesJSX = data.offenses.map(offense => {
         return <Offense
            type={offense.type}
            details={offense.details}
            createdAt={offense.createdAt}
         />
      });

   } else {
      offensesJSX = <Blockquote>
         No offenses commited
      </Blockquote>
   }


   return <Dialog open={open} fullScreen>

      <DialogContent>
         <img 
            src={geneateImageUrl(data.license_no)}
            alt=""
            style={{
               width: '50%',
               marginLeft: '25%',
               aspectRatio: 1,
               borderRadius: '50%',
               border: '5px solid #1976D2',
               objectFit: 'cover'
            }}
         />

         <Piece name={"Name"} value={`${data.name} ${data.surname}`} />
         <Piece name={"Sex"} value={data.sex} />
         <Piece name={"National ID"} value={data.national_id_no} />
         <Piece name={"D.O.B"} value={(new Date(data.dob)).toDateString()} />
         <Piece name={"License No"} value={data.license_no} />
         <Piece name={"Class"} value={data.class} />
         <Piece name={"Date Issued"} value={(new Date(data.createdAt)).toDateString()} />

         <Disclosure>
            <Disclosure.Button 
               style={{ 
                  width: '100%', 
                  padding: 10,
                  border: 'none',
                  backgroundColor: '#1976D2',
                  color: 'white',
                  fontSize: 16
               }} 
               className="rounded" 
               onClick={() => setDisclosureStatus(!disclosureOpen)}
            >
               <Grid container>
                  <Grid item xs={8}>
                     <div className="fill-parent vh-align">
                        {disclosureVerb} offenses ({offenseCount})
                     </div>
                  </Grid>

                  <Grid item xs={4} className="right-align">
                     <div className="fill-parent valign" style={{ justifyContent: 'right', paddingRight: 50 }}>
                        {disclosureIcon}
                     </div>
                  </Grid>
               </Grid>
            </Disclosure.Button>

            <Disclosure.Panel>
               {offensesJSX}
            </Disclosure.Panel>
         </Disclosure>


      </DialogContent>


      <DialogActions>
         <Button onClick={close}>
            CLOSE
         </Button>
      </DialogActions>
   </Dialog>
}


export default LicenseModal;



function Piece({ name, value }) {
   return <div 
      style={{
         display: "grid",
         gridTemplateColumns: '1fr 1fr',
         fontFamily: "Helvetica, sans-serif",
         margin: '25px auto'
      }}
   >
      <span style={{ fontWeight: 'bold', color: 'grey', fontStretch: 'ultra-condensed' }}>
         {name}
      </span>

      <span style={{ fontWeight: 'bold', }} className="right-align truncate">
         {value}
      </span>
   </div>
}


function Offense({ type, details, createdAt }) {
   return <div>

      <h4>{type}</h4>

      <Blockquote>{details}</Blockquote>

      <div style={{ marginBottom: 20 }}>
         <b>Commited</b> {(new Date(createdAt)).toDateString()}
      </div>

      <Divider />
   </div>
}