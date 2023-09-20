import React, { useState } from "react";
import axios from "axios";

const API_KEY = "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 "; // Replace with your actual OpenAI API key

function Chatbot() {
  const [userInput, setUserInput] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleClick = async () => {
    setIsLoading(true);
    let response; // Declare the 'response' variable
    try {
      response = await generateLetter(userInput);
      addUserMessage(userInput); // Add the user's input to the conversation
      addBotMessage(response); // Add the generated message to the conversation
      setUserInput(""); // Clear the message input box
    } catch (error) {
      console.error("Error generating letter:", error);
    }
    setIsLoading(false);
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
    } catch (error) {
      console.error("Error:", error);
    }

    
    
  };

  return (
      <div className="about-background">
        <div className="chatbot-wrapper">
          <div>
            <p className="generated-text">{generatedText}</p>
          </div>
          
          <label className="label">Hi how can i help? : </label>
          
            <input
              className="inputstuff"
              type="text"
              value={userInput}
              onChange={handleUserInputChange}
            />
            <div className="button">
            <button onClick={handleClick}>Generate</button>
          </div>
        </div>
      </div>
    );
    
}

export default Chatbot;
