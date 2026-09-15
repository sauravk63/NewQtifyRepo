import React from "react";
import styles from "./Player.module.css";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import { Slider, IconButton } from "@mui/material";

export default function Player({
  activeSong,
  isPlaying,
  setIsPlaying,
  currentTime,
  duration,
  handleSeek,
}) {
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSliderChange = (e, newValue) => {
    handleSeek(newValue);
  };

  return (
    <div className={styles.playerContainer}>
      {/* Left side: song details */}
      <div className={styles.songDetails}>
        <img
          src={activeSong.image}
          alt={activeSong.title}
          className={styles.songImage}
        />
        <div className={styles.songText}>
          <div className={styles.songTitle}>{activeSong.title}</div>
          <div className={styles.songSubtitle}>{activeSong.albumTitle}</div>
        </div>
      </div>

      {/* Center side: audio controls */}
      <div className={styles.controlsContainer}>
        <IconButton
          onClick={() => setIsPlaying(!isPlaying)}
          className={styles.playButton}
          aria-label={isPlaying ? "pause" : "play"}
        >
          {isPlaying ? (
            <PauseCircleIcon className={styles.controlIcon} />
          ) : (
            <PlayCircleIcon className={styles.controlIcon} />
          )}
        </IconButton>

        <div className={styles.progressContainer}>
          <span className={styles.timeLabel}>{formatTime(currentTime)}</span>
          <Slider
            size="small"
            value={currentTime}
            min={0}
            max={duration || 100}
            onChange={handleSliderChange}
            className={styles.progressSlider}
          />
          <span className={styles.timeLabel}>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right side: empty spacer to center controls */}
      <div className={styles.rightSpacer} />
    </div>
  );
}
