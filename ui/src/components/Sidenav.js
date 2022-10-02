import { Link } from '@xavisoft/app-wrapper'

function SideNav(props) {
   return <div
      style={{
         position: 'fixed',
         top: 0,
         left: 0,
         right: 0,
         bottom: 0,
         background: '#1976D2',
         display: props.open ? 'flex' : 'none',
         alignItems: 'center',
         justifyContent: 'center',
      }}
      onClick={props.close}
   >
      <div style={{ width: 200 }}>
         {
            props.links.map(link => {
               return <SideNavLink {...link} />
            })
         }
      </div>
   </div>
}


function SideNavLink(props) {
   const { onClick, to='', caption } = props;

   return <Link 
      to={to} 
      onClick={onClick} 
      className="center-align"
      style={{
         margin: '10px auto',
         fontSize: 18,
         color: 'white',
         display: 'block',
         textDecoration: 'none'
      }}
   >
      {caption}
   </Link>
}


export default SideNav;