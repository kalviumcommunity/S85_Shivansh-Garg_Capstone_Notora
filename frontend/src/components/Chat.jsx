import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { Send, Smile, MessageSquare, Users, HelpCircle, Star, Shield, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import axios from 'axios';

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

const rooms = [
  { id: "general", name: "General", icon: "💬" },
  { id: "doubt", name: "Doubt Clarification", icon: "❓" },
  { id: "kalvium", name: "Kalvium Students", icon: "👨‍🎓" },
  { id: "reviews", name: "Reviews", icon: "⭐" },
];

const Chat = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("general");
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket connection effect
  useEffect(() => {
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    // Initialize socket connection
    socketRef.current = io("http://localhost:5000", {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling'],
      withCredentials: true
    });

    // Socket event listeners
    socketRef.current.on("connect", () => {
      console.log("Socket connected successfully");
      setIsConnected(true);
      setError(null);
      socketRef.current.emit("join_room", selectedRoom);
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setError(`Connection error: ${error.message}`);
      setIsConnected(false);
    });

    socketRef.current.on("error", (error) => {
      console.error("Socket error:", error);
      setError(`Socket error: ${error.message}`);
      setIsConnected(false);
    });

    socketRef.current.on("room_messages", (roomMessages) => {
      console.log("Received room messages:", roomMessages);
      setMessages(roomMessages);
      setIsLoading(false);
    });

    socketRef.current.on("receive_message", (message) => {
      console.log("Received message:", message);
      if (message.room === selectedRoom) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socketRef.current.on("message_removed", (messageId) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    });

    socketRef.current.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
      setError(`Disconnected: ${reason}`);
    });

    // Cleanup function
    return () => {
      if (socketRef.current) {
        console.log("Cleaning up socket connection");
        socketRef.current.disconnect();
      }
    };
  }, [token]);

  // Effect for room changes
  useEffect(() => {
    if (socketRef.current && isConnected) {
      console.log("Joining room:", selectedRoom);
      socketRef.current.emit("join_room", selectedRoom);
      setIsLoading(true);
    }
  }, [selectedRoom, isConnected]);

  // Message fetching effect
  useEffect(() => {
    const fetchMessages = async () => {
      if (!token) {
        setError("Authentication token not found");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log("Fetching messages for room:", selectedRoom);
        const response = await fetch(
          `http://localhost:5000/api/chat/messages/${selectedRoom}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include'
          }
        );

        if (response.status === 401) {
          setError("Please log in to view messages");
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch messages: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched messages:", data);
        setMessages(data);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError(`Failed to load messages: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [token, selectedRoom]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !isConnected || !socketRef.current) {
      console.log("Cannot send message:", { 
        hasMessage: !!newMessage.trim(), 
        isConnected, 
        hasSocket: !!socketRef.current 
      });
      return;
    }

    const messageData = {
      content: newMessage,
      room: selectedRoom,
      senderName: user.name,
      isAdmin: user.role === "admin",
    };

    console.log("Sending message:", messageData);
    socketRef.current.emit("send_message", messageData);
    setNewMessage("");
  };

  const handleRoomChange = (roomId) => {
    setSelectedRoom(roomId);
    setMessages([]);
    setIsLoading(true);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Please log in to access the chat</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden border-t border-[#d4e6f0] mt-16">
      {/* Sidebar - Hidden on mobile, visible on md screens */}
      <div className="hidden md:block w-64 bg-[#e8f4fa] text-[#2c4a5c] p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Chat Rooms</h2>
        <div className="space-y-2">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => handleRoomChange(room.id)}
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                selectedRoom === room.id
                  ? "bg-[#bbd9e8] text-[#2c4a5c] shadow-sm"
                  : "hover:bg-[#d4e6f0]"
              }`}
            >
              <span className="text-xl">{room.icon}</span>
              <span className="font-medium">{room.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
        {/* Room Header */}
        <div className="bg-[#e8f4fa] p-4 border-b border-[#d4e6f0] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">💬</span>
                <h2 className="text-xl font-semibold text-[#2c4a5c]">
                  {rooms.find((r) => r.id === selectedRoom)?.name || "Chat"}
                </h2>
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
              {!isConnected && !error && (
                <p className="text-yellow-500 text-sm mt-1">Connecting to chat server...</p>
              )}
            </div>
            {/* Mobile menu button - visible only on small screens */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => {/* Add mobile menu toggle logic */}}
            >
              <svg className="w-6 h-6 text-[#2c4a5c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#bbd9e8]"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500">
              No messages in this room yet
            </div>
          ) : (
            messages.map((message) => {
              const isMe = message.sender === user._id;
              return (
                <div
                  key={message._id}
                  className={`flex ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[70%] rounded-lg p-3 ${
                      message.isAdmin
                        ? "bg-[#bbd9e8] text-[#2c4a5c] shadow-sm"
                        : isMe
                        ? "bg-[#e8f4fa] text-[#2c4a5c] shadow-sm border border-[#d4e6f0]"
                        : "bg-white shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{message.senderName}</span>
                      {message.isAdmin && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#bbd9e8] text-[#2c4a5c]">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="break-words text-sm">{message.content}</p>
                    <span className="text-xs text-[#4a6b7d] mt-1 block">
                      {new Date(message.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSendMessage}
          className="bg-white p-4 border-t shadow-sm flex items-center gap-2"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isConnected ? "Type a message..." : "Connecting to chat server..."}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bbd9e8] text-sm"
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!isConnected || !newMessage.trim()}
            className="px-4 py-2 bg-[#bbd9e8] text-[#2c4a5c] rounded-lg hover:bg-[#a8c8d8] focus:outline-none focus:ring-2 focus:ring-[#bbd9e8] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat; 