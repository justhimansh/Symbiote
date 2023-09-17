import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Chatbot from './Chatbot';


function Landing() {
  var AWS = require("aws-sdk");
  AWS.config.accessKeyId = 'AKIAU4MU2XJ4E2RYVHER' ;
  AWS.config.secretAccessKey = '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' ;
  AWS.config.region = 'us-west-2';

  const API_KEY = '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';

  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [responseText, setResponseText] = useState('');
  const audioRef = useRef(null);

  const GPT = async () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    };
    const data = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Pretend you're a personal assistant. Limit your responses to 2 sentences MAX." },
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

  useEffect(() => {
    let timer;
    if (listening) {
      clearTimeout(timer);
    } else {
      timer = setTimeout(() => {
        GPT();
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [listening]);

  const talk = (text) => {
    const polly = new AWS.Polly();
    const params = {
      OutputFormat: "mp3",
      Text: text,
      TextType: "text",
      VoiceId: "Joanna",
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
          audioRef.current.play().catch((error) => {
            console.warn("Playback was not triggered by a user action.", error);
          });
          audioRef.current.addEventListener('ended', () => {
            SpeechRecognition.startListening();
          });
        }
      }
    });
  };
  

  function SoundEffectButton() {
    const effects = [sound1, sound2, sound3, VenomVoice];
    const soundRef = useRef(null);

    const playRandomEffect = () => {
      if (!soundRef.current) return;
      const randomEffectIndex = Math.floor(Math.random() * effects.length);
      const chosenEffect = effects[randomEffectIndex];
      soundRef.current.src = chosenEffect;
      soundRef.current.load();
      soundRef.current.oncanplaythrough = () => {
        soundRef.current.play().catch((error) => {
          console.warn("Sound effect playback was not triggered by a user action.", error);
        });
      }
      soundRef.current.onerror = (e) => {
        console.error("Error playing audio:", e);
      }
    }

    return (
      <div>
        <button onClick={playRandomEffect}>Sounds</button>
        <audio ref={soundRef} />
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Welcome to Symbiote</h1>
  
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid black',
        width: '300px',
        height: '300px',
        margin: '0 auto',
        position: 'relative',
        backgroundImage: `url(${Venom})`,
        backgroundSize: '200%',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat'
      }}>
        <button
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px'
          }}
          onClick={() => SpeechRecognition.startListening()}
        >
          Press
        </button>
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px'
          }}
        >
          <SoundEffectButton />
        </div>
      </div>
  
      {listening && <p>Listening...</p>}
      <p>Content goes here: {responseText}</p>
      <audio ref={audioRef} controls />
    </div>
  );
  
}

export default Landing;
