import Component from "@xavisoft/react-component";
import AddIcon from "@mui/icons-material/Add";
import { Button, Fab, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import NotContent from "./NotContent";
import request from "../request";
import { hideLoading, showLoading } from "../loading";
import AddUserModal from "./AddUserModal";
import TimeAgo from 'react-timeago';


class UserManager extends Component {

   state = {
      error: false,
      users: [],
      addUserModalOpen: false,
   }

   openAddUserModal = () => {
      return this.updateState({ addUserModalOpen: true })
   }

   closeAddUserModal = () => {
      return this.updateState({ addUserModalOpen: false })
   }

   onUserAdded = (user) => {
      const users = [ ...this.state.users, user ];
      return this.updateState({ users });
   }

   retryFetching = async () => {
      await this.updateState({ error: false });
      await this.fetchUsers();
   }

   fetchUsers = async () => {
      
      try {

         showLoading();

         const res = await request.get('/api/users');
         const users = res.data;

         await this.updateState({ users });

      } catch (err) {
         alert(String(err));
         await this.updateState({ error: true })
      } finally {
         hideLoading();
      }
   }

   componentDidMount() {
      this.fetchUsers();
   }

   render() {

      let usersJSX;
      let noUsersJSX;
      let errorJSX;

      if (this.state.error) {
         errorJSX = <NotContent>
            Something went wrong
            <br/>
            <Button onClick={this.retryFetching}>
               RETRY
            </Button>
         </NotContent>
      } else {
         if (this.state.users.length === 0) {
            noUsersJSX = <NotContent>
               No users added
            </NotContent>
         } else {
            usersJSX = this.state.users.map(user => {

               const { username, id, createdAt } = user;
               

               return <TableRow>

                  <TableCell>{id}</TableCell>
                  <TableCell>{username}</TableCell>

                  <TableCell>
                     <TimeAgo date={createdAt} />
                  </TableCell>
               </TableRow>
            });
         }
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
         >USERS</span>

         <div style={{
            height: 'calc(var(--window-height) - var(--navbar-height) - var(--header-height) - var(--footer-height))',
            overflowY: 'auto'
         }}>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell>USER ID</TableCell>
                     <TableCell><b>USERNAME</b></TableCell>
                     <TableCell><b>ADDED</b></TableCell>
                  </TableRow>
               </TableHead>

               <TableBody>
                  {usersJSX}
               </TableBody>
            </Table>

            {noUsersJSX}
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
               onClick={this.openAddUserModal}
            >
               <AddIcon />
            </Fab>
         </span>

         <AddUserModal
            open={this.state.addUserModalOpen}
            close={this.closeAddUserModal}
            onSuccess={this.onUserAdded}
         />


      </div>
   }
}


export default UserManager;