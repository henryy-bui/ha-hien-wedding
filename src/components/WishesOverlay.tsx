import { useEffect, useMemo, useRef, useState } from "react";
import { useWishes, type Wish } from "../hooks/useWishes";
import "./WishesOverlay.css";

const STORAGE_KEY = "wedding:wishes-overlay-collapsed";

type FilterMode = "combined" | "groom" | "bride";

const FILTER_LABELS: Record<FilterMode, string> = {
  combined: "Tất cả",
  groom: "Nhà trai",
  bride: "Nhà gái",
};

const FILTER_MODES: FilterMode[] = ["combined", "groom", "bride"];

/**
 * Floating live-wishes feed pinned bottom-right. Three states:
 *   chip → expanded card (auto-scrolling preview) → "Sổ Lưu Bút" modal (full read).
 * Hidden entirely until at least one wish exists — empty state would be noise.
 */
export default function WishesOverlay() {
  const { wishes, loading } = useWishes();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<FilterMode>("combined");
  const prevCountRef = useRef(wishes.length);
  const [pulseChip, setPulseChip] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      /* persistence is best-effort */
    }
  }, [collapsed]);

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

  const filteredWishes = useMemo(() => {
    if (filter === "combined") return wishes;
    return wishes.filter((w) => w.side === filter);
  }, [filter, wishes]);

  const hasMixedSides = useMemo(() => {
    let groom = false;
    let bride = false;
    for (const w of wishes) {
      if (w.side === "groom") groom = true;
      else if (w.side === "bride") bride = true;
      if (groom && bride) return true;
    }
    return false;
  }, [wishes]);

  // Only auto-scroll when there are enough cards that they'd overflow.
  const animatedScroll = filteredWishes.length >= 4;

  // Animation duration scales with item count — ~5 s per item, clamped.
  const durationSec = useMemo(() => {
    const ideal = filteredWishes.length * 5;
    return Math.max(20, Math.min(ideal, 120));
  }, [filteredWishes.length]);

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
        aria-label="Lời chúc đang được gửi đến cô dâu chú rể"
      >
        <header className="wishes-overlay-head">
          <div className="wishes-overlay-title-row">
            <span className="wishes-overlay-title">
              <span className="wishes-live-dot" aria-hidden="true" />
              Lời Chúc
              <span className="wishes-overlay-count" aria-live="polite">
                {filteredWishes.length}
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
          {hasMixedSides && (
            <FilterPills filter={filter} setFilter={setFilter} size="sm" />
          )}
        </header>

        {filteredWishes.length && (
          <div className="wishes-viewport">
            <div
              className={`wishes-track${animatedScroll ? " is-scrolling" : ""}`}
              style={
                animatedScroll
                  ? { animationDuration: `${durationSec}s` }
                  : undefined
              }
            >
              <WishList
                wishes={filteredWishes}
                onSelect={() => setModalOpen(true)}
              />
              {animatedScroll && (
                <WishList
                  wishes={filteredWishes}
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
          wishes={wishes}
          filter={filter}
          setFilter={setFilter}
          hasMixedSides={hasMixedSides}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}

function FilterPills({
  filter,
  setFilter,
  size,
}: {
  filter: FilterMode;
  setFilter: (m: FilterMode) => void;
  size: "sm" | "md";
}) {
  return (
    <div
      className={`wishes-filter-row${
        size === "md" ? " wishes-filter-row--md" : ""
      }`}
      role="tablist"
      aria-label="Lọc lời chúc theo bên"
    >
      {FILTER_MODES.map((m) => (
        <button
          key={m}
          type="button"
          role="tab"
          aria-selected={filter === m}
          className={`wishes-filter-pill${filter === m ? " is-active" : ""}`}
          onClick={() => setFilter(m)}
        >
          {FILTER_LABELS[m]}
        </button>
      ))}
    </div>
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
  filter,
  setFilter,
  hasMixedSides,
  onClose,
}: {
  wishes: Wish[];
  filter: FilterMode;
  setFilter: (m: FilterMode) => void;
  hasMixedSides: boolean;
  onClose: () => void;
}) {
  const filtered = useMemo(() => {
    if (filter === "combined") return wishes;
    return wishes.filter((w) => w.side === filter);
  }, [filter, wishes]);

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
              Lời Chúc Cho Hà &amp; Hiền
            </h3>
            <p className="wishes-modal-subtitle">
              {filtered.length} lời chúc thân thương
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

        {hasMixedSides && (
          <FilterPills filter={filter} setFilter={setFilter} size="md" />
        )}

        {filtered.length && (
          <ul className="wishes-modal-list">
            {filtered.map((w, i) => (
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
