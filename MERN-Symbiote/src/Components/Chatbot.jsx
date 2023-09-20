import React, { useState } from "react";
import axios from "axios";

const API_KEY = "openai keys"; // Replace with your actual OpenAI API key

function Chatbot() {
  const [userInput, setUserInput] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUserInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleClick = async () => {
    setIsLoading(true);
    await generateLetter(userInput);
    setIsLoading(false);
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
      <label className="label">Enter Prompt: </label>
      <input
        className="inputstuff"
        type="text"
        value={userInput}
        onChange={handleUserInputChange}
        />
      <button onClick={handleClick}>Generate</button>

      <div>
        {isLoading ? (
          <h1>Loading...</h1>
          ) : (
            <h1 className="generated-text">
            {generatedText}
          </h1>
        )}
      </div>
    </div>
        </div>
  );
}

export default Chatbot;
