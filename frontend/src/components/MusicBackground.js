import React from "react";
import "./MusicBackground.css";

const NUM_ICONS = 15;

const MusicBackground = () => {
  const icons = Array.from({ length: NUM_ICONS });

  return (
    <div className="music-background">
      {icons.map((_, index) => (
        <span key={index} className={`music-note note-${index % 5}`}>
          &#9835;
        </span>
      ))}
    </div>
  );
};

export default MusicBackground;
