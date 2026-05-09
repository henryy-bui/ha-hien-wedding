import { useEffect, useRef, useState } from "react";
import "./LoadingScreen.css";

type Phase = "enter" | "hold" | "exit" | "done";

interface Props {
  onDone: () => void;
}

export default function LoadingScreen({ onDone }: Props) {
  const [phase, setPhase] = useState<Phase>("enter");
  // Hold onDone in a ref so the timer effect can keep `[]` deps. This is the
  // self-contained guard against the parent passing a fresh arrow each render —
  // without it, a new onDone reference would re-trigger the effect, the timers
  // would re-schedule, and the splash would replay a second time.
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 400);
    const t2 = setTimeout(() => setPhase("exit"), 1900);
    const t3 = setTimeout(() => {
      setPhase("done");
      onDoneRef.current();
    }, 2900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div className={`loading-screen phase-${phase}`} aria-hidden="true">
      <div className="loading-content">
        <div className="loading-monogram">
          <span className="loading-name hero-name-left">Văn Hà</span>
          <span className="loading-amp">&amp;</span>
          <span className="loading-name hero-name-right">Thanh Hiền</span>
        </div>
        <p className="loading-date">31 · 05 · 2026</p>
        <div className="loading-bar-track">
          <div className="loading-bar-fill" />
        </div>
      </div>
    </div>
  );
}
