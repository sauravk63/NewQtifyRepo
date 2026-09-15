import React, { useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import styles from "./AlbumPage.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import { Pagination } from "@mui/material";

export default function AlbumPage() {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const { data, handlePlaySong } = useOutletContext();
  const { topAlbums = [], newAlbums = [] } = data;

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Find the album from topAlbums or newAlbums matching the slug
  const album = [...topAlbums, ...newAlbums].find((alb) => alb.slug === albumId);

  if (!album) {
    return <div className={styles.loading}>Loading Album...</div>;
  }

  // Calculate total duration of album songs in hours/minutes
  const calculateTotalDuration = (songs) => {
    const totalMs = songs.reduce((sum, song) => sum + song.durationInMs, 0);
    const totalMinutes = Math.floor(totalMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;
  };

  // Format single song duration (e.g. 54040 ms -> "1:59")
  const formatDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Pagination calculations
  const totalSongs = album.songs.length;
  const totalPages = Math.ceil(totalSongs / pageSize);
  const paginatedSongs = album.songs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.albumPageContainer}>
      {/* Back arrow button */}
      <div className={styles.backButtonContainer}>
        <div className={styles.backButton} onClick={() => navigate("/")}>
          <ArrowBackIcon style={{ color: "var(--color-white)" }} />
        </div>
      </div>

      {/* Album header block */}
      <div className={styles.albumHeader}>
        <img
          src={album.image}
          alt={album.title}
          className={styles.albumCoverImage}
        />
        <div className={styles.albumDetails}>
          <h1 className={styles.albumTitle}>{album.title}</h1>
          <p className={styles.albumDescription}>{album.description}</p>
          <div className={styles.albumMetadata}>
            <span>{totalSongs} songs</span>
            <span className={styles.dot}>•</span>
            <span>{calculateTotalDuration(album.songs)}</span>
            <span className={styles.dot}>•</span>
            <span>{album.follows.toLocaleString()} Follows</span>
          </div>
          <div className={styles.albumActions}>
            <button className={styles.shuffleButton}>
              <ShuffleIcon className={styles.actionIcon} />
              Shuffle
            </button>
            <button className={styles.libraryButton}>
              <LibraryMusicIcon className={styles.actionIcon} />
              Add to library
            </button>
          </div>
        </div>
      </div>

      {/* Songs table section */}
      <div className={styles.songsSection}>
        {/* Pagination controls at top-right of table */}
        <div className={styles.tableHeaderControls}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            shape="circular"
            size="medium"
            className={styles.customPagination}
          />
        </div>

        {/* Tracks table */}
        <table className={styles.songsTable}>
          <thead>
            <tr>
              <th className={styles.colTitle}>Title</th>
              <th className={styles.colArtist}>Artist</th>
              <th className={styles.colDuration}>Duration</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSongs.map((song) => {
              const artistsString = song.artists.join(", ");
              return (
                <tr
                  key={song.id}
                  className={styles.songRow}
                  onClick={() => handlePlaySong(song, album.title)}
                >
                  <td className={styles.colTitle}>
                    <div className={styles.songTitleCell}>
                      <img
                        src={song.image}
                        alt={song.title}
                        className={styles.songThumbnail}
                      />
                      <span className={styles.songNameText}>{song.title}</span>
                    </div>
                  </td>
                  <td className={styles.colArtist}>
                    <span className={styles.artistNameText}>
                      {artistsString}
                    </span>
                  </td>
                  <td className={styles.colDuration}>
                    <span className={styles.durationText}>
                      {formatDuration(song.durationInMs)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
