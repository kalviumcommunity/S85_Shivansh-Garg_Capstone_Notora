import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { Send, Smile } from 'lucide-react';

// Simple emoji list for demo
const EMOJIS = ["😀", "😂", "😍", "😎", "👍", "🎉", "🥳", "😇", "🤓", "🔥", "🙏", "💡"];

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

const Chat = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  // Fetch messages on mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/chat/${roomId}/messages`);
        const data = await res.json();
        if (data.messages) setMessages(data.messages);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchMessages();
  }, [roomId]);

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      withCredentials: true
    });
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit('join_room', roomId);

      socket.on('receive_message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.emit('leave_room', roomId);
        socket.off('receive_message');
      };
    }
  }, [socket, roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      const messageData = {
        sender: user.id,
        senderName: user.name,
        content: newMessage,
        room: roomId
      };
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
    <div
      className="flex flex-col w-full max-w-2xl animate-fade-in-down glass-effect shadow-2xl"
      style={{
        minHeight: 600,
        borderRadius: '1.5rem',
        boxShadow: '0 8px 32px 0 rgba(154, 201, 222, 0.13), 0 1.5px 6px 0 rgba(154, 201, 222, 0.10)',
        background: 'linear-gradient(135deg, #fafdff 0%, #f7fbfd 100%)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f5f9fc]">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-lg text-[#3a5d74] tracking-wide">💬 Notora Chat</span>
        </div>
      </div>
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 bg-gradient-to-br from-white via-[#fafdff] to-[#f7fbfd]">
        <div className="space-y-6">
          {messages.map((message, index) => {
            const isMe = message.sender === user.id;
            const initials = getInitials(message.senderName || (isMe ? user.name : 'User'));
            const avatarColor = stringToColor(message.senderName || (isMe ? user.name : 'User'));
            const time = formatTime(message.timestamp || message.createdAt);
            return (
              <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                  <div className="flex flex-col items-end mr-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-base shadow"
                      style={{ background: avatarColor }}
                    >
                      {initials}
                    </div>
                  </div>
                )}
                <div className={`flex flex-col max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`font-semibold text-xs ${isMe ? 'text-black' : 'text-[#3a5d74]'}`}>{message.senderName || (isMe ? 'You' : 'User')}</span>
                    <span className="text-xs text-[#9AC9DE]">{time}</span>
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-md flex flex-col transition-all duration-200
                      ${isMe
                        ? 'bg-[#eaf0f5] text-black self-end'
                        : 'bg-[#f5f9fc] text-black self-start'}
                    `}
                  >
                    <p className="break-words whitespace-pre-wrap text-base">{message.content}</p>
                  </div>
                </div>
                {isMe && (
                  <div className="flex flex-col items-end ml-3">
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
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Input Area */}
      <form onSubmit={sendMessage} className="border-t border-[#e2e8f0] bg-[#fafdff] px-4 py-3 flex items-center space-x-2 relative">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9AC9DE] bg-white text-black border-[#e2e8f0] text-base transition-all duration-200"
        />
        <div className="relative">
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-[#eaf6fb] transition-colors"
            tabIndex={-1}
            onClick={() => setShowEmojis((v) => !v)}
            aria-label="Pick emoji"
          >
            <Smile className="w-5 h-5 text-[#9AC9DE]" />
          </button>
          {showEmojis && (
            <div className="absolute bottom-12 left-0 z-10 bg-white border border-[#e2e8f0] rounded-xl shadow-lg p-2 flex flex-wrap gap-1 animate-fade-in-down">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className="text-2xl p-1 hover:bg-[#f5f9fc] rounded-lg transition-colors"
                  onClick={() => handleEmojiClick(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="p-2 rounded-lg bg-[#9AC9DE] text-white hover:bg-[#7bbad2] transition-all duration-200 shadow"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default Chat; 