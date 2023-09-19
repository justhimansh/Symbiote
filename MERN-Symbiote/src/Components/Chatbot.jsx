import React from 'react';
import './Chatbot.css';

function Chatbot() {
  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3 style={{ color: 'white'}}>Chatbot</h3>
      </div>
      <div className="chatbot-body">
        {/* Chat messages will be displayed here */}
      </div>
      <div className="chat-input-container">
        <input type="text" id="chat-input" className="chat-input" placeholder="Type your message..." />
        <button id="send-button" className="send-button">Send</button>
      </div>
    </div>
  );
}

export default Chatbot;
