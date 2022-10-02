import { Grid } from "@mui/material";
import Component  from "@xavisoft/react-component";
import { Fragment } from "react";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';



class Disclosure extends Component {


   state = {
      open: false
   }

   toggleState = () => {
      const open = !this.state.open;
      return this.updateState({ open });
   }

   render() {

      let children;

      if (Array.isArray(this.props.children))
         children = this.props.children;
      else
         children = [ this.props.children ]

      const [ button, panel={} ] = children;
      const disclosureIcon = this.state.open ? <ExpandLess /> : <ExpandMore />

      return <div>
         <button
            className="rounded"
            onClick={this.toggleState}
            style={{
               padding: 10,
               backgroundColor: '#1976D2',
               color: 'white',
               fontSize: 16,
               width: '100%',
               border: 'none'
            }}
         >
            <Grid container>
               <Grid item xs={8}>
                  {button.children}
               </Grid>

               <Grid item xs={4} className="right-align">
                  <div className="fill-parent valign" style={{ justifyContent: 'right', paddingRight: 50 }}>
                     {disclosureIcon}
                  </div>
               </Grid>
            </Grid>
         </button>

         <p style={{ display: this.state.open ? 'block': 'none' }}>
            {panel.props.children}
         </p>
      </div>
   }
}


Disclosure.Button = Button;
Disclosure.Panel = Panel;


function Button() {
   return <Fragment />
}

function Panel() {
   return <Fragment />
}

export default Disclosure;
