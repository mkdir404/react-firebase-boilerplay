import React , { useEffect , useState } from 'react'
import {withFirebase} from '../Firebase';
import {useParams , Routes , Route , Link} from 'react-router-dom';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../Session';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

function Admin(){
  return (
    <div>            
        <Routes>
          <Route  path={ROUTES.INDEX_ROUTE_CHILD} element={<UserLists/>} />
          <Route  path={ROUTES.ADMIN_DETAILS} element={<UserItem/>} />
        </Routes>      
    </div>
  )
}


function UserListBase({firebase}) {

  const [users , setUsers] = useState({
    loading: true,
    users: {}
  });
  
  useEffect(() => {
        
    firebase.users().on('value', snapshot => {  
      const usersObject = snapshot.val();
      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key
      }));
      setUsers({loading: false, users: usersList});    
    });
      
    return () => {
      firebase.users().off();      
    }

  },[]);
  
  return (
    <div>
      <h1>Admin</h1>
      <p>The admin page is accesible by every signed in admin user</p>
      {users.loading ?<div>Loading...</div>:<UserList users={users.users}/>}     
    </div>
  )
}

function UserList({users}){  
  return (
    <div>
        <h1>UserList</h1>    
        <ul>
          {users.map(user => (
            <li key={user.uid}>
              <span>{user.username}</span>
              <span>{user.email}</span>
              <span>{user.uid}</span>
              <span>
                <Link to={`${user.uid}`}>Details</Link>
              </span>
            </li>
          ))}
        </ul>
    </div>
  )
}

function UserItemBase({firebase}){
          
    const [userItem , setUserItem] = useState({
      loading: true,
      user: null
    });

    const { userId } = useParams();

    useEffect(() => {      
      firebase.user(userId).on('value', snapshot => {
        setUserItem({loading: false, user: snapshot.val()});
      }
      );
      return () => {
        firebase.user(userId).off();
      }
    }
    ,[]);

    const onSendPasswordResetEmail = () => {
      firebase.doPasswordReset(userItem.user.email).then(() => {
        alert('Password reset email sent');
      })

    }

    return (
      <div>
        <h1>IDUser({userId})</h1>
        {userItem.loading ? <div>Loading...</div>:
            <div>
              <p>MAIL : {userItem.user.email}</p>
              <p>USERNAME : {userItem.user.username}</p>
              <span>
                <button type="button" onClick={onSendPasswordResetEmail}>
                  Send Password Reset
                </button>
              </span>              
            </div>
        }
      </div>
    )

}


const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN];
const UserLists = withFirebase(UserListBase);
const UserItem = withFirebase(UserItemBase);

export default compose(  
  withEmailVerification,
  withAuthorization(condition)
)(Admin)