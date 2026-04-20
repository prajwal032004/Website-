'use client'

import { allProjects } from '@/data/projects'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useRef, useState } from 'react'

export default function UefaPage() {
  const project = allProjects.find(p => p.id === 'uefa-women-s-euro-euronics')!
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)

  return (
    <main className="project-detail-page">
      <section className="project-hero">
        <video
          ref={videoRef}
          src={project.videoUrl}
          className="project-hero-video"
          autoPlay muted loop playsInline
          poster={project.thumbnailUrl}
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="project-floating-card glass-dark">
          <h1 className="project-headline" style={{ fontSize: 'clamp(3rem, 6vw, 4.5rem)' }}>
            {project.title}
          </h1>
          <div className="project-meta">
            {project.client}
          </div>
          <div className="project-tags-flex">
            <span className="project-tag-pill">Original Vocals</span>
            <span className="project-tag-pill">Electronic Score</span>
            <span className="project-tag-pill">Full Audio Post</span>
          </div>
          <p className="project-desc-body">
            {project.description}
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                if (videoRef.current) {
                  if (isPlaying) videoRef.current.pause()
                  else videoRef.current.play()
                  setIsPlaying(!isPlaying)
                }
              }}
              className="button-main"
            >
              <span>{isPlaying ? 'Pause' : 'Play'} Film</span>
            </button>
            <button className="button-main secondary">
              <span>Sound Only</span>
            </button>
          </div>
        </div>
      </section>

      <section className="project-credits-section">
        <div className="credits-grid-inner">
          <div className="credit-card glass-dark">
            <div className="credit-label">Client</div>
            <div className="credit-value">{project.client}</div>
          </div>
          <div className="credit-card glass-dark">
            <div className="credit-label">Music & Sound</div>
            <div className="credit-value">by RAVEN</div>
          </div>
          <div className="credit-card glass-dark">
            <div className="credit-label">Vocals By</div>
            <div className="credit-value">Julisa</div>
          </div>
        </div>
      </section>

    </main>
  )
}
