import './App.css';
import io from 'socket.io-client';
import { useState } from 'react';
import Chat from './components/Chat'


const socket = io.connect("http://localhost:3001")

function App() {

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [inChat, setInChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== ""){
      socket.emit("join_room", room)
    }
    setInChat(true);
  }

  const leaveRoom = () => {
    setInChat(false);
  }

  return (
    <div className="App">

      {inChat ? 
      <Chat socket={socket} username={username} room={room} leaveRoom={leaveRoom} /> : 
      <div className='chat-login'>
        <h3>CHAT.IO</h3>
        <input className='glass-input' type="text" placeholder="Name..." onChange={(event) => {setUsername(event.target.value)}} />
        <input className='glass-input' type="text" placeholder="Room ID... " onChange={(event) => {setRoom(event.target.value)}} />
        <button  className="glass-button"  onClick={joinRoom}>Join A Room</button>
      </div>}      

      

    </div>
  );
}

export default App;
