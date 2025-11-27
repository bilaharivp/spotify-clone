import React, { useState } from "react";
import "./Card.css";

function formatDuration(duration) {
  if (typeof duration === "number") {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
  return duration; // fallback if not number
}

const SongCard = ({ song, playSong, isPlaying, playlists, setPlaylists }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const isLiked =
    playlists["Liked Songs"] &&
    playlists["Liked Songs"].some((s) => s._id === song._id);

  const likeSong = () => {
    setPlaylists((prev) => {
      const updated = { ...prev };
      if (!updated["Liked Songs"]) {
        updated["Liked Songs"] = [];
      }
      if (isLiked) {
        updated["Liked Songs"] = updated["Liked Songs"].filter(
          (s) => s._id !== song._id
        );
      } else {
        updated["Liked Songs"].push(song);
      }
      return updated;
    });
  };

  const addToPlaylist = (playlistName) => {
    setPlaylists((prev) => {
      const updated = { ...prev };
      if (!updated[playlistName]) {
        updated[playlistName] = [];
      }
      if (!updated[playlistName].some((s) => s._id === song._id)) {
        updated[playlistName].push(song);
      }
      return updated;
    });
    setShowDropdown(false);
  };

  const createNewPlaylist = () => {
    if (newPlaylistName.trim()) {
      addToPlaylist(newPlaylistName.trim());
      setNewPlaylistName("");
    }
  };

  return (
    <div
      className="card song-card"
      style={{
        width: "14rem",
        height: "24rem",
        margin: "15px",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)" /* for Safari */,
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
      }}
      title={song.songname + " by " + song.singer}
      onClick={() => playSong && playSong(song)}
    >
      <img
        src={
          "http://localhost:5001" +
          (song.image && song.image.startsWith("/images/")
            ? song.image
            : "/images/" + song.image)
        }
        className="card-img-top"
        alt={song.songname + " album art"}
        style={{
          borderRadius: "12px 12px 0 0",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        }}
      />
      <div className="card-body">
        <h5 className="card-title song-title" title={song.songname}>
          {song.songname}
        </h5>
        <p
          className="card-text"
          title={song.singer}
          style={{
            color: "#ccc" /* lighter text for visibility on glass background */,
          }}
        >
          {song.singer}
        </p>

        {/* Additional Song Details */}
        {(song.album || song.genre || song.duration || song.releaseYear) && (
          <div
            className="song-details"
            style={{
              color:
                "#ccc" /* lighter text for visibility on glass background */,
            }}
          >
            {song.album && (
              <p className="song-detail" title={song.album}>
                <strong>Album:</strong> {song.album}
              </p>
            )}
            {song.genre && (
              <p className="song-detail" title={song.genre}>
                <strong>Genre:</strong> {song.genre}
              </p>
            )}
            {song.duration && (
              <p className="song-detail" title={song.duration}>
                <strong>Duration:</strong> {formatDuration(song.duration)}
              </p>
            )}
            {song.releaseYear && (
              <p className="song-detail" title={song.releaseYear}>
                <strong>Release:</strong> {song.releaseYear}
              </p>
            )}
          </div>
        )}

        <div className="d-flex flex-column">
          <div className="d-flex justify-content-between mb-2">
            {playSong && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  isPlaying && isPlaying(song)
                    ? playSong(null)
                    : playSong(song);
                }}
                className="btn me-1"
                aria-label={isPlaying && isPlaying(song) ? "Pause" : "Play"}
                style={{
                  background: "linear-gradient(135deg, #1db954, #1ed760)",
                  color: "#fff",
                  border: "none",
                  fontSize: "0.8rem",
                  flex: 1,
                  borderRadius: "8px",
                  boxShadow: "0 4px 15px rgba(29, 185, 84, 0.3)",
                  transition: "all 0.3s ease",
                  fontWeight: "bold",
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 6px 20px rgba(29, 185, 84, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 4px 15px rgba(29, 185, 84, 0.3)";
                }}
              >
                {isPlaying && isPlaying(song) ? "Pause" : "Play"}
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                likeSong();
              }}
              className="btn"
              aria-label={isLiked ? "Unlike" : "Like"}
              style={{
                background: isLiked
                  ? "rgba(255, 107, 107, 0.2)"
                  : "rgba(102, 126, 234, 0.2)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                fontSize: "1.2rem",
                flex: 0.5,
                borderRadius: "8px",
                boxShadow: isLiked
                  ? "0 4px 15px rgba(255, 107, 107, 0.3)"
                  : "0 4px 15px rgba(102, 126, 234, 0.3)",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px) scale(1.05)";
                e.target.style.boxShadow = isLiked
                  ? "0 6px 20px rgba(255, 107, 107, 0.4)"
                  : "0 6px 20px rgba(102, 126, 234, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0) scale(1)";
                e.target.style.boxShadow = isLiked
                  ? "0 4px 15px rgba(255, 107, 107, 0.3)"
                  : "0 4px 15px rgba(102, 126, 234, 0.3)";
              }}
            >
              {isLiked ? "❤️" : "🤍"}
            </button>
          </div>

          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle w-100"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              style={{
                backgroundColor: "rgba(0, 123, 255, 0.3)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 4px 15px rgba(0, 123, 255, 0.4)",
                transition: "all 0.3s ease",
                fontWeight: "bold",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                fontSize: "0.8rem",
              }}
            >
              Add to Playlist
            </button>
            {showDropdown && (
              <ul className="dropdown-menu show" style={{ display: "block" }}>
                {Object.keys(playlists).map((playlistName) => (
                  <li key={playlistName}>
                    <button
                      className="dropdown-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToPlaylist(playlistName);
                      }}
                    >
                      {playlistName}
                    </button>
                  </li>
                ))}
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <div className="px-3 py-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="New playlist name"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button
                      className="btn btn-primary mt-2 w-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        createNewPlaylist();
                      }}
                    >
                      Create
                    </button>
                  </div>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
