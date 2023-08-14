  import React, { useEffect, useState, useRef } from 'react';
  import axios from 'axios';
  import AWS from 'aws-sdk';
  import { Link } from 'react-router-dom';
  import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

  function Landing() {
    var AWS = require("aws-sdk");
    AWS.config.accessKeyId = '';
    AWS.config.secretAccessKey = '';

    //testing working

    const API_KEY = "";
    const { transcript, listening, resetTranscript } = useSpeechRecognition();

    const [responseText, setResponseText] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false); // State to track if Polly is speaking
    const [isAISpeaking, setIsAISpeaking] = useState(false); // State to track if the AI is speaking
    const [shouldAISpeak, setShouldAISpeak] = useState(true); // State to track whether the AI should be speaking

    const audioRef = useRef(null); // Ref to store the audio element

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

    const playPollyResponse = (text) => {
      var polly = new AWS.Polly();
      var params = {
        OutputFormat: 'mp3',
        Text: text,
        TextType: 'text',
        VoiceId: 'Joanna',
      };
      polly.synthesizeSpeech(params, function (err, data) {
        if (err) {
          console.log(err, err.stack);
        } else {
          var uInt8Array = new Uint8Array(data.AudioStream);
          var arrayBuffer = uInt8Array.buffer;
          var blob = new Blob([arrayBuffer]);
          audioRef.current.src = URL.createObjectURL(blob); // Set audio source
          audioRef.current.play(); // Play the audio
        }
      });
    };
    

    const talk = (text) => {
      if (shouldAISpeak) {
        playPollyResponse(text); // Play the Polly response
        const message = new SpeechSynthesisUtterance(text);
        message.onstart = () => {
          setIsAISpeaking(true);
          setShouldAISpeak(false);
        };
        message.onend = () => {
          setIsAISpeaking(false);
          setShouldAISpeak(true);
          if (listening) {
            SpeechRecognition.startListening();
          }
        };
        window.speechSynthesis.speak(message);
        setIsSpeaking(true);
      }
    };
    

    const startListeningWithDelay = () => {
      setIsSpeaking(true); // Mark Polly as speaking
      setIsAISpeaking(true); // Mark the AI as speaking
      SpeechRecognition.startListening();
    };

    useEffect(() => {
      if (listening) {
        GPT();
      }
    }, [transcript, listening]);

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
        <audio ref={audioRef} />
      </div>
    );
  }

  export default Landing;

  // const testing = () => {
  //     console.log("testing polly")
  //     var polly = new AWS.Polly();

  //     var params = { 
  //       OutputFormat: "mp3",
  //       Text: "Hello Himansh, How are you today?",
  //       TextType: "text",
  //       VoiceId: "Joanna"
  //     };

  //     polly.synthesizeSpeech(params, function(err, data) {
  //       if (err) {
  //         console.log(err, err.stack);
  //       } else {
  //         var uInt8Array = new Uint8Array(data.AudioStream);
  //         var arrayBuffer = uInt8Array.buffer;
  //         var blob = new Blob([arrayBuffer]);

  //         var audio = new Audio();
  //         var url = URL.createObjectURL(blob);
  //         audio.src = url;
  //         audio.play();
  //       }
  //     });
  //   }