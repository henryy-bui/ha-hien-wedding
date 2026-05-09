import { useEffect, useState } from 'react'
import './NavDots.css'

const SECTIONS = [
  { id: 'hero',         label: 'Đầu trang'   },
  { id: 'introduction', label: 'Đôi lứa'     },
  { id: 'our-story',    label: 'Câu chuyện'  },
  { id: 'details',      label: 'Chi tiết'    },
  { id: 'location',     label: 'Địa điểm'    },
  { id: 'gallery',      label: 'Khoảnh khắc' },
  { id: 'rsvp',         label: 'Xác nhận'    },
]

export default function NavDots() {
  const [active, setActive] = useState('hero')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { threshold: 0.35 }
    )

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <nav className="nav-dots" aria-label="Điều hướng trang">
      {SECTIONS.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          className={`nav-dot ${active === id ? 'active' : ''}`}
          aria-label={label}
        >
          <span className="nav-dot-label">{label}</span>
          <span className="nav-dot-pip" />
        </a>
      ))}
    </nav>
  )
}
