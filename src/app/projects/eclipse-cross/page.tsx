'use client'

import { allProjects } from '@/data/projects'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useRef, useState } from 'react'

export default function EclipseCrossPage() {
  const project = allProjects.find(p => p.id === 'eclipse-cross')!
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
          <h1 className="project-headline">
            {project.title}
          </h1>
          <div className="project-meta">
            {project.client}
          </div>
          <div className="project-tags-flex">
            <span className="project-tag-pill">Original Score</span>
            <span className="project-tag-pill">Hybrid Percussion</span>
            <span className="project-tag-pill">Mixing</span>
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
            <div className="credit-label">Music Enhance</div>
            <div className="credit-value">by RAVEN</div>
          </div>
          <div className="credit-card glass-dark">
            <div className="credit-label">Creative Lead</div>
            <div className="credit-value">MME Group</div>
          </div>
        </div>
      </section>
    </main>
  )
}
