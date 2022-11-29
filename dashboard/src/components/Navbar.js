import { AppBar } from "@mui/material";
import Component from "@xavisoft/react-component";


class Navbar extends Component {

   _setDimensions = () => {
      const navbar = document.getElementById('navbar');
      const height = navbar.offsetHeight + 'px';
      const width = navbar.offsetWidth + 'px';

      document.documentElement.style.setProperty('--navbar-height', height);
      document.documentElement.style.setProperty('--navbar-width', width);

   }

   componentWillUnmount() {
      this._resizeObserver.disconnect();
   }

   componentDidMount() {
      
      const resizeObserver = new window.ResizeObserver(this._setDimensions);
      this._resizeObserver = resizeObserver;

      const navbar = document.getElementById('navbar');
      resizeObserver.observe(navbar);

   }

   render() {
      return <AppBar id="navbar">
         <h3>CRV-DASHBOARD</h3>
      </AppBar>
   }
}

export default Navbar;