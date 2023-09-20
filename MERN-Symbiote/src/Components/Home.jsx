import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import sound1 from "../Files/sound1.mp3";
import sound2 from "../Files/sound2.mp3";
import sound3 from "../Files/sound3.mp3";
//import V_paper from '../Files/V_paper.jpg';
import Venom from "../Files/symbiote_goo.gif";
import VenomVoice from "../Files/VenomVoice.mp3";
import { TweenLite, Circ } from "gsap";
import Weather from "./Weather";

function Landing() {
  var AWS = require("aws-sdk");
  AWS.config.accessKeyId = "amazon public key"; //HERE
  AWS.config.secretAccessKey = "amazon public key"; //HERE
  AWS.config.region = "us-west-2";
  const [shouldProcessInput, setShouldProcessInput] = useState(true);

  const API_KEY = "openai keys"; //HERE

  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [responseText, setResponseText] = useState("");
  const audioRef = useRef(null);
  const [temperature, setTemperature] = useState("");
  const [rain, setRain] = useState("");
  const [visibility, setVisibility] = useState("");
  var counter = 0;

  useEffect(() => {
    if (!shouldProcessInput) {
      SpeechRecognition.abortListening();
      audioRef.current.pause();
    }
  }, [shouldProcessInput]);

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

    if (transcript.toLowerCase().includes("stop")) {
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

    if (transcript.toLowerCase().includes("goodbye")) {
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
    
    
    if (transcript.toLowerCase().includes("news")) {
      window.open("https://www.nzherald.co.nz", "_blank");
      return;
    }

    if (transcript.toLowerCase().includes("email")) {
      window.open("https://mail.google.com/mail/", "_blank");
      return;
    }

    if (transcript.toLowerCase().includes("instagram")) {
      window.open("https://www.instagram.com", "_blank");
      return;
    }
  
    // Check if the app should continue processing input
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
          console.warn(
            "Sound effect playback was not triggered by a user action.",
            error
          );
        });
      };
      soundRef.current.onerror = (e) => {
        console.error("Error playing audio:", e);
      };
    };

    useEffect(() => {
      var width,
        height,
        largeHeader,
        canvas,
        ctx,
        points,
        target,
        animateHeader = true;

      function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = { x: width / 2, y: height / 2 };

        largeHeader = document.getElementById("large-header");
        largeHeader.style.height = height + "px";

        canvas = document.getElementById("demo-canvas");
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d");

        points = [];
        for (var x = 0; x < width; x = x + width / 20) {
          for (var y = 0; y < height; y = y + height / 20) {
            var px = x + (Math.random() * width) / 20;
            var py = y + (Math.random() * height) / 20;
            var p = { x: px, originX: px, y: py, originY: py };
            points.push(p);
          }
        }

        for (var i = 0; i < points.length; i++) {
          var closest = [];
          var p1 = points[i];
          for (var j = 0; j < points.length; j++) {
            var p2 = points[j];
            if (!(p1 == p2)) {
              var placed = false;
              for (var k = 0; k < 5; k++) {
                if (!placed) {
                  if (closest[k] == undefined) {
                    closest[k] = p2;
                    placed = true;
                  }
                }
              }

              for (var k = 0; k < 5; k++) {
                if (!placed) {
                  if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                    closest[k] = p2;
                    placed = true;
                  }
                }
              }
            }
          }
          p1.closest = closest;
        }

        for (var i in points) {
          var c = new Circle(
            points[i],
            2 + Math.random() * 3,
            "rgba(255,255,255,0.3)"
          );
          points[i].circle = c;
        }
      }

      function addListeners() {
        if (!("ontouchstart" in window)) {
          window.addEventListener("mousemove", mouseMove);
        }
        window.addEventListener("scroll", scrollCheck);
        window.addEventListener("resize", resize);
      }

      function mouseMove(e) {
        let posx = 0,
          posy = 0;
        if (e.pageX || e.pageY) {
          posx = e.pageX;
          posy = e.pageY;
        } else if (e.clientX || e.clientY) {
          posx =
            e.clientX +
            document.body.scrollLeft +
            document.documentElement.scrollLeft;
          posy =
            e.clientY +
            document.body.scrollTop +
            document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
      }

      function scrollCheck() {
        if (document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
      }

      function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        largeHeader.style.height = "400px";
        canvas.width = width;
        canvas.height = height;
      }

      function initAnimation() {
        animate();
        for (var i in points) {
          shiftPoint(points[i]);
        }
      }

      function animate() {
        if (animateHeader) {
          ctx.clearRect(0, 0, width, height);
          for (var i in points) {
            if (Math.abs(getDistance(target, points[i])) < 5000) {
              points[i].active = 0.3;
              points[i].circle.active = 0.6;
            } else if (Math.abs(getDistance(target, points[i])) < 30000) {
              points[i].active = 0.1;
              points[i].circle.active = 0.3;
            } else if (Math.abs(getDistance(target, points[i])) < 60000) {
              points[i].active = 0.02;
              points[i].circle.active = 0.1;
            } else {
              points[i].active = 0;
              points[i].circle.active = 0;
            }

            drawLines(points[i]);
            points[i].circle.draw();
          }
        }
        requestAnimationFrame(animate);
      }

      function shiftPoint(p) {
        TweenLite.to(p, 1 + 1 * Math.random(), {
          x: p.originX - 50 + Math.random() * 100,
          y: p.originY - 50 + Math.random() * 100,
          ease: Circ.easeInOut,
          onComplete: function () {
            shiftPoint(p);
          },
        });
      }

      function drawLines(p) {
        if (!p.active) return;
        for (var i in p.closest) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.closest[i].x, p.closest[i].y);
          ctx.strokeStyle = "rgba(156,217,249," + p.active + ")";
          ctx.stroke();
        }
      }

      function Circle(pos, rad, color) {
        var _this = this;

        (function () {
          _this.pos = pos || null;
          _this.radius = rad || null;
          _this.color = color || null;
        })();

        this.draw = function () {
          if (!_this.active) return;
          ctx.beginPath();
          ctx.arc(
            _this.pos.x,
            _this.pos.y,
            _this.radius,
            0,
            4 * Math.PI,
            false
          );
          //web colors
          ctx.fillStyle = "rgba(156,217,249," + _this.active + ")";
          ctx.fill();
        };
      }

      function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
      }

      // Define the API URL
      const apiUrl =
        "https://api.open-meteo.com/v1/forecast?latitude=-36.8485&longitude=174.7635&hourly=temperature_2m,rain,visibility";

      // Initialize variables to store the values
      var temperature = "";
      var rain = "";
      var visibility = "";

      // Fetch data from the API
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          // Check if the data contains the required fields
          if (data.hourly) {
            // Get the latest values for temperature, rain, and visibility
            const latestTemperature =
              data.hourly.temperature_2m[data.hourly.temperature_2m.length - 1];
            const latestRain = data.hourly.rain[data.hourly.rain.length - 1];
            const latestVisibility =
              data.hourly.visibility[data.hourly.visibility.length - 1];

            setTemperature(latestTemperature);
            setRain(latestRain);
            setVisibility(latestVisibility);

            // Now you can use the temperature, rain, and visibility variables as needed
            console.log("Temperature:", temperature);
            console.log("Rain:", rain);
            console.log("Visibility:", visibility);
          } else {
            console.error("Data format is not as expected.");
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });

      // Initialization
      initHeader();
      initAnimation();
      addListeners();
    }, []);

    return (
      <div>
        <button onClick={playRandomEffect}>Sounds</button>
        <audio ref={soundRef} />
      </div>
    );
  }

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

  return (
    <div style={{}}>
      <div id="large-header" className="large-header">
        <canvas id="demo-canvas"></canvas>
        <div className="element">
          <div className="wrapper">
            <div className="widget-info">
              <h3 className=""> Weather </h3>
              <h4 className="info">Temperature: {temperature}°C</h4>
              <h4 className="info">Rain: {rain}mm</h4>
              <h4 className="info">Visiability: {visibility}m</h4>
            </div>
          </div>
        </div>

        {/* <h1 className="main-title">Welcome to <span className="thin">Symbiote</span></h1> */}
        <div className="element">
          {listening}
          <h1 className="title ">
            Welcome to <span className="thin ">Symbiote™</span>
          </h1>
          {/* <p>Content goes here: {responseText}</p> */}
          {/* <img src={Venom} alt="animation" width="450" height="500"></img> */}
          <audio ref={audioRef} controls />
          <div style={{ display: "none" }}>
            <SoundEffectButton />
          </div>

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
  );
}

export default Landing;
