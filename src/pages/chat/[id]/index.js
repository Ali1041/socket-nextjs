// pages/chat/[roomId].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';
let socketc

const ChatRoom = () => {
  const router = useRouter();
  const roomId = router.query.id
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userList, setUserList] = useState([]);
  const [roomIdState, setRoomId] = useState()

  useEffect(() => {
    if (!router.isReady) return
    const id = router.query
    socketInitializer(id)
    setRoomId(id)
    return () => {
      socketio.disconnect()
    }
  }, [router.isReady])

  const socketInitializer = async () => {
    await fetch('/api/chat/' + roomId)
    // inside io the connection should be on different route
    socketio = io()
    console.log(socketio)

    socketio.on("connect", () => {
      console.log("connected")
    })

    socketio.emit('join', { roomId, username: 'User' + Math.floor(Math.random() * 100) });

    socketio.on('receiveMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socketio.on('userList', (users) => {
      setUserList(users);
    });
  }
  const sendMessage = () => {
    if (socket && message.trim() !== '') {
      socket.emit('sendMessage', { roomId, message });
      setMessage('');
    }
  };

  return (
    <div>
      <h1>Chat Room {roomId}</h1>
      <div>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg.username}: {msg.message}</li>
          ))}
        </ul>
      </div>
      <div>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div>
        <h2>User List</h2>
        <ul>
          {userList.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatRoom;
