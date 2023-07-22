import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function Landing() {
  var AWS = require("aws-sdk");
  AWS.config.accessKeyId = '';
  AWS.config.secretAccessKey = '';

  const API_KEY = "";
  AWS.config.region = 'us-west-2';

  const [HELLO, setHELLO] = useState('');

  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  const talk = () => {
    console.log("hello");
    const message = new SpeechSynthesisUtterance("Good morning, Himansh");
    window.speechSynthesis.speak(message);
    testing();
  }


  const testing = () => {
    console.log("testing polly")
    var polly = new AWS.Polly();

    var params = { 
      OutputFormat: "mp3",
      Text: "Hello Himansh, How are you today?",
      TextType: "text",
      VoiceId: "Joanna"
    };

    polly.synthesizeSpeech(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        var uInt8Array = new Uint8Array(data.AudioStream);
        var arrayBuffer = uInt8Array.buffer;
        var blob = new Blob([arrayBuffer]);

        var audio = new Audio();
        var url = URL.createObjectURL(blob);
        audio.src = url;
        audio.play();
      }
    });
  }

  const handleButtonClick = () => {
    talk();
    SpeechRecognition.startListening();
  };

  useEffect(() => {
    if (listening) {
      setHELLO(transcript);
    }
  }, [transcript, listening]);

  return (
    <div>
      <h1>Welcome to Symbiote</h1>
      <button onClick={handleButtonClick}>Press</button>
      {listening && <p>Listening...</p>}
      <p>{HELLO}</p>
    </div>
  );
}

export default Landing;
