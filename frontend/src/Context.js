import { createContext, useState, useEffect } from "react";

// AuthContext for handling authentication state
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState(null);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("authToken", newToken);
    fetchUserProfile(newToken);
  };

  const logout = () => {
    setToken(null);
    setUserName(null);
    localStorage.removeItem("authToken");
  };

  const fetchUserProfile = async (authToken) => {
    try {
      console.log("Fetching user profile with token:", authToken);
      const response = await fetch("http://localhost:5001/user/profile", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log("User profile response status:", response.status);
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
      const data = await response.json();
      console.log("User profile data received:", data);
      setUserName(data.firstname || "User");
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserName("User");
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setToken(savedToken);
      fetchUserProfile(savedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// MusicContext for handling music-related state
export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [likedMusic, setLikedMusic] = useState(
    JSON.parse(localStorage.getItem("likedMusic")) || []
  );
  const [pinnedMusic, setPinnedMusic] = useState(
    JSON.parse(localStorage.getItem("pinnedMusic")) || []
  );
  const [resultOffset, setResultOffset] = useState(0);

  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playlists, setPlaylists] = useState(
    JSON.parse(localStorage.getItem("allPlaylist")) || {}
  );

  useEffect(() => {
    localStorage.setItem("likedMusic", JSON.stringify(likedMusic)); // Sync with localStorage
  }, [likedMusic]);

  useEffect(() => {
    localStorage.setItem("pinnedMusic", JSON.stringify(pinnedMusic)); // Sync with localStorage
  }, [pinnedMusic]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const playNext = () => {
    setCurrentTrackIndex((prev) =>
      tracks.length === 0 ? 0 : (prev + 1) % tracks.length
    );
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) =>
      tracks.length === 0 ? 0 : prev === 0 ? tracks.length - 1 : prev - 1
    );
    setCurrentTime(0);
    setIsPlaying(true);
  };

  return (
    <MusicContext.Provider
      value={{
        isLoading,
        setIsLoading,
        likedMusic,
        setLikedMusic,
        resultOffset,
        setResultOffset,
        pinnedMusic,
        setPinnedMusic,

        tracks,
        setTracks,
        currentTrackIndex,
        setCurrentTrackIndex,
        isPlaying,
        setIsPlaying,
        currentTime,
        setCurrentTime,
        duration,
        setDuration,
        volume,
        setVolume,
        playlists,
        setPlaylists,

        togglePlay,
        playNext,
        playPrev,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

// Combined ContextProvider to wrap the whole app
export const CombinedProvider = ({ children }) => {
  return (
    <AuthProvider>
      <MusicProvider>{children}</MusicProvider>
    </AuthProvider>
  );
};
