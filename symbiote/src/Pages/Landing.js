import React from 'react';
import { Link } from 'react-router-dom';

function Landing() {
  var AWS = require("aws-sdk");
  AWS.config.accessKeyId = 'ACCESS';
  AWS.config.secretAccessKey = 'SECRET';
  AWS.config.region = 'us-west-2';

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

        var audio = new Audio(); // Create an audio element
        var url = URL.createObjectURL(blob);
        audio.src = url; // Set the 'src' attribute to the audio URL
        audio.play();
      }
    });
  }

  const talk = () => {
    console.log("hello");
    const message = new SpeechSynthesisUtterance("Good morning, Himansh");
    window.speechSynthesis.speak(message);
    testing();
  }

  return (
    <div>
      <h1>Welcome to Symbiote</h1>
      <button onClick={talk}>Press</button>
    </div>
  );
}

export default Landing;
