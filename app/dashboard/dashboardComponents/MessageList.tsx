
"use client"

import React from 'react';


interface MessagesListProps {
  messages: Message[];
}

const MessagesList: React.FC<MessagesListProps> = ({ messages }) => {
  const handleReply = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-red-600">الرسائل الواردة</h2>
      <ul>
        {messages.map((message, index) => (
          <li key={index} className="mb-4">
            <p><strong>المرسل:</strong> {message.name} - {message.email}</p>
            <p><strong>الرسالة:</strong> {message.content}</p>
            <button 
              onClick={() => handleReply(message.email)} 
              className="mt-2 bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700"
            >
              الرد على الرسالة
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessagesList;

export interface Message {
    name: string;
    email: string;
    content: string;
  }