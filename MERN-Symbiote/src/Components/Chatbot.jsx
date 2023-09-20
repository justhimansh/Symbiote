import React from 'react';

function Chatbot() {
  const chatApiKey = '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  '; //  OpenAI API key
  const openaiInstance = new openai({ key: chatApiKey });

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      setMessages([...messages, { text: inputMessage, type: 'user' }]);
      setInputMessage('');

      openaiInstance
        .davinci
        .create({
          prompt: inputMessage,
          max_tokens: 50, // Adjust the token limit as needed
        })
        .then((response) => {
          const botMessage = response.choices[0].text;
          setMessages([...messages, { text: botMessage, type: 'bot' }]);
        })
        .catch((error) => {
          console.error('Error fetching response from GPT:', error);
        });
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3 style={{ color: 'white' }}>Chatbot</h3>
      </div>
      <div className="chatbot-body">
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.type}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          id="chat-input"
          className="chat-input"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={handleInputChange}
        />
        <button
          id="send-button"
          className="send-button"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
