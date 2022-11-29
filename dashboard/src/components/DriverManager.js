import { Button, Fab, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import Component from "@xavisoft/react-component";
import request from "../request";
import LazyloadImage from "./LazyloadImage";
import UpdateIcon from '@mui/icons-material/Update';
import AddIcon from '@mui/icons-material/Add';
import { hideLoading, showLoading } from "../loading";
import AddDriverModal from "./AddDriverModal";
import NotContent from "./NotContent";



class DriverManager extends Component {

   state = {
      error: false,
      drivers: [],
      driverModalOpened: false
   }

   closeAddDriverModal = () => {
      return this.updateState({ driverModalOpened: false })
   }

   openAddDriverModal = () => {
      return this.updateState({ driverModalOpened: true })
   }

   onDriverAdded = (driver) => {
      const drivers = [ ...this.state.drivers, driver ];
      return this.updateState({ drivers });
   }

   _fetchDrivers = async () => {

      try {

         showLoading();

         const res = await request.get('/api/drivers');
         const drivers = res.data;
         await this.updateState({ drivers });

      } catch (err) {
         await this.updateState({ error: true });
         alert(String(err));
      } finally {
         hideLoading();
      }
   }

   _retryLoading = async () => {
      await this.updateState({ error: false });
      await this._fetchDrivers();
   }



   _addOffense = async (event) => {

      const license_no = event.currentTarget.getAttribute('data-license-no');
      const type = window.prompt('Enter offense name');

      if (!type)
         return;

      const details = window.prompt('Enter offense details');

      if (!details)
         return;

      try {

         showLoading();
         
         await request.post(`/api/drivers/${license_no}/offenses`, {
            type,
            details,
         });

      } catch (err) {
         alert(String(err));
      } finally {
         hideLoading();
      }
}


   _updateClass = async (event) => {

      const license_no = event.currentTarget.getAttribute('data-license-no');
      const licenseClass = window.prompt('Enter new license class');

      if (!licenseClass)
         return;

      try {

         showLoading();
         
         await request.patch(`/api/drivers/${license_no}`, {
            class: licenseClass
         });

         const drivers = this.state.drivers.map(driver => {

            if (driver.license_no === license_no)
               return { ...driver, class: licenseClass };

            return driver;
            
         });

         await this.updateState({ drivers });
         

      } catch (err) {
         alert(String(err));
      } finally {
         this._hideLoading();
      }


   }


   componentDidMount() {
      this._fetchDrivers();
   }


   render() {

      let errorJSX, driversJSX;

      if (this.state.error) {
         errorJSX = <NotContent>
            <p>
               Something went wrong, try again.
            </p>

            <Button>RETRY</Button>
         </NotContent>

      } else {
         driversJSX = this.state.drivers.map(driver => {

            const { name, surname, sex, license_no, class: licenseClass, dob, national_id_no } = driver;
            
            return <TableRow>
               <TableCell>{name} {surname}</TableCell>
               <TableCell>{sex}</TableCell>
               <TableCell>{national_id_no}</TableCell>
               <TableCell>{dob}</TableCell>

               <TableCell>

                  <div style={{ width: 100 }}>
                     <LazyloadImage 
                        alt={`${name} ${surname}`}
                        src={`/img/drivers/${license_no}.jpg`}
                        aspectRatio={612/408}
                     />
                  </div>

                  <b>LICENSE NO</b>: <code>{license_no}</code>
                  <br/>
                  <b>LICENSE CLASS</b>: <code>{licenseClass}</code>
                  
               </TableCell>

               <TableCell>
                  <Button
                     variant="contained"
                     size="small"
                     onClick={this._updateClass}
                     data-license-no={license_no}
                  >
                     <UpdateIcon /> Update class
                  </Button>

                  <br />

                  <Button
                     variant="contained"
                     size="small"
                     color="secondary"
                     style={{
                        marginTop: 20
                     }}
                     onClick={this._addOffense}
                     data-license-no={license_no}
                  >
                     <AddIcon /> Add offense
                  </Button>
               </TableCell>
            </TableRow>
         });
      }

      

      return <div 
         style={{
            height: 'calc(var(--window-height) - var(--navbar-height))',
            overflowY: 'auto',
            '--header-height': '70px',
            '--footer-height': '80px',
         }}
      >
         <span
            style={{
               fontWeight: 'bold',
               fontSize: 40,
               height: 'var(--header-height)',
               margin: 0,
            }}
            className="vh-align"
         >LICENSES</span>

         <div style={{
            height: 'calc(var(--window-height) - var(--navbar-height) - var(--header-height) - var(--footer-height))',
            overflowY: 'auto'
         }}>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell><b>NAME</b></TableCell>
                     <TableCell><b>GENDER</b></TableCell>
                     <TableCell><b>NATIONAL_ID</b></TableCell>
                     <TableCell><b>DOB</b></TableCell>
                     <TableCell><b>LICENSE</b></TableCell>
                     <TableCell><b>ACTION</b></TableCell>
                  </TableRow>
               </TableHead>

               <TableBody>
                  {driversJSX}
               </TableBody>
            </Table>

            {errorJSX}

         </div>

         <span
            style={{
               fontWeight: 'bold',
               fontSize: 40,
               height: 'var(--footer-height)',
               margin: 0,
               justifyContent: 'right'
            }}
            className="v-align"
         >
            <Fab
               variant="contained"
               color="primary"
               style={{
                  marginRight: 30,
               }}
               onClick={this.openAddDriverModal}
            >
               <AddIcon />
            </Fab>
         </span>

         <AddDriverModal 
            open={this.state.driverModalOpened}
            onSuccess={this.onDriverAdded}
            close={this.closeAddDriverModal}
         />

      </div>
   }
}

export default DriverManager;
