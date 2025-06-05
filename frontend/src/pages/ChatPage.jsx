import React from 'react';
import Chat from '../components/Chat';

const ChatPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10">
      <Chat roomId="general" />
    </div>
  );
};

export default ChatPage; 