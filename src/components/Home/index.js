import React , {useState,useEffect} from 'react'
import { compose } from 'recompose';
import { AuthUserContext, withAuthorization , withEmailVerification } from '../Session'
import {withFirebase} from '../Firebase';

function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>The Home page is accesible by every signed in user</p>
      <Messages/>
    </div> 
  )
}


const MessegesBase = ({firebase}) => {
  
  const [messages, setMessages] = useState([]);  
  const [newMessage, setNewMessage] = useState('');  
  const [loading, setLoading] = useState(true);
  const [limitPage, setLimitPage] = useState(5);


  useEffect(() => {    
    
    onListenNewMessages();
   
    return () => {
      firebase.messages().off();
    } 
  }
  , []);

const onListenNewMessages = () => {

  firebase.messages()
        .orderByChild('createdAt')
        .limitToLast(limitPage)
        .on('value', snapshot => {        
            const messagesObject = snapshot.val();
            messagesObject!=null?setMessages(Object.keys(messagesObject).map(key => ({      
              ...messagesObject[key],
              uid: key
            })
        )):setMessages([]);
        setLoading(false);  
  }
  , error => {console.log(error);});
}

const onNextpAge = () => {
  setLimitPage(limitPage+5);
  onListenNewMessages();
}

const onCreateMessage = (event,authUser) => {
    event.preventDefault();    
    firebase.messages().push({
      text: newMessage,
      userId: authUser.uid,
      createdAt: firebase.serverValue.TIMESTAMP
    }); setNewMessage('');
  }

const onRemoveMessage = uid => {
    firebase.message(uid).remove();
  }

const onEditMessage = (message,text) => {
    firebase.message(message).update({
      text: text,
      editedAt: firebase.serverValue.TIMESTAMP
    });
  }
  
  return (
    <AuthUserContext.Consumer>
    {
      authUser => (
        <div>
          {!loading && messages && (
            <>
              <button type="button" onClick={onNextpAge}>
                More
              </button>
            </>
          )}
          {loading ? (<div>Loading...</div>) : (
            <div>
              {messages ? (
              <MessagesList                   
                  messages={messages} 
                  onRemoveMessage={onRemoveMessage}
                  onEditMessage = {onEditMessage}
                  authUser={authUser}
                  />):(<div>No messages</div>)
              }

              <form onSubmit={event => onCreateMessage(event , authUser)}>
                <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)}/>
                <button type="submit">Send</button>
              </form>
           </div>
          )}          
        </div>
      )
    }
    </AuthUserContext.Consumer>
  )
}

const MessagesList = ({messages, onRemoveMessage , onEditMessage , authUser}) =>(
    <ul>
      {messages.map(message => {
        return <MessageItem key={message.uid} message={message} onRemoveMessage={onRemoveMessage} onEditMessage={onEditMessage} authUser={authUser} />
      })}
    </ul>
)

const MessageItem = ({message  , onRemoveMessage , onEditMessage , authUser }) => {
    
  const [editMessage, setEditMessage] = useState({
    editMode: false,
    editText: message.text
  });

  const {editMode, editText} = editMessage;

  const onToggleEditMode = () => {
    setEditMessage({
      editMode: !editMessage.editMode,
      editText: message.text
    })
  }

  const onChangeEditText = (e) => {
    setEditMessage({      
      editMode: editMode,
      editText: e.target.value
    })
  }

  const onSaveEditText = () => {
    onEditMessage(message.uid,editText);
    setEditMessage({editMode: false,})
  }  
  
  return(
    <li>
              
        {!editMode ? (<><span><strong>{message.userId} : </strong></span><span>{message.text} { message.editedAt && <span>(Edited)</span>  }</span> </>
            ): (<><input type="text" value={editText} onChange={onChangeEditText}/></>) }

        {authUser.uid === message.userId && (        
          <>
            {!editMode && (<button onClick={() => onRemoveMessage(message.id)}>Remove</button>)}          
            {!editMode ? (<button onClick={onToggleEditMode}>Edit</button>):(
              <>
                <button onClick={onSaveEditText}>Save</button>
                <button onClick={onToggleEditMode}>Cancel</button>
              </>
            )}
          </> 
      )}      
        
        
    </li>
  )
}

const Messages=withFirebase(MessegesBase);

const condition = authUser => !!authUser;

export default compose (
  withEmailVerification,
  withAuthorization(condition)
)(Home);
