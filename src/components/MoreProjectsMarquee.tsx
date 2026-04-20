'use client'

import Link from 'next/link'
import { useRef } from 'react'

/* Projects shown in the marquee — matching byraven.com's homepage ticker */
const marqueeProjects = [
  {
    title: 'Eurojackpot',
    client: 'KNVB Beker',
    href: '/projects/eurojackpot-knvb-beker',
    thumb: 'https://vz-03ab8796-bb5.b-cdn.net/518488cb-0b4b-4751-b526-d8a8e6d2a2d7/thumbnail_45d8c27f.jpg',
  },
  {
    title: 'Overwatch Champions Series',
    client: 'Blizzard',
    href: '/projects/champions-series',
    thumb: 'https://vz-03ab8796-bb5.b-cdn.net/2d122870-2d86-4011-87f4-bd4bb6d10514/thumbnail_de8268db.jpg',
  },
  {
    title: 'The Hunt Begins',
    client: 'Feature Film',
    href: '/projects/the-hunt-begins',
    thumb: 'https://vz-03ab8796-bb5.b-cdn.net/c58c0fe2-2814-4425-a4a0-c9075b6779ac/thumbnail_9ccbbd67.jpg',
  },
  {
    title: 'De Vuurlinie',
    client: 'NPO',
    href: '/projects/de-vuurlinie',
    thumb: 'https://vz-03ab8796-bb5.b-cdn.net/409c3d6a-299b-4afb-9457-04e410bd7b2a/thumbnail.jpg',
  },
  {
    title: "Women's EURO 2024",
    client: 'UEFA & Euronics',
    href: '/projects/uefa-womens-euro-2024-euronics',
    thumb: 'https://vz-03ab8796-bb5.b-cdn.net/8a42d2fc-8fd6-4b70-88af-40d88d08d8f6/thumbnail_c9adbb4f.jpg',
  },
  {
    title: 'Kiriko',
    client: 'Overwatch 2',
    href: '/projects/kiriko',
    thumb: 'https://vz-03ab8796-bb5.b-cdn.net/38feab4c-0830-46f8-977c-e95425ac411a/thumbnail.jpg',
  },
  {
    title: 'One To Watch',
    client: 'Buma/Stemra',
    href: '/projects/one-to-watch',
    thumb: 'https://vz-03ab8796-bb5.b-cdn.net/14b5239f-d63c-4ec1-aa2c-75b917f9b14e/thumbnail.jpg',
  },
  {
    title: 'Black Ops 7',
    client: 'Call of Duty',
    href: '/projects/black-ops-7',
    thumb: 'https://vz-03ab8796-bb5.b-cdn.net/4ed45170-4162-4c8a-a3e4-9d5d33d888c3/thumbnail.jpg',
  },
]

/* Duplicate for seamless infinite loop */
const allItems = [...marqueeProjects, ...marqueeProjects]

export default function MoreProjectsMarquee() {
  const stripRef = useRef<HTMLDivElement>(null)

  /* Pause on hover */
  const pause  = () => { if (stripRef.current) stripRef.current.style.animationPlayState = 'paused' }
  const resume = () => { if (stripRef.current) stripRef.current.style.animationPlayState = 'running' }

  return (
    <section className="marquee-section">
      {/* Section label */}
      <div className="marquee-label reveal">
        <span className="marquee-label-dot" />
        more projects
        <Link href="/projects" className="marquee-view-all">
          view all
          <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 12L12 2M12 2H5M12 2V9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      {/* Scrolling strip */}
      <div className="marquee-track" onMouseEnter={pause} onMouseLeave={resume}>
        <div className="marquee-strip" ref={stripRef}>
          {allItems.map((p, i) => (
            <Link
              key={`${p.href}-${i}`}
              href={p.href}
              className="marquee-card"
            >
              {/* Thumbnail */}
              <div className="marquee-card-img-wrapper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.thumb}
                  alt={p.title}
                  className="marquee-card-img"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback gradient if CDN image fails
                    const el = e.currentTarget as HTMLImageElement
                    el.style.display = 'none'
                  }}
                />
                <div className="marquee-card-gradient" />
              </div>

              {/* Text */}
              <div className="marquee-card-info">
                <div className="marquee-card-title">{p.title}</div>
                <div className="marquee-card-client">{p.client}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
