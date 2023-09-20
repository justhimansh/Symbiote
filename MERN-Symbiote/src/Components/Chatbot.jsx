import React, { useState } from "react";
import axios from "axios";

const API_KEY = "Replace with your actual OpenAI API key"; // Replace with your actual OpenAI API key

function Chatbot() {
  const [userInput, setUserInput] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const addUserMessage = (message) => {
    setConversation([...conversation, { role: "user", content: message }]);
  };

  const addBotMessage = (message) => {
    setConversation([...conversation, { role: "bot", content: message }]);
  };

  const generateLetter = async (inputText) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    };

    const data = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an AI personal assistant.",
        },
        {
          role: "user",
          content: inputText,
        },
      ],
    };

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        data,
        { headers }
      );
      const generatedText = response.data.choices[0].message.content;
      setGeneratedText(generatedText);
      return generatedText;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const response = await generateLetter(userInput);
      addUserMessage(userInput); // Add the user's input to the conversation
      addBotMessage(response); // Add the generated message to the conversation
      setUserInput(""); // Clear the message input box
    } catch (error) {
      console.error("Error generating letter:", error);
    }
    setIsLoading(false);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default Enter behavior (e.g., form submission)
      handleClick(); // Trigger the button click event
    }
  };

  return (
    <div className="about-background">
      <div className="chatbot-wrapper">
        <div>
          <p className="generated-text">{generatedText}</p>
        </div>
        
        {conversation.map((message, index) => (
          <p key={index} className={message.role}>
            {message.content}
          </p>
        ))}
        
        <label className="label">Hi I am Symbiote. How can I help? : </label>
        <div >
          <input
            className="inputstuff"
            type="text"
            value={userInput}
            onChange={handleUserInputChange}
            onKeyDown={handleInputKeyDown} // Add key event listener to input
          />
          <div className="button">
            <button onClick={handleClick}>Generate</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
