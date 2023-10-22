import React from "react";
import { useRef, useState, useEffect } from "react";
///////// NEW STUFF ADDED USE STATE

// import logo from './logo.svg';
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import "../App.css";
import { drawHand } from "./utilities";
import axios from "axios";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import sound1 from "../Files/sound1.mp3";
import sound2 from "../Files/sound2.mp3";
import sound3 from "../Files/sound3.mp3";

///////// NEW STUFF IMPORTS
import * as fp from "fingerpose";
import victory from "./Images/victory.png";
import thumbs_up from "./Images/thumbs_up.png";

function Video() {
  var AWS = require("aws-sdk");
  AWS.config.accessKeyId = ""; //HERE
  AWS.config.secretAccessKey = ""; //HERE
  AWS.config.region = "us-west-2";
  const [shouldProcessInput, setShouldProcessInput] = useState(true);

  const API_KEY = ""; //HERE
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [responseText, setResponseText] = useState("");
  const audioRef = useRef(null);
  const [thumbsUpTriggered, setThumbsUpTriggered] = useState(false);
  const thumbsUpLastTriggered = useRef(null);
  var counter = 0;

  useEffect(() => {
    if (!shouldProcessInput) {
      SpeechRecognition.abortListening();
      audioRef.current.pause();
    }
  }, [shouldProcessInput]);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  ///////// NEW STUFF ADDED STATE HOOK
  const [emoji, setEmoji] = useState(null);
  const images = { thumbs_up: thumbs_up, victory: victory };
  ///////// NEW STUFF ADDED STATE HOOK

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded.");
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const GPT = async () => {
    counter = counter + 1;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    };

    // Check if the user said "bye" and respond before stopping
    if (transcript.toLowerCase().includes("bye")) {
      const goodbyeMessage = "Goodbye!";
      setResponseText(goodbyeMessage);
      talk(goodbyeMessage);

      // Pause for a moment to let the "Goodbye!" message finish before stopping
      setTimeout(() => {
        // Set a state variable to indicate that the app should not process further input
        setShouldProcessInput(false);
      }, 2000); // Adjust the delay time as needed
      return;
    }

    if (!shouldProcessInput) {
      return;
    }

    const data = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Pretend you're a personal assistant. Limit your responses to 2 sentences MAX.",
        },
        { role: "user", content: transcript },
      ],
    };

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        data,
        { headers }
      );
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

  const voices = [
    { name: "AU Male", VoiceId: "Russell" },
    { name: "AU Female", VoiceId: "Nicole" },
    { name: "UK Male", VoiceId: "Brian" },
    { name: "UK Female", VoiceId: "Amy" },
    { name: "US Male", VoiceId: "Matthew" },
    { name: "US Female", VoiceId: "Joanna" },
  ];

  const [selectedVoice, setSelectedVoice] = useState("Joanna"); // Default voice

  const changeVoice = (newVoice) => {
    setSelectedVoice(newVoice);
  };

  <select
    value={selectedVoice}
    onChange={(e) => setSelectedVoice(e.target.value)}
  >
    {voices.map((voice) => (
      <option key={voice.voiceId} value={voice.voiceId}>
        {voice.name}
      </option>
    ))}
  </select>;

  const talk = (text) => {
    const polly = new AWS.Polly();
    const params = {
      OutputFormat: "mp3",
      Text: text,
      TextType: "text",
      VoiceId: selectedVoice, // Use the selected voice here
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
          audioRef.current.addEventListener("ended", () => {
            SpeechRecognition.startListening();
          });
        }
      }
    });
  };

  function HoverButton() {
    var audio = new Audio(sound1);

    audio.volume = 0.2;

    audio.play();
  }

  function reloadNeeded() {
    if (counter > 0) {
      setTimeout(() => {
        window.location.reload();
      }, 1800);
    }
  }

  /////////////////////

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const hand = await net.estimateHands(video);
      // console.log(hand);

      ///////// NEW STUFF ADDED GESTURE HANDLING

      if (hand.length > 0) {
        const GE = new fp.GestureEstimator([
          fp.Gestures.VictoryGesture,
          fp.Gestures.ThumbsUpGesture,
        ]);
        const gesture = await GE.estimate(hand[0].landmarks, 4);
        if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
          const confidence = gesture.gestures.map(
            (prediction) => prediction.confidence
          );
          const maxConfidence = confidence.indexOf(
            Math.max.apply(null, confidence)
          );
          setEmoji(gesture.gestures[maxConfidence].name);

          // Check if the detected gesture is "victory"
          if (gesture.gestures[maxConfidence].name === "victory") {
            VictoryFunction(); // Run the testingConsole function
          }
          if (gesture.gestures[maxConfidence].name === "thumbs_up") {
            ThumbsUpFunction(); // Run the testingConsole function
            
          }

          console.log("emoji");
        }
      }

      ///////// NEW STUFF ADDED GESTURE HANDLING

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawHand(hand, ctx);
    }
  };

  useEffect(() => {
    runHandpose();
  }, []);

  function VictoryFunction() {
    const goodbyeMessage = "Goodbye!";
      setResponseText(goodbyeMessage);
      talk(goodbyeMessage);

      // Pause for a moment to let the "Goodbye!" message finish before stopping
      setTimeout(() => {
        // Set a state variable to indicate that the app should not process further input
        setShouldProcessInput(false);
      }, 2000); // Adjust the delay time as needed
      return;
  }

  function ThumbsUpFunction() {
    const now = Date.now();
    const minimumInterval = 3000;  // 3 seconds, adjust as needed
    
    // If function was triggered recently, exit early.
    if (thumbsUpLastTriggered.current && now - thumbsUpLastTriggered.current < minimumInterval) {
      return;
    }
    
    // Update the timestamp for the current invocation.
    thumbsUpLastTriggered.current = now;
    
    setShouldProcessInput(true);  // <--- Add this line
    SpeechRecognition.startListening();
    HoverButton();
  }

  return (
    <div className="App">
      <header className="App-header">
        <div id="large-header">

        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
          />
          </div>

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
        {/* NEW STUFF */}
        {emoji !== null ? (
          <img
            src={images[emoji]}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 400,
              bottom: 500,
              right: 0,
              textAlign: "center",
              height: 100,
            }}
          />
        ) : (
          ""
        )}

        {/* NEW STUFF */}
        <div
          style={{
            backgroundImage: "url(/Files/space.jpg)",
            
            height: "100vh",
          }}
        >
          <h1 className="output" style={{display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "600px", color: "white"}}>{responseText}</h1>
        </div>

        <div>
          <div style={{}}>
            <div id="large-header" className="large-header">
              <canvas id="demo-canvas"></canvas>

              {/* <h1 className="main-title">Welcome to <span className="thin">Symbiote</span></h1> */}
              <div className="element">
                {listening}
                
                {/* <p>Content goes here: {responseText}</p> */}
                {/* <img src={Venom} alt="animation" width="450" height="500"></img> */}
                <audio ref={audioRef} controls />

                <h3 className="response">{responseText}</h3>
                <button
                  className="btn btn-three press"
                  onClick={() => {
                    SpeechRecognition.startListening();
                    HoverButton();
                    reloadNeeded();
                  }}
                >
                  Press to interact
                </button>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <select
                      value={selectedVoice}
                      onChange={(e) => {
                        setSelectedVoice(e.target.value);
                      }}
                      className="btn btn-three change-voice"
                      style={{
                        backgroundColor: "transparent", // Set the background color to transparent
                        color: "white", // Change the text color to white or any other color you prefer
                        transition: "background-color 0.3s ease", // Add a smooth transition for hover effect
                        cursor: "pointer",
                      }}
                    >
                      {voices.map((voice) => (
                        <option
                          key={voice.VoiceId}
                          value={voice.VoiceId}
                          style={{
                            backgroundColor: "black",
                          }}
                        >
                          {voice.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Video;
