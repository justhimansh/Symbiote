import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function Landing() {
  var AWS = require("aws-sdk");
  AWS.config.accessKeyId = 'AKIAU4MU2XJ4L5WHMC5Z';
  AWS.config.secretAccessKey = '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';
  AWS.config.region = 'us-west-2';

  const API_KEY = "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";

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const [responseText, setResponseText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false); // State to track if Polly is speaking
  const [isAISpeaking, setIsAISpeaking] = useState(false); // State to track if the AI is speaking
  const [shouldAISpeak, setShouldAISpeak] = useState(true); // State to track whether the AI should be speaking

  const audioRef = useRef(null); // Ref to store the audio element

  const talk = (text) => {
    if (shouldAISpeak) {
      const message = new SpeechSynthesisUtterance(text);
      message.onstart = () => {
        setIsAISpeaking(true); // Mark AI as speaking when the speech starts
        setShouldAISpeak(false); // Set to false to prevent AI from speaking until the user responds
      };
      message.onend = () => {
        setIsAISpeaking(false); // Mark AI as not speaking after the speech ends
        setShouldAISpeak(true); // Set to true to allow AI to speak again when needed
        if (listening) {
          SpeechRecognition.startListening(); // Start listening again if it was already active
        }
      };
      window.speechSynthesis.speak(message);
      setIsSpeaking(true); // Mark Polly as speaking
    }
  };

  const GPT = async () => {
    setIsAISpeaking(true); // Mark the AI as speaking while waiting for the response
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`
    };

    const data = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a virtual assistance similar to Jarvis from Iron Man. Greet me with a nice greeting under 5 words. Also limit your resposnes to 10 words max" },
        { role: "user", content: transcript }, // Use transcript as user content
      ]
    };

    try {
      const response = await axios.post("https://api.openai.com/v1/chat/completions", data, { headers });
      const generatedText = response.data.choices[0].message.content;
      setResponseText(generatedText); // Set the generated text from ChatGPT API response
      talk(generatedText); // Speak the generated text using Polly
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const startListeningWithDelay = () => {
    setIsSpeaking(true); // Mark Polly as speaking
    setIsAISpeaking(true); // Mark the AI as speaking
    SpeechRecognition.startListening();
  };

  useEffect(() => {
    let timer;
    if (listening && !isAISpeaking) {
      clearTimeout(timer); // Clear the previous timer
      // Set a new timer to delay the GPT API call for 1.5 seconds after the user stops speaking
      timer = setTimeout(() => {
        setIsAISpeaking(false); // Mark the AI as not speaking after the delay
        GPT(); // Call the GPT API
      }, 1500);
    }
    return () => clearTimeout(timer); // Clean up the timer when the component unmounts
  }, [listening, isAISpeaking]);

  const handleButtonClick = () => {
    startListeningWithDelay(); // Start listening for user input with a delay
  };

  useEffect(() => {
    if (listening) {
      GPT(); // Call the GPT API when the transcript (spoken content) changes
    }
  }, [transcript, listening]);

  return (
    <div>
      <h1>Welcome to Symbiote</h1>
      <button onClick={handleButtonClick}>Press</button>
      {listening && <p>Listening...</p>}
      <p>Content goes here: {responseText}</p>
    </div>
  );
}

export default Landing;