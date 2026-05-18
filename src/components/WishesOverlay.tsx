import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useWishes, type Wish } from "../hooks/useWishes";
import { useSide } from "../sideContext";
import "./WishesOverlay.css";
import { SIDE_CONFIG } from "../sideConfig";

const STORAGE_KEY = "wedding:wishes-overlay-collapsed";

/**
 * Floating live-wishes feed pinned bottom-right. Three states:
 *   chip → expanded card (auto-scrolling preview) → "Sổ Lưu Bút" modal (full read).
 * Hidden entirely until at least one wish exists — empty state would be noise.
 */
export default function WishesOverlay() {
  const { wishes, loading } = useWishes();
  const side = useSide();
  const sideData = SIDE_CONFIG[side];
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  });
  const [modalOpen, setModalOpen] = useState(false);
  const prevCountRef = useRef(wishes.length);
  const [pulseChip, setPulseChip] = useState(false);

  useLayoutEffect(() => {
    if (collapsed) return;
    if (wishes.length === 0) return;
    const container = document.querySelector(".wishes-viewport");
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [wishes.length, collapsed]);

  // Pulse chip when a new wish arrives while collapsed.
  useEffect(() => {
    const prev = prevCountRef.current;
    prevCountRef.current = wishes.length;
    if (wishes.length > prev && collapsed) {
      setPulseChip(true);
      const t = setTimeout(() => setPulseChip(false), 2200);
      return () => clearTimeout(t);
    }
  }, [wishes.length, collapsed]);

  const animatedScroll = true;

  // Animation duration scales with item count — ~5 s per item, clamped.
  const durationSec = useMemo(() => {
    const ideal = wishes.length * 5;
    return Math.max(20, Math.min(ideal, 120));
  }, [wishes.length]);

  // Lock body scroll + Esc-to-close while modal is open.
  useEffect(() => {
    if (!modalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [modalOpen]);

  if (loading) return null;
  if (wishes.length === 0) return null;

  if (collapsed) {
    return (
      <button
        type="button"
        className={`wishes-chip${pulseChip ? " wishes-chip--pulse" : ""}`}
        onClick={() => setCollapsed(false)}
        aria-label={`Mở lời chúc — ${wishes.length} lời chúc`}
      >
        <span className="wishes-chip-icon" aria-hidden="true">
          💌
        </span>
        <span className="wishes-chip-label">Lời chúc</span>
        <span className="wishes-chip-count">{wishes.length}</span>
      </button>
    );
  }

  return (
    <>
      <aside
        className="wishes-overlay"
        aria-label="Lời chúc đang được gửi đến cô dâu &amp; chú rể"
      >
        <header className="wishes-overlay-head">
          <div className="wishes-overlay-title-row">
            <span className="wishes-overlay-title">
              <span className="wishes-live-dot" aria-hidden="true" />
              Lời Chúc
              <span className="wishes-overlay-count" aria-live="polite">
                {wishes.length}
              </span>
            </span>
            <div className="wishes-overlay-actions">
              <button
                type="button"
                className="wishes-overlay-action"
                onClick={() => setModalOpen(true)}
                aria-label="Xem tất cả lời chúc"
                title="Xem tất cả"
              >
                <ExpandIcon />
              </button>
              <button
                type="button"
                className="wishes-overlay-action"
                onClick={() => setCollapsed(true)}
                aria-label="Thu gọn lời chúc"
                title="Thu gọn"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>
        </header>

        {wishes.length > 0 && (
          <div className="wishes-viewport">
            <div
              className={`wishes-track${animatedScroll ? " is-scrolling" : ""}`}
              style={
                animatedScroll
                  ? { animationDuration: `${durationSec}s` }
                  : undefined
              }
            >
              <WishList wishes={wishes} onSelect={() => setModalOpen(true)} />
              {animatedScroll && (
                <WishList
                  wishes={wishes}
                  onSelect={() => setModalOpen(true)}
                  ariaHidden
                />
              )}
            </div>
          </div>
        )}
      </aside>

      {modalOpen && (
        <WishesModal
          sideData={sideData}
          wishes={wishes}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}

function WishList({
  wishes,
  onSelect,
  ariaHidden,
}: {
  wishes: Wish[];
  onSelect: (w: Wish) => void;
  ariaHidden?: boolean;
}) {
  return (
    <ul className="wishes-list" aria-hidden={ariaHidden}>
      {wishes.map((w, i) => (
        <li
          key={`${w.name}-${w.timestamp}-${i}`}
          className={`wish-card wish-card--${w.side || "guest"}`}
        >
          <button
            type="button"
            className="wish-card-button"
            onClick={() => onSelect(w)}
            tabIndex={ariaHidden ? -1 : 0}
            aria-label={`Đọc lời chúc của ${w.name}`}
          >
            <div className="wish-meta">
              <span className="wish-name">{w.name}</span>
              <span className="wish-time">{formatRelative(w.timestamp)}</span>
            </div>
            <p className="wish-note">{w.note}</p>
          </button>
        </li>
      ))}
    </ul>
  );
}

function WishesModal({
  wishes,
  onClose,
  sideData,
}: {
  wishes: Wish[];
  onClose: () => void;
  sideData: (typeof SIDE_CONFIG)[keyof typeof SIDE_CONFIG];
}) {
  return (
    <div
      className="wishes-modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="wishes-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wishes-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="wishes-modal-head">
          <div>
            <p className="wishes-modal-eyebrow">💌 Sổ Lưu Bút</p>
            <h3 id="wishes-modal-title" className="wishes-modal-title">
              Lời Chúc Cho {sideData.groomBrideNames[0]} &amp;{" "}
              {sideData.groomBrideNames[1]}
            </h3>
            <p className="wishes-modal-subtitle">
              {wishes.length} lời chúc thân thương
            </p>
          </div>
          <button
            type="button"
            className="wishes-modal-close"
            onClick={onClose}
            aria-label="Đóng"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        {wishes.length > 0 && (
          <ul className="wishes-modal-list">
            {wishes.map((w, i) => (
              <li
                key={`${w.name}-${w.timestamp}-${i}`}
                className={`wish-card wish-card--modal wish-card--${
                  w.side || "guest"
                }`}
              >
                <div className="wish-card-modal-inner">
                  <div className="wish-meta">
                    <span className="wish-name">{w.name}</span>
                    <span className="wish-time">
                      {formatRelative(w.timestamp)}
                    </span>
                  </div>
                  <p className="wish-note wish-note--full">{w.note}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ExpandIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M3 4h10M3 8h10M3 12h6" />
    </svg>
  );
}

/** Vietnamese relative-time formatter: "vừa xong" / "X phút trước" / "X giờ trước" / "X ngày trước" / "DD/MM". */
function formatRelative(iso: string): string {
  const ts = new Date(iso).getTime();
  if (Number.isNaN(ts)) return "";
  const diffMs = Date.now() - ts;
  if (diffMs < 60_000) return "vừa xong";
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} giờ trước`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay} ngày trước`;
  const d = new Date(ts);
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}`;
}
