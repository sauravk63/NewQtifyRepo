import React, { useEffect, useState, useRef } from "react";
import Navbar from "./components/Navbar/Navbar";
import StyledEngineProvider from "@mui/material/StyledEngineProvider";
import { Outlet } from "react-router-dom";
import Player from "./components/Player/Player";
import {
  fetchFilters,
  fetchNewAlbums,
  fetchSongs,
  fetchTopAlbums,
} from "./api/api";

function App() {
  const [data, setData] = useState({});

  // const r = {
  //   topAlbums: [{}, {}, {}, {}],
  //    newAlbums: [{}, {}, {}, {}],
  //    genres: ['rock', 'pop', 'jazz'],
  //    songs: []
  // };

  const generateData = (key, source) => {
    source().then((data) => {
      setData((prevState) => {
        // Object.assign would also work
        return { ...prevState, [key]: data };
      });
    });
  };

  useEffect(() => {
    generateData("topAlbums", fetchTopAlbums);
    generateData("newAlbums", fetchNewAlbums);
    generateData("songs", fetchSongs);
    generateData("genres", fetchFilters);
  }, []);

  const { topAlbums = [], newAlbums = [], songs = [], genres = [] } = data;

  const [activeSong, setActiveSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef(null);

  const handlePlaySong = (song, albumTitle) => {
    setActiveSong({
      ...song,
      albumTitle: albumTitle || song.artists.join(", "),
    });
    setIsPlaying(true);
  };

  useEffect(() => {
    if (activeSong && audioRef.current) {
      audioRef.current.src = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; // Fixed sample MP3 file
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log("Play failed: ", err));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSong]);

  useEffect(() => {
    if (audioRef.current && activeSong) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log("Play failed: ", err));
      } else {
        audioRef.current.pause();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (newValue) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  return (
    <>
      <StyledEngineProvider injectFirst>
        <div style={{ paddingBottom: activeSong ? "100px" : "0" }}>
          <Navbar searchData={[...topAlbums, ...newAlbums]} />
          <Outlet context={{ data: { topAlbums, newAlbums, songs, genres }, handlePlaySong }} />
          {activeSong && (
            <Player
              activeSong={activeSong}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              currentTime={currentTime}
              duration={audioDuration}
              handleSeek={handleSeek}
            />
          )}
        </div>
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      </StyledEngineProvider>
    </>
  );
}

//let a = 5;
//a = 6;
//a = "a string"
// {data: {
//   topAlbums: [],
//   newAlbums: [],
//   genres: [],
//   songs: []
// }}

export default App;
