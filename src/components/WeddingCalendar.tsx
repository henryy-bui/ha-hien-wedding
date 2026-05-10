import { useSide } from "../sideContext";
import { SIDE_CONFIG } from "../sideConfig";
import "./WeddingCalendar.css";

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const YEAR = 2026;
const MONTH = 4; // 0-indexed: May

function buildGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<number | null> = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function WeddingCalendar() {
  const data = SIDE_CONFIG[useSide()];
  const cells = buildGrid(YEAR, MONTH);

  // Group events by day so we can render one date heading + the events under it.
  // Works for both single-day (groom/combined) and multi-day (bride) configs.
  const scheduleByDay = data.events.reduce<
    Array<{ day: number; dateLabel: string; events: typeof data.events }>
  >((acc, ev) => {
    const bucket = acc.find((d) => d.day === ev.day);
    if (bucket) bucket.events.push(ev);
    else acc.push({ day: ev.day, dateLabel: ev.dateLabel, events: [ev] });
    return acc;
  }, []);
  scheduleByDay.sort((a, b) => a.day - b.day);
  const highlighted = new Set(scheduleByDay.map((d) => d.day));

  return (
    <div className="wedding-calendar reveal">
      <div className="wc-header">
        <span className="wc-month">Tháng Năm</span>
        <span className="wc-dot" aria-hidden="true">
          •
        </span>
        <span className="wc-year">{YEAR}</span>
      </div>

      <div className="wc-grid wc-weekdays" role="row">
        {WEEKDAYS.map((w) => (
          <span key={w} className="wc-weekday" role="columnheader">
            {w}
          </span>
        ))}
      </div>

      <div className="wc-grid wc-days" role="grid">
        {cells.map((d, i) => {
          if (d === null)
            return (
              <span
                key={`e-${i}`}
                className="wc-day wc-empty"
                aria-hidden="true"
              />
            );
          const isWedding = highlighted.has(d);
          return (
            <span
              key={d}
              className={`wc-day${isWedding ? " wc-day-wedding" : ""}`}
              role="gridcell"
              aria-label={
                isWedding
                  ? `Ngày cưới, ${d} tháng 5 năm ${YEAR}`
                  : `${d} tháng 5`
              }
            >
              {isWedding && (
                <svg
                  className="wc-day-heart"
                  viewBox="0 0 32 30"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient
                      id={`wc-heart-grad-${d}`}
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop offset="0%" className="wc-heart-stop-start" />
                      <stop offset="100%" className="wc-heart-stop-end" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M16 28 C 4 19 0 12 0 7.5 C 0 3 3.5 0 8 0 C 11 0 14 1.8 16 5 C 18 1.8 21 0 24 0 C 28.5 0 32 3 32 7.5 C 32 12 28 19 16 28 Z"
                    fill={`url(#wc-heart-grad-${d})`}
                  />
                </svg>
              )}
              <span className="wc-day-num">{d}</span>
            </span>
          );
        })}
      </div>

      <div className="wc-schedule">
        {scheduleByDay.map((d) => (
          <div key={d.day} className="wc-schedule-day">
            <p className="wc-schedule-date">— {d.dateLabel} —</p>
            <ul className="wc-schedule-events">
              {d.events.map((ev) => (
                <li key={ev.name} className="wc-schedule-event">
                  <span className="wc-schedule-event-name">{ev.name}</span>
                  <span className="wc-schedule-event-sep" aria-hidden="true" />
                  <span className="wc-schedule-event-time">{ev.time}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
