import React, { useContext } from "react";
import { MusicContext } from "../Context";
import "./NowPlaying.css";

const NowPlaying = () => {
  const { tracks, currentTrackIndex, isPlaying, currentTime, duration } = useContext(MusicContext);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const currentTrack = tracks[currentTrackIndex];

  if (!currentTrack) {
    return (
      <div className="now-playing-panel">
        <div className="no-song">
          <p>No song selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="now-playing-panel">
      <div className="song-details">
        <img
          src={`http://localhost:5001${currentTrack.image}`}
          alt={currentTrack.songname}
          className="album-cover"
        />
        <div className="song-info">
          <h3 className="song-title">{currentTrack.songname}</h3>
          <p className="artist">{currentTrack.singer}</p>
          {currentTrack.album && <p className="album">{currentTrack.album}</p>}
          {currentTrack.genre && <p className="genre">{currentTrack.genre}</p>}
          {currentTrack.releaseYear && <p className="year">{currentTrack.releaseYear}</p>}
        </div>
      </div>
      <div className="playback-info">
        <div className="status">
          <span className={`status-indicator ${isPlaying ? "playing" : "paused"}`}>
            {isPlaying ? "Playing" : "Paused"}
          </span>
        </div>
        <div className="time-display">
          <span className="current-time">{formatTime(currentTime)}</span>
          <span className="duration"> / {formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;