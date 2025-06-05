import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { Send, Smile, MessageSquare, Users, HelpCircle, Star, Shield } from 'lucide-react';

// Simple emoji list for demo
const EMOJIS = [
  ["😀", "😂", "😍", "😎", "👍"],
  ["🎉", "🥳", "😇", "🤓", "🔥"],
  ["🙏", "💡", "✨", "🎯", "💪"],
  ["❤️", "😊", "🤔", "😴", "🎨"]
];

function formatTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Generate a color from a string (for avatar background)
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 60%)`;
  return color;
}

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [activeRoom, setActiveRoom] = useState('general');
  const [roomMessages, setRoomMessages] = useState({});
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const rooms = [
    { id: 'general', name: 'General', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'reviews', name: 'Reviews', icon: <Star className="w-5 h-5" /> },
    { id: 'doubt', name: 'Doubt Clarification', icon: <HelpCircle className="w-5 h-5" /> },
    { id: 'kalvium', name: 'Kalvium Students', icon: <Users className="w-5 h-5" /> },
  ];

  // Fetch messages when room changes
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/${activeRoom}/messages`);
        const data = await res.json();
        if (data.messages) {
          setRoomMessages(prev => ({
            ...prev,
            [activeRoom]: data.messages
          }));
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };
    fetchMessages();
  }, [activeRoom]);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL, {
      withCredentials: true,
      auth: {
        token: localStorage.getItem('token')
      }
    });
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit('join_room', activeRoom);

      socket.on('receive_message', (message) => {
        console.log('Received message:', message); // Debug log
        if (message.room === activeRoom) {
          setRoomMessages(prev => ({
            ...prev,
            [message.room]: [...(prev[message.room] || []), message]
          }));
        }
      });

      return () => {
        socket.emit('leave_room', activeRoom);
        socket.off('receive_message');
      };
    }
  }, [socket, activeRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages[activeRoom]]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      console.log('Sending message as admin:', user.role === 'admin'); // Debug log
      const messageData = {
        sender: user.id,
        senderName: user.name,
        content: newMessage,
        room: activeRoom,
        isAdmin: user.role === 'admin'
      };
      console.log('Message data:', messageData); // Debug log
      socket.emit('send_message', messageData);
      setNewMessage('');
      setShowEmojis(false);
    }
  };

  const handleEmojiClick = (emoji) => {
    setNewMessage((msg) => msg + emoji);
    setShowEmojis(false);
  };

  return (
    <div className="flex h-full w-full bg-gray-100">
      {/* Sidebar - Fixed with scrollable rooms */}
      <div className="w-64 bg-white shadow-lg flex flex-col h-full">
        <div className="p-4 border-b flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">Chat Rooms</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setActiveRoom(room.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${
                  activeRoom === room.id
                    ? 'bg-[#bbd9e8] text-gray-800'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {room.icon}
                <span>{room.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area - Fixed height with scrollable messages */}
      <div className="flex-1 flex flex-col h-full">
        <div
          className="flex-1 flex flex-col h-full"
          style={{
            background: 'linear-gradient(135deg, #fafdff 0%, #f7fbfd 100%)',
            border: '1px solid #e2e8f0',
          }}
        >
          {/* Header - Fixed */}
          <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f5f9fc] flex-shrink-0">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-[#3a5d74] tracking-wide">
                {rooms.find(room => room.id === activeRoom)?.name || 'Select a Room'}
              </span>
            </div>
          </div>

          {/* Messages Scroll Area - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-6 space-y-6">
              {(!roomMessages[activeRoom] || roomMessages[activeRoom].length === 0) ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-center">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              ) : (
                roomMessages[activeRoom].map((message, index) => {
                  const isMe = message.sender === user.id;
                  const initials = getInitials(message.senderName || (isMe ? user.name : 'User'));
                  const avatarColor = stringToColor(message.senderName || (isMe ? user.name : 'User'));
                  const time = formatTime(message.timestamp || message.createdAt);
                  const isAdmin = message.isAdmin || (isMe && user.role === 'admin');
                  
                  return (
                    <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {!isMe && (
                        <div className="flex flex-col items-end mr-3 flex-shrink-0">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-base shadow"
                            style={{ background: avatarColor }}
                          >
                            {initials}
                          </div>
                        </div>
                      )}
                      <div className={`flex flex-col max-w-[70%] min-w-0 ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`font-semibold text-xs ${isMe ? 'text-black' : 'text-[#3a5d74]'}`}>
                            {message.senderName || (isMe ? 'You' : 'User')}
                            {isAdmin && (
                              <span className="ml-2 inline-flex items-center text-[#3a5d74]">
                                <Shield className="w-3 h-3 mr-1" />
                                Admin
                              </span>
                            )}
                          </span>
                          <span className="text-xs text-[#bbd9e8] flex-shrink-0">{time}</span>
                        </div>
                        <div
                          className={`rounded-2xl px-4 py-3 shadow-md flex flex-col transition-all duration-200
                            ${isAdmin 
                              ? 'bg-[#3a5d74] text-white'
                              : isMe
                                ? 'bg-[#bbd9e8] text-gray-800'
                                : 'bg-[#f5f9fc] text-black'
                            }
                          `}
                        >
                          <p className="break-words whitespace-pre-wrap text-base">{message.content}</p>
                        </div>
                      </div>
                      {isMe && (
                        <div className="flex flex-col items-end ml-3 flex-shrink-0">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-base shadow"
                            style={{ background: avatarColor }}
                          >
                            {initials}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area - Fixed */}
          <div className="border-t border-[#e2e8f0] bg-[#fafdff] px-4 py-3 flex-shrink-0">
            <form onSubmit={sendMessage} className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bbd9e8] bg-white text-black border-[#e2e8f0] text-base transition-all duration-200 min-w-0"
              />
              <div className="relative flex-shrink-0">
                <button
                  type="button"
                  className="p-2 rounded-lg hover:bg-[#eaf6fb] transition-colors"
                  tabIndex={-1}
                  onClick={() => setShowEmojis((v) => !v)}
                  aria-label="Pick emoji"
                >
                  <Smile className="w-5 h-5 text-[#bbd9e8]" />
                </button>
                {showEmojis && (
                  <div className="absolute bottom-12 right-0 z-10 bg-white border border-[#e2e8f0] rounded-xl shadow-lg p-6 animate-fade-in-down min-w-[300px]">
                    <div className="grid grid-cols-5 gap-8">
                      {EMOJIS.flat().map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          className="text-2xl hover:bg-[#f5f9fc] rounded-lg transition-colors flex items-center justify-center w-8 h-8"
                          onClick={() => handleEmojiClick(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="p-2 rounded-lg bg-[#bbd9e8] text-gray-800 hover:bg-[#a8c8d7] transition-colors flex-shrink-0"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat; 