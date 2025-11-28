import React, { useContext, useEffect, useRef, useState } from "react";
import { MusicContext } from "../Context";
import "./PlaybackControl.css";

const PlaybackControl = () => {
  const {
    tracks,
    currentTrackIndex,
    isPlaying,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    volume,
    setVolume,
    togglePlay,
    playNext,
    playPrev,
    playlists,
    setCurrentPlaylist,
  } = useContext(MusicContext);

  const audioRef = useRef(null);
  const backendBaseUrl = "http://localhost:5001";
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (tracks && tracks.length > 0) {
        const songUrl = tracks[currentTrackIndex].url;
        const srcUrl = songUrl.startsWith("http")
          ? songUrl
          : backendBaseUrl + songUrl;
        audioRef.current.src = srcUrl;
        if (isPlaying) {
          audioRef.current.play();
        }
      } else {
        audioRef.current.src = "";
      }
    }
  }, [currentTrackIndex, tracks]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const onTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const onLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeekChange = (e) => {
    const seekTime = Number(e.target.value);
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e) => {
    const vol = Number(e.target.value);
    setVolume(vol);
  };

  const handleNext = () => {
    playNext();
  };

  const handlePrev = () => {
    playPrev();
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ":" + secs.toString().padStart(2, "0");
  };

  const getVolumeIcon = () => {
    if (volume === 0) return "🔇";
    if (volume < 0.5) return "🔉";
    return "🔊";
  };

  const getCurrentTrack = () => {
    return tracks && tracks.length > 0 ? tracks[currentTrackIndex] : null;
  };

  const currentTrack = getCurrentTrack();
  const volumePercent = Math.round(volume * 100);

  const handleSelectPlaylist = (playlistName) => {
    setCurrentPlaylist(playlistName);
    setShowPlaylistMenu(false);
  };

  return (
    <div className="playback-control">
      <audio
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={handleNext}
      />
      <div className="track-info">
        <div className="track-title">
          {currentTrack ? currentTrack.songname : "No Track Selected"}
        </div>
        {currentTrack && (
          <>
            {currentTrack.artist && (
              <div className="track-artist">{currentTrack.artist}</div>
            )}
            {currentTrack.album && (
              <div className="track-album">{currentTrack.album}</div>
            )}
            {currentTrack.year && (
              <div className="track-year">{currentTrack.year}</div>
            )}
          </>
        )}
        <div className="time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
      <div className="controls">
        <button
          onClick={handlePrev}
          className="control-btn"
          aria-label="Previous"
        >
          ‹‹
        </button>
        <button
          onClick={togglePlay}
          className="control-btn"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "||" : "⏵"}
        </button>
        <button onClick={handleNext} className="control-btn" aria-label="Next">
          ››
        </button>
      </div>
      <input
        type="range"
        className="seek-bar"
        min="0"
        max={duration}
        value={currentTime}
        onChange={handleSeekChange}
        step="0.1"
        aria-label="Seek Bar"
      />
      <div className="volume-info">
        <span className="volume-icon">{getVolumeIcon()}</span>
        <input
          type="range"
          className="volume-slider"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          aria-label="Volume Control"
        />
        <span className="volume-percent">{volumePercent}%</span>
      </div>
      <div className="playlist-menu-container">
        <button
          className="playlist-menu-btn"
          onClick={() => setShowPlaylistMenu(!showPlaylistMenu)}
        >
          📋 Playlists ({playlists ? playlists.length : 0})
        </button>
        <div
          className={`playlist-dropdown ${
            showPlaylistMenu ? "show" : "hidden"
          }`}
        >
          {playlists && playlists.length > 0 ? (
            playlists.map((playlist) => (
              <div
                key={playlist}
                className="playlist-item-in-menu"
                onClick={() => handleSelectPlaylist(playlist)}
              >
                {playlist}
              </div>
            ))
          ) : (
            <div className="playlist-item-in-menu" style={{ color: "#6b6b6b" }}>
              No playlists
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaybackControl;
