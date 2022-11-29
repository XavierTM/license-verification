
import { Tab, Tabs } from "@mui/material";
import DriverManager from "../components/DriverManager";
import UserManager from "../components/UserManager";
import Page from "./Page";


class Dashboard extends Page {

   state = {
      tab: 'drivers'
   }

   onTabChange = (_, tab) => {
      return this.updateState({ tab });
   }

   _render() {

      const { tab } = this.state;
      const TabPanel = tab === 'drivers' ? DriverManager : UserManager;

      return <div
         style={{
            display: 'grid',
            gridTemplateColumns: '200px auto'
         }}
         className="fill-parent"
      >

         <div
            style={{
               borderRight: '1px solid #ddd'
            }}
         >

            <h2 style={{
               textAlign: 'center',
               letterSpacing: 3
            }}>MENU</h2>

            <Tabs
               value={tab}
               orientation="vertical"
               variant="scrollable"
               onChange={this.onTabChange}
            >
               <Tab value="drivers" label="Licenses" />
               <Tab value="users" label="Users" />
            </Tabs>
         </div>

         <div style={{ paddingLeft: 30 }}>
            <TabPanel />
         </div>
      </div>
   }
}

export default Dashboard;