import React, { useRef } from 'react';

const AudioPlayer = ({ audioSrc, visibility}) => {
  const audioRef = useRef(null);

  const handlePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  return (
    <div style={{display: visibility ? "block" : 'none'}}>
      <audio ref={audioRef} controls>
        <source src={audioSrc} type="audio/wav" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
