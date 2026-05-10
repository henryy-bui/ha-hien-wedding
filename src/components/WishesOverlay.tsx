import { useEffect, useMemo, useState } from "react";
import { useWishes, type Wish } from "../hooks/useWishes";
import "./WishesOverlay.css";
import { useSide } from "../sideContext";

const STORAGE_KEY = "wedding:wishes-overlay-collapsed";

/**
 * Floating live-wishes feed. Sits in the bottom-right corner on every
 * section; can be collapsed to a small chip. Vertical infinite scroll —
 * the wish list is duplicated inside the track so a 0 → -50% translateY
 * loop reads as continuous.
 *
 * Hidden entirely if the RSVP endpoint isn't configured or no wishes
 * exist yet — it would be visual noise otherwise.
 */
export default function WishesOverlay() {
  const { wishes, loading } = useWishes();
  const side = useSide();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  });

  console.log({ wishes });

  const wishesForSide = useMemo(() => {
    if (side === "bride") return wishes.filter((w) => w.side === "bride");
    if (side === "groom") return wishes.filter((w) => w.side === "groom");
    return wishes;
  }, [side, wishes]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      /* persistence is best-effort */
    }
  }, [collapsed]);

  // Animation duration scales with item count so longer lists scroll at
  // a readable rate — ~5 s per visible item, clamped.
  const durationSec = useMemo(() => {
    const ideal = wishes.length * 5;
    return Math.max(20, Math.min(ideal, 120));
  }, [wishes.length]);

  // Don't render anything until we have wishes (or while loading the first batch).
  if (loading) return null;
  if (wishesForSide.length === 0) return null;

  if (collapsed) {
    return (
      <button
        type="button"
        className="wishes-chip"
        onClick={() => setCollapsed(false)}
        aria-label={`Mở lời chúc — ${wishesForSide.length} lời chúc`}
      >
        <span className="wishes-chip-icon" aria-hidden="true">
          💌
        </span>
        <span className="wishes-chip-count">{wishesForSide.length}</span>
      </button>
    );
  }

  return (
    <aside
      className="wishes-overlay"
      aria-label="Lời chúc đang được gửi đến cô dâu chú rể"
    >
      <header className="wishes-overlay-head">
        <span className="wishes-overlay-title">
          <span className="wishes-overlay-icon" aria-hidden="true">
            💌
          </span>
          Lời Chúc
        </span>
        <button
          type="button"
          className="wishes-overlay-close"
          onClick={() => setCollapsed(true)}
          aria-label="Thu gọn lời chúc"
        >
          ×
        </button>
      </header>

      <div className="wishes-viewport">
        <div
          className="wishes-track"
          style={{ animationDuration: `${durationSec}s` }}
        >
          <WishList wishes={wishesForSide} />
          {/* Duplicate so the translateY -50% loop is seamless. aria-hidden so
              screen readers don't read each wish twice. */}
          {/* <WishList wishes={wishesForSide} aria-hidden /> */}
        </div>
      </div>
    </aside>
  );
}

function WishList({
  wishes,
  "aria-hidden": ariaHidden,
}: {
  wishes: Wish[];
  "aria-hidden"?: boolean;
}) {
  return (
    <ul className="wishes-list" aria-hidden={ariaHidden}>
      {wishes.map((w, i) => (
        <li
          key={`${w.name}-${w.timestamp}-${i}`}
          className={`wish-card wish-card--${w.side || "guest"}`}
        >
          <div className="wish-meta">
            <span className="wish-name">{w.name}</span>
          </div>
          <p className="wish-note">{w.note}</p>
        </li>
      ))}
    </ul>
  );
}
