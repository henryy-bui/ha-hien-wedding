import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useSide } from "../sideContext";
import { SIDE_CONFIG } from "../sideConfig";
import "./Location.css";

export default function Location() {
  const sectionRef = useScrollReveal<HTMLElement>();
  const data = SIDE_CONFIG[useSide()];
  const VENUE = data.venue;
  const [copied, setCopied] = useState(false);

  const mapQuery = encodeURIComponent(VENUE.coords);
  const embedSrc = `https://maps.google.com/maps?q=${mapQuery}&z=17&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;

  // Collapse same-day events into one stripe row showing every start time for that day.
  const timesByDay = data.events.reduce<
    Array<{ day: number; weekday: string; times: string[] }>
  >((acc, ev) => {
    const bucket = acc.find((d) => d.day === ev.day);
    if (bucket) bucket.times.push(ev.time);
    else acc.push({ day: ev.day, weekday: ev.weekday, times: [ev.time] });
    return acc;
  }, []);
  timesByDay.sort((a, b) => a.day - b.day);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(VENUE.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (older browsers / insecure context) — silently no-op.
    }
  };

  return (
    <section
      className="location-bg"
      ref={sectionRef}
      id="location"
      data-wipe="right"
    >
      <div className="section">
        <div className="reveal" style={{ textAlign: "center" }}>
          <span className="section-label">Địa Điểm</span>
          <h2 className="section-title">Hẹn Gặp Tại Đây</h2>
          <div className="section-divider" />
        </div>

        <div className="location-grid">
          <div className="location-info reveal reveal-delay-1">
            <span className="location-icon" aria-hidden="true">
              📍
            </span>
            <h3 className="location-name">{VENUE.name}</h3>
            <div className="location-rule" />
            <p className="location-address">{VENUE.address}</p>
            {VENUE.details
              .filter((d) => d.trim())
              .map((d) => (
                <p key={d} className="location-detail">
                  {d}
                </p>
              ))}

            <div className="location-actions">
              <a
                href={directionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="location-btn location-btn--primary"
              >
                Chỉ Đường <span aria-hidden="true">→</span>
              </a>
              <button
                type="button"
                className={`location-btn location-btn--ghost${
                  copied ? " is-copied" : ""
                }`}
                onClick={handleCopy}
                aria-live="polite"
              >
                {copied ? "Đã sao chép ✓" : "Sao chép địa chỉ"}
              </button>
            </div>
          </div>

          <div className="location-map reveal reveal-delay-2">
            <iframe
              src={embedSrc}
              title="Bản đồ đến địa điểm tổ chức lễ cưới"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
