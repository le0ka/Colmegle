// src/components/VideoChat.tsx
import React, { useState, useRef, useEffect } from 'react';
import type { Message, User } from '../types';

const VideoChat: React.FC = () => {
  const [partner, setPartner] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const partnerVideoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock function to find a new partner
  const findNewPartner = () => {
    setIsLoading(true);
    setPartner(null);
    setMessages([]);
    
    // Simulate finding a new partner after a delay
    setTimeout(() => {
      setPartner({
        id: Math.random().toString(36).substring(7),
        name: `Stranger${Math.floor(Math.random() * 1000)}`
      });
      setIsLoading(false);
    }, 1500);
  };

  // Initialize with a partner
  useEffect(() => {
    findNewPartner();
    
    // Mock video stream (in a real app, you'd use getUserMedia)
    if (myVideoRef.current) {
      myVideoRef.current.srcObject = new MediaStream();
    }
    
    if (partnerVideoRef.current && partner) {
      partnerVideoRef.current.srcObject = new MediaStream();
    }
  }, []);

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'me',
      timestamp: new Date()
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    // Simulate response after a delay
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: `Response to "${newMessage}"`,
        sender: 'them',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, response]);
    }, 1000 + Math.random() * 2000);
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    // In a real app, you would enable/disable the video track here
  };

  return (
    <div className="video-chat-container">
      <div className="video-container">
        {isLoading ? (
          <div className="loading-partner">
            <p>Looking for someone to connect with...</p>
            <div className="spinner"></div>
          </div>
        ) : partner ? (
          <>
            <div className="partner-video">
              <video 
                ref={partnerVideoRef} 
                autoPlay 
                playsInline 
                className="video-element"
              />
              {partner.name && <div className="partner-name">{partner.name}</div>}
            </div>
            <div className="my-video">
              <video 
                ref={myVideoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`video-element ${!isCameraOn ? 'camera-off' : ''}`}
              />
              {!isCameraOn && <div className="camera-off-label">Camera Off</div>}
            </div>
          </>
        ) : null}
      </div>
      
      <div className="chat-container">
        <div className="messages">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.sender}`}
            >
              <div className="message-content">{message.text}</div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="message-input">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
      
      <div className="controls">
        <button onClick={findNewPartner} className="skip-button">
          Skip
        </button>
        <button onClick={toggleCamera} className="camera-button">
          {isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
        </button>
      </div>
    </div>
  );
};

export default VideoChat;