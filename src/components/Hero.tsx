import { useEffect, useRef, useState } from "react";
import { useTypewriter } from "../hooks/useTypewriter";
import { useSide } from "../sideContext";
import { SIDE_CONFIG } from "../sideConfig";
import "./Hero.css";

const WEDDING_DATE = new Date(2026, 4, 31, 10, 0, 0);

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const diff = WEDDING_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

const PETALS = [
  { w: 10, h: 14, left: "5%", dur: 9, delay: -2 },
  { w: 8, h: 11, left: "15%", dur: 7, delay: -5 },
  { w: 12, h: 16, left: "25%", dur: 11, delay: -8 },
  { w: 9, h: 13, left: "35%", dur: 8, delay: -1 },
  { w: 11, h: 15, left: "45%", dur: 10, delay: -6 },
  { w: 7, h: 10, left: "55%", dur: 9.5, delay: -3 },
  { w: 13, h: 17, left: "65%", dur: 12, delay: -7 },
  { w: 8, h: 12, left: "75%", dur: 7.5, delay: -4 },
  { w: 10, h: 14, left: "85%", dur: 10.5, delay: -9 },
  { w: 9, h: 13, left: "92%", dur: 8.5, delay: -2.5 },
  { w: 11, h: 15, left: "10%", dur: 13, delay: -11 },
  { w: 7, h: 10, left: "58%", dur: 6.5, delay: -0.5 },
  { w: 12, h: 16, left: "40%", dur: 9.5, delay: -5.5 },
  { w: 8, h: 12, left: "78%", dur: 11.5, delay: -3.5 },
  { w: 10, h: 14, left: "30%", dur: 8, delay: -7.5 },
];

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft);
  const bgRef = useRef<HTMLDivElement>(null);
  const petalsRef = useRef<HTMLDivElement>(null);
  const sideData = SIDE_CONFIG[useSide()];
  const [tagline, twDone] = useTypewriter(
    "Hành trình đẹp nhất bắt đầu từ đây ✨",
    55,
    1400
  );

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const factor = window.innerWidth < 720 ? 0.55 : 1;
        if (bgRef.current)
          bgRef.current.style.transform = `translateY(${y * 0.15 * factor}px)`;
        if (petalsRef.current)
          petalsRef.current.style.transform = `translateY(${
            y * 0.42 * factor
          }px)`;
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="hero" id="hero" aria-label="Thiệp mời">
      <div className="hero-bg" ref={bgRef} />

      <div className="petals" ref={petalsRef} aria-hidden="true">
        {PETALS.map((p, i) => (
          <div
            key={i}
            className="petal"
            style={{
              width: p.w,
              height: p.h,
              left: p.left,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="hero-content">
        <p className="hero-pre">{sideData.invitationFrom}</p>

        <div className="hero-names">
          <p className="hero-name-left">Văn Hà</p>
          <p className="hero-ampersand">&amp;</p>
          <p className="hero-name-right">Thanh Hiền</p>
        </div>

        <div className="hero-date-row">
          <span className="hero-rule" />
          <p className="hero-date">31 tháng 05 năm 2026</p>
          <span className="hero-rule" />
        </div>

        <p className="hero-tagline">
          {tagline}
          <span
            className={`hero-cursor${twDone ? " blink" : ""}`}
            aria-hidden="true"
          >
            |
          </span>
        </p>

        <div
          className="countdown"
          role="timer"
          aria-label="Đếm ngược đến ngày cưới"
        >
          {(
            [
              {
                value: timeLeft.days,
                label: "Ngày",
                tip: `Còn ${timeLeft.days} ngày để chuẩn bị outfit thật đẹp!`,
              },
              {
                value: timeLeft.hours,
                label: "Giờ",
                tip: "Từng giờ trôi qua thêm hồi hộp một chút 💛",
              },
              {
                value: timeLeft.minutes,
                label: "Phút",
                tip: "Phút nào cũng trân quý 🌸",
              },
              {
                value: timeLeft.seconds,
                label: "Giây",
                tip: "Tích tắc, tích tắc... ⏰",
              },
            ] as const
          ).map(({ value, label, tip }) => (
            <div key={label} className="countdown-item" title={tip}>
              <span className="countdown-value">{pad(value)}</span>
              <span className="countdown-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
