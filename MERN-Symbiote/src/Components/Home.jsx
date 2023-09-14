import { Link } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function Landing() {
  var AWS = require("aws-sdk");
  AWS.config.accessKeyId = 'AKIAU4MU2XJ4KN5VI6RE';
  AWS.config.secretAccessKey = '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';
  AWS.config.region = 'us-west-2';

  const API_KEY = "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";

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const [responseText, setResponseText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);

  const audioRef = useRef(null);

  const GPT = async () => {
    setIsAISpeaking(true);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    };

    const data = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "" },
        { role: "user", content: transcript },
      ],
    };

    try {
      const response = await axios.post("https://api.openai.com/v1/chat/completions", data, { headers });
      const generatedText = response.data.choices[0].message.content;
      setResponseText(generatedText);
      talk(generatedText);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const startListeningWithDelay = () => {
    setIsSpeaking(true);
    setIsAISpeaking(true);
    SpeechRecognition.startListening();
  };

  useEffect(() => {
    let timer;
    if (listening && !isAISpeaking) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsAISpeaking(false);
        GPT();
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [listening, isAISpeaking]);

  const handleButtonClick = () => {
    startListeningWithDelay();
  };

  useEffect(() => {
    if (listening) {
      GPT();
    }
  }, [transcript, listening]);

  const talk = (text) => {
    const polly = new AWS.Polly({
      accessKeyId: 'AKIAU4MU2XJ4KN5VI6RE',
      secretAccessKey: 'Qf87Livoc+euweeyvOdyBnTb5n13inW81vQVBOx1',
      region: 'us-west-2', // Replace with your desired AWS region
    });

    const params = {
      OutputFormat: "mp3",
      Text: text,
      TextType: "text",
      VoiceId: "Joanna", // Choose a voice from Amazon Polly
    };

    polly.synthesizeSpeech(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        const uInt8Array = new Uint8Array(data.AudioStream);
        const arrayBuffer = uInt8Array.buffer;
        const blob = new Blob([arrayBuffer]);

        if (audioRef.current) {
          audioRef.current.src = URL.createObjectURL(blob);
          audioRef.current.play();
        }
      }
    });
  };

  return (
    <div>
      <h1>Welcome to Symbiote</h1>
      <button onClick={handleButtonClick}>Press</button>
      {listening && <p>Listening...</p>}
      <p>Content goes here: {responseText}</p>
      <audio ref={audioRef} controls />
    </div>
  );
}

export default Landing;