import React, { useContext, useState, useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContext, AuthProvider, MusicContext } from "./Context";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Home from "./components/Home";
import PlaybackControl from "./components/PlaybackControl";
import "./App.css"; // Import the CSS file

function App() {
  useContext(AuthContext);
  const { isPlaying, volume } = useContext(MusicContext);
  const [beatColor, setBeatColor] = useState("#1a1a2e");
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationIdRef = useRef(null);

  const colors = [
    "#1a1a2e", // dark navy
    "#16213e", // dark blue
    "#0f3460", // deep blue
    "#533483", // dark purple
    "#6b2d9e", // purple
    "#2d5a6e", // teal-blue
    "#4a1a5c", // deep purple
  ];

  useEffect(() => {
    if (!isPlaying || volume === 0) {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      return;
    }

    try {
      const audioElement = document.querySelector("audio");
      if (!audioElement) return;

      if (!audioContextRef.current) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        try {
          const source = ctx.createMediaElementAudioSource(audioElement);
          source.connect(analyser);
          analyser.connect(ctx.destination);
        } catch (e) {
          return;
        }
        audioContextRef.current = ctx;
        analyserRef.current = analyser;
        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
      }

      const updateColor = () => {
        if (analyserRef.current && dataArrayRef.current) {
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          const bassAvg = dataArrayRef.current.slice(0, 8).reduce((a, b) => a + b, 0) / 8;
          const midAvg = dataArrayRef.current.slice(8, 32).reduce((a, b) => a + b, 0) / 24;
          const trebleAvg = dataArrayRef.current.slice(32, 64).reduce((a, b) => a + b, 0) / 32;

          let colorIndex = 0;
          if (bassAvg > 100) colorIndex = 4;
          else if (midAvg > 80) colorIndex = 5;
          else if (trebleAvg > 60) colorIndex = 6;
          else colorIndex = Math.floor((bassAvg + midAvg + trebleAvg) / 180 * colors.length) % colors.length;

          setBeatColor(colors[colorIndex]);
        }
        animationIdRef.current = requestAnimationFrame(updateColor);
      };

      updateColor();
    } catch (error) {
      console.log("Audio visualization unavailable");
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isPlaying, volume, colors]);

  return (
    <div
      className="app-container"
      style={{
        position: "relative",
        paddingBottom: "80px",
        backgroundColor: beatColor,
        transition: "background-color 0.1s ease",
      }}
    >
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <PlaybackControl />
    </div>
  );
}

const AppWithAuth = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithAuth;

