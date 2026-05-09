import { useEffect, useRef, useState } from 'react'
import './Hero.css'

const WEDDING_DATE = new Date(2026, 4, 31, 10, 0, 0)

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(): TimeLeft {
  const diff = WEDDING_DATE.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  }
}

const PARTICLES = [
  { size: 80,  top: '12%', left: '8%',  dur: 9,    delay: 0,   opacity: 0.25 },
  { size: 50,  top: '22%', left: '85%', dur: 12,   delay: 1.5, opacity: 0.20 },
  { size: 120, top: '58%', left: '4%',  dur: 11,   delay: 3,   opacity: 0.15 },
  { size: 40,  top: '70%', left: '79%', dur: 8,    delay: 0.5, opacity: 0.30 },
  { size: 90,  top: '38%', left: '91%', dur: 13,   delay: 2,   opacity: 0.18 },
  { size: 30,  top: '8%',  left: '58%', dur: 7,    delay: 4,   opacity: 0.35 },
  { size: 70,  top: '80%', left: '28%', dur: 10,   delay: 1,   opacity: 0.20 },
  { size: 55,  top: '48%', left: '14%', dur: 9.5,  delay: 2.5, opacity: 0.22 },
  { size: 100, top: '28%', left: '48%', dur: 14,   delay: 0.7, opacity: 0.12 },
  { size: 35,  top: '84%', left: '64%', dur: 8.5,  delay: 3.5, opacity: 0.28 },
  { size: 65,  top: '4%',  left: '33%', dur: 11.5, delay: 1.2, opacity: 0.20 },
  { size: 45,  top: '90%', left: '88%', dur: 9,    delay: 4.5, opacity: 0.25 },
]

export default function Hero() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.35}px)`
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <section className="hero" aria-label="Thiệp mời">
      <div className="hero-bg" ref={bgRef} />

      <div className="particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: p.size,
              height: p.size,
              top: p.top,
              left: p.left,
              opacity: p.opacity,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="hero-content">
        <p className="hero-pre">Trân trọng kính mời bạn đến tham dự lễ cưới của</p>

        <h1 className="hero-names">
          <span className="hero-name-left">Van Ha</span>
          <span className="hero-ampersand">&amp;</span>
          <span className="hero-name-right">Thanh Hien</span>
        </h1>

        <div className="hero-date-row">
          <span className="hero-rule" />
          <p className="hero-date">31 tháng 05 năm 2026</p>
          <span className="hero-rule" />
        </div>

        <p className="hero-tagline">Hành trình đẹp nhất bắt đầu từ đây ✨</p>

        <div className="countdown" role="timer" aria-label="Đếm ngược đến ngày cưới">
          {(
            [
              { value: timeLeft.days,    label: 'Ngày',  tip: `Còn ${timeLeft.days} ngày để chuẩn bị outfit thật đẹp!` },
              { value: timeLeft.hours,   label: 'Giờ',   tip: 'Từng giờ trôi qua thêm hồi hộp một chút 💛' },
              { value: timeLeft.minutes, label: 'Phút',  tip: 'Phút nào cũng trân quý 🌸' },
              { value: timeLeft.seconds, label: 'Giây',  tip: 'Tích tắc, tích tắc... ⏰' },
            ] as const
          ).map(({ value, label, tip }) => (
            <div key={label} className="countdown-item" title={tip}>
              <span className="countdown-value">{pad(value)}</span>
              <span className="countdown-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-scroll" aria-hidden="true">
        <span className="hero-scroll-text">Cuộn xuống</span>
        <div className="hero-scroll-line" />
      </div>
    </section>
  )
}
