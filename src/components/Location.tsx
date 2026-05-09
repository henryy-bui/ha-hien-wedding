import { useScrollReveal } from "../hooks/useScrollReveal";
import { useSide } from "../sideContext";
import { SIDE_CONFIG } from "../sideConfig";
import "./Location.css";

export default function Location() {
  const sectionRef = useScrollReveal<HTMLElement>();
  const VENUE = SIDE_CONFIG[useSide()].venue;

  const mapQuery = encodeURIComponent(VENUE.coords);
  const embedSrc = `https://maps.google.com/maps?q=${mapQuery}&z=17&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;

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
            <a
              href={directionsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="location-btn"
            >
              Chỉ Đường <span aria-hidden="true">→</span>
            </a>
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
