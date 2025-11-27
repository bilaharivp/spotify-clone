import React, { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MusicContext, AuthContext } from "../Context";
import "./Navbar.css";

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const Navbar = ({ keyword, setKeyword, fetchMusicData }) => {
  const { setResultOffset } = useContext(MusicContext);
  const { token, userName, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  const performSearch = (searchTerm = keyword) => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setResultOffset(0);
    setLoading(true);
    Promise.resolve(fetchMusicData(searchTerm))
      .then(() => {
        setLoading(false);
        setShowSuggestions(false);
      })
      .catch(() => {
        setLoading(false);
        setShowSuggestions(false);
      });
  };

  const fetchSuggestions = async (searchTerm) => {
    try {
      if (!searchTerm.trim()) return [];
      const response = await fetch(
        `/songs?search=${encodeURIComponent(searchTerm)}`
      );
      if (!response.ok) throw new Error("Failed to fetch suggestions");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Autocomplete fetch error:", error);
      return [];
    }
  };

  useEffect(() => {
    if (!keyword.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(async () => {
      const data = await fetchSuggestions(keyword);
      if (Array.isArray(data) && data.length > 0) {
        setSuggestions(data.slice(0, 5));
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [keyword]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setShowSuggestions(false);
      performSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setKeyword(suggestion.songname || suggestion);
    setShowSuggestions(false);
    setResultOffset(0);
    fetchMusicData(suggestion.songname || suggestion);
  };

  const clearInput = () => {
    setKeyword("");
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="navbar-left">
        <Link className="navbar-brand" to="/">
          <span>Spotify Like</span>
        </Link>
      </div>
      <div className="navbar-center">
        <div className="search-container">
          <input
            ref={inputRef}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyPress}
            className="search-input"
            type="search"
            placeholder="Search artists, tracks, or albums"
            aria-label="Search music"
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls="search-suggestions-list"
            aria-haspopup="listbox"
          />
          {keyword && (
            <button
              onClick={clearInput}
              className="clear-btn"
              aria-label="Clear search input"
            >
              &times;
            </button>
          )}
          <button
            onClick={() => {
              setShowSuggestions(false);
              performSearch();
            }}
            className="search-btn"
            aria-label="Search"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <i className="bi bi-search"></i>
            )}
          </button>
          {showSuggestions && suggestions.length > 0 && (
            <ul
              id="search-suggestions-list"
              className="suggestions-list"
              role="listbox"
            >
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                  role="option"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSuggestionClick(suggestion);
                  }}
                >
                  {suggestion.songname || suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="navbar-right">
        {token ? (
          <>
            <span className="navbar-user">{userName}</span>
            <button className="navbar-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signin" className="navbar-login-btn">
              Login
            </Link>
            <Link to="/signup" className="navbar-signup-btn">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
