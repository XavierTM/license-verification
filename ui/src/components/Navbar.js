import { AppBar, Button, Grid } from "@mui/material";
import Component from "@xavisoft/react-component";
import SideNav from "./Sidenav";
import MenuIcon from '@mui/icons-material/Menu'
import { connect } from "react-redux";
import actions from "../actions";


function  setDimensions() { 

   const navbar = document.getElementById('navbar');
   const height = navbar.offsetHeight + 'px';
   const width = navbar.offsetWidth + 'px';

   document.documentElement.style.setProperty('--navbar-height', height);
   document.documentElement.style.setProperty('--navbar-width', width);

}


function logout() {
   window.App.redirect('/');
   actions.setAuthenticated(false);
}

function quitApp() {
   try {
      navigator.app.exitApp();
   } catch (err) {
      console.error(err);
   }
}


const allLinks = [
   {
      caption: 'Logout',
      onClick: logout,
      showWhenAuthenticated: true,
   },
   {
      caption: 'Quit App',
      onClick: quitApp
   }
]


class Navbar extends Component {

   state ={
      sideNavOpen: false
   }

   openSideNav = () => {
      return this.updateState({ sideNavOpen: true });
   }

   closeSideNav = () => {
      return this.updateState({ sideNavOpen: false });
   }

   componenWillUnmount() {
      this.resizeObserver.disconnect();
   }


   componentDidMount() {
      this.resizeObserver = new window.ResizeObserver(setDimensions);
      this.resizeObserver.observe(document.getElementById('navbar'));
      setDimensions();
   }

   render() {

      const links = allLinks.filter(link => {
         return link.showWhenAuthenticated ? (this.props.authenticated ? true : false ) : true;
      });

      return <AppBar id="navbar">
         

         <Grid container>
            <Grid item xs={10}>
               <div className="fill-parent valign">
                  <span 
                     style={{ 
                        padding: 15,
                        display: 'inline-block',
                        fontWeight: 'bold',
                        fontSize: 18
                     }}
                  >
                     LICENSE-LOOKUP
                  </span>
               </div>
            </Grid>

            <Grid item xs={2}>
               <div className="fill-parent valign">
                  <Button
                     style={{
                        color: 'white',
                     }}
                     onClick={this.openSideNav}
                  >
                     <MenuIcon />
                  </Button>
               </div>
            </Grid>
         </Grid>

         <SideNav
            links={links}
            open={this.state.sideNavOpen}
            close={this.closeSideNav}
         />
      </AppBar>
   }
}

function mapStateToProps(state) {
   const { authenticated } = state;
   return { authenticated }
}

export default connect(mapStateToProps)(Navbar);