import { useEffect, useRef, useState } from "react";
import "./AudioPlayer.css";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.15;

    const events = ["pointerdown", "keydown", "touchstart", "scroll"] as const;

    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, tryPlay));
    };

    const tryPlay = () => {
      audio
        .play()
        .then(() => {
          setPlaying(true);
          cleanup();
        })
        .catch(() => {
          /* still blocked: wait for next interaction */
        });
    };

    tryPlay();
    events.forEach((e) =>
      window.addEventListener(e, tryPlay, { passive: true })
    );

    return () => {
      cleanup();
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
