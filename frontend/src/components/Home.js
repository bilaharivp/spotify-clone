import { useContext, useEffect, useState, useRef } from "react";
import SongCard from "./SongCard";
import NowPlaying from "./NowPlaying";
import PlaybackControl from "./PlaybackControl";
import { initializePlaylist } from "../initialize";
import Navbar from "./Navbar";
import { MusicContext } from "../Context";
import "./Home.css";
import "./NowPlaying.css";

function Home() {
  const [keyword, setKeyword] = useState("");
  const [message, setMessage] = useState("");
  const [filteredTracks, setFilteredTracks] = useState([]); // State to hold filtered tracks
  const [hasSearched, setHasSearched] = useState(false);

  const {
    isLoading,
    setIsLoading,
    setLikedMusic,
    setPinnedMusic,
    resultOffset,
    setResultOffset,

    tracks,
    setTracks,
    currentTrackIndex,
    setCurrentTrackIndex,
    isPlaying,
    setIsPlaying,
    playlists,
    setPlaylists,
  } = useContext(MusicContext);

  const resultOffsetRef = useRef(resultOffset);
  resultOffsetRef.current = resultOffset;

  const fetchMusicData = async (offset = 0) => {
    setMessage("");
    window.scrollTo(0, 0);
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:5001/songs`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch music data: ${response.statusText}`);
      }

      const jsonData = await response.json();
      console.log("Fetched songs:", jsonData);

      if (jsonData.length === 0) {
        setMessage("No songs found.");
        setTracks([]);
        setFilteredTracks([]);
      } else {
        setTracks(jsonData);
        setFilteredTracks(jsonData.slice(offset, offset + 10));
      }
    } catch (error) {
      setMessage("We couldn’t retrieve the music data. Please try again.");
      console.error("Error fetching music data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter tracks based on the keyword
  useEffect(() => {
    if (keyword.trim() === "") {
      setFilteredTracks(tracks);
    } else {
      setFilteredTracks(
        tracks.filter((track) =>
          track.songname.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }
  }, [keyword, tracks]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setResultOffset(0);
      fetchMusicData(0);
    }
  };

  const handleSearchClick = () => {
    if (!keyword.trim()) {
      setMessage("Please enter a search term");
      return;
    }
    setResultOffset(0);
    fetchMusicData(0);
  };

  useEffect(() => {
    initializePlaylist();
    fetchMusicData();
    setLikedMusic(JSON.parse(localStorage.getItem("likedMusic")) || []);
    setPinnedMusic(JSON.parse(localStorage.getItem("pinnedMusic")) || []);
  }, [setLikedMusic, setPinnedMusic]);

  useEffect(() => {
    if (!hasSearched) {
      fetchMusicData();
      setHasSearched(true);
    }
  }, [hasSearched]);

  const playSong = (song) => {
    if (!song) {
      setIsPlaying(false);
      return;
    }
    const index = tracks.findIndex(
      (track) => track._id === song._id || track.songname === song.songname
    );
    if (index !== -1) {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    }
  };

  const isSongPlaying = (song) => {
    if (!isPlaying) return false;
    const index = tracks.findIndex(
      (track) => track._id === song._id || track.songname === song.songname
    );
    return index === currentTrackIndex;
  };

  return (
    <>
      <Navbar
        keyword={keyword}
        setKeyword={setKeyword}
        handleKeyPress={handleKeyPress}
        fetchMusicData={handleSearchClick}
      />
      <div className="container-fluid">
        <div className="row mt-4" style={{ paddingRight: "320px" }}>
          {/* Playlist Sidebar */}
          <div
            className="col-md-2 border-end"
            style={{
              maxHeight: "80vh",
              overflowY: "auto",
              padding: "10px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>
              {`
                .col-md-2::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            <h5 style={{ color: "#fff", fontSize: "14px" }}>Playlists</h5>
            {Object.keys(playlists).length === 0 ? (
              <p style={{ fontSize: "12px" }}>No playlists available</p>
            ) : (
              <div>
                {Object.entries(playlists)
                  .sort(([a], [b]) => {
                    if (a === "Liked Songs") return -1;
                    if (b === "Liked Songs") return 1;
                    return 0;
                  })
                  .map(([playlistName, songs]) => (
                  <div
                    key={playlistName}
                    className="playlist-item mb-2"
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                      cursor: "pointer",
                      color: "#fff",
                      transition:
                        "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
                      fontSize: "12px",
                    }}
                    onClick={() => {
                      if (songs.length > 0) {
                        setTracks(songs);
                        setCurrentTrackIndex(0);
                        setIsPlaying(true);
                      }
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{playlistName}</strong>
                      </div>
                      <span
                        style={{
                          backgroundColor: "#007bff",
                          color: "#fff",
                          borderRadius: "12px",
                          padding: "2px 6px",
                          fontSize: "0.8em",
                        }}
                      >
                        {songs.length}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div
            className="col-md-10"
            style={{
              maxHeight: "80vh",
              overflowY: "auto",
              paddingRight: "320px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>
              {`
                .col-md-10::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            <div className={`row ${isLoading ? "" : "d-none"}`}>
              <div className="col-12 py-5 text-center">
                <div
                  className="spinner-border"
                  style={{ width: "3rem", height: "3rem" }}
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
            <div className={`row ${message ? "" : "d-none"}`}>
              <div className="col-12 py-2 text-center">
                <h4 className="text-center text-danger">{message}</h4>
              </div>
            </div>
            <div className="row">
              {filteredTracks.length > 0 ? (
                filteredTracks
                  .reduce((rows, element, index) => {
                    if (index % 3 === 0) {
                      rows.push(filteredTracks.slice(index, index + 3));
                    }
                    return rows;
                  }, [])
                  .map((row, rowIndex) => (
                    <div key={rowIndex} className="row mb-1">
                      {row.map((element) => (
                        <div
                          key={
                            element._id ||
                            `${element.songname}-${element.singer}`
                          }
                          className="col-md-4"
                        >
                          <SongCard
                            song={element}
                            playSong={playSong}
                            isPlaying={isSongPlaying}
                            playlists={playlists}
                            setPlaylists={setPlaylists}
                          />
                        </div>
                      ))}
                    </div>
                  ))
              ) : (
                <div className="col-12 text-center">
                  <p>No tracks available. Please perform a search.</p>
                </div>
              )}
            </div>
            {filteredTracks.length > 0 && (
              <div className="row">
                <div className="col">
                  <button
                    onClick={() => {
                      setResultOffset((previous) => Math.max(previous - 10, 0));
                      fetchMusicData(resultOffsetRef.current - 10);
                    }}
                    className="btn btn-outline-success w-100"
                    disabled={resultOffsetRef.current === 0}
                  >
                    Previous Page
                  </button>
                </div>
                <div className="col">
                  <button
                    onClick={() => {
                      setResultOffset((previous) => previous + 10);
                      fetchMusicData(resultOffsetRef.current + 10);
                    }}
                    className="btn btn-outline-success w-100"
                  >
                    Next Page
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Now Playing Panel - Fixed on Right */}
        <div
          style={{
            position: "fixed",
            right: "10px",
            top: "80px",
            width: "280px",
            zIndex: 1000,
            height: "calc(100vh - 90px)",
            overflowY: "auto",
            backgroundColor: "transparent",
            borderRadius: "12px",
            padding: "10px",
            boxShadow: "0 0 40px rgba(0, 0, 0, 0.8)",
            animation: "glowPulse 2s infinite",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <style>
            {`
              @keyframes auraPulse {
                0% {
                  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.5);
                }
                50% {
                  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 0, 0, 0.7);
                }
                100% {
                  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.5);
                }
              }
              div[style*="position: fixed"][style*="right: 10px"]::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
          <style>
            {`
              div[style*="position: fixed"][style*="right: 10px"]::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
          <NowPlaying />
        </div>
      </div>
    </>
  );
}

export default Home;
