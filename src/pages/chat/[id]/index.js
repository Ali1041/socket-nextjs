// pages/chat/[roomId].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';
import { stringify } from 'postcss';

const ChatRoom = () => {
  const router = useRouter();
  const roomId = router.query.id;
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userList, setUserList] = useState([]);

  // class GroupMessaging:
  // socket_id: string
  // roomId: number
  // user: Foerign key to User

  // class SokcetId:
  // socket_id: string

  useEffect(() => {
    if (!router.isReady) return
    console.log(roomId)
    if (roomId) {
      const newSocket = io({ path: "/api/socketio" });
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log("f*** you farhan")
      })

      newSocket.emit('join', { roomId, username: 'User' + Math.floor(Math.random() * 100) });

      newSocket.on('receiveMessage', (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      newSocket.on('userList', (users) => {
        setUserList(users);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [roomId, router.isReady]);

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
