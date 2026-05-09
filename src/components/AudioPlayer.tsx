import { useEffect, useRef, useState } from "react";
import "./AudioPlayer.css";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.15;

    // Attempt autoplay — browsers may block until first user interaction
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => {
        /* blocked: button stays visible, user clicks to start */
      });

    return () => {
      audio.pause();
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/music.mp3" loop preload="auto" />

      <button
        className={`audio-btn ${playing ? "playing" : "paused"}`}
        onClick={toggle}
        aria-label={playing ? "Tắt nhạc" : "Bật nhạc"}
        title={playing ? "Tắt nhạc" : "Bật nhạc"}
      >
        <span className="audio-icon">♪</span>
        <span className="audio-bars" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </span>
      </button>
    </>
  );
}
