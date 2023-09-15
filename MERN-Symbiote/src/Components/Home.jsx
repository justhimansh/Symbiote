import { Link } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import sound1 from '../SoundEffects/sound1.mp3';
import sound2 from '../SoundEffects/sound2.mp3';
import sound3 from '../SoundEffects/sound3.mp3';

function Landing() {
  var AWS = require("aws-sdk");
 
  AWS.config.accessKeyId = 'AKIAU4MU2XJ4GYTB5P3W';
  AWS.config.secretAccessKey = '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';
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
          audioRef.current.addEventListener('ended', () => {
            SpeechRecognition.startListening();
          });
        }
      }
    });
  };

  function SoundEffectButton() {
    const effects = [sound1, sound2, sound3];
    const soundRef = useRef(null);

    const playRandomEffect = async () => {
      if (!soundRef.current) return;
      const randomEffectIndex = Math.floor(Math.random() * effects.length);
      const chosenEffect = effects[randomEffectIndex];
      soundRef.current.src = chosenEffect;

      soundRef.current.load();

      soundRef.current.oncanplaythrough = () => {
        soundRef.current.play();
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
    )
  }

  return (
    <div>
      <h1>Welcome to Symbiote</h1>
      <button onClick={() => SpeechRecognition.startListening()}>Press</button>
      {listening && <p>Listening...</p>}
      <p>Content goes here: {responseText}</p>
      <audio ref={audioRef} controls />
      <SoundEffectButton />
    </div>
  );
}

export default Landing;
