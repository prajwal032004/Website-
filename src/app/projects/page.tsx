'use client'

import { useState } from 'react'
import Link from 'next/link'
import { allProjects } from '@/data/projects'
import Footer from '@/components/Footer'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function ProjectsPage() {
  const [isListView, setIsListView] = useState(false)
  useScrollReveal({ threshold: 0.05 })

  return (
    <div className="projects-page">

      {/* ── View Toggle ── */}
      <div className="projects-toggle">
        <button
          className="toggle-btn glass-nav"
          onClick={() => setIsListView((v) => !v)}
        >
          <span>{isListView ? 'scroll view' : 'list view'}</span>
          {isListView ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M14 19L21 12L14 5M21 12H2" />
            </svg>
          ) : (
            <svg width="13" height="9" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.8">
              <line x1="0" y1="1" x2="14" y2="1" />
              <line x1="0" y1="5" x2="14" y2="5" />
              <line x1="0" y1="9" x2="14" y2="9" />
            </svg>
          )}
        </button>
      </div>

      {/* ══════════════════════════════
          SCROLL VIEW
      ══════════════════════════════ */}
      {!isListView && (
        <div className="projects-scroll-view reveal">

          {/* Ghost heading — fixed behind scroll items */}
          <div className="projects-ghost-heading" aria-hidden>
            our<br />sound for
          </div>

          <div className="projects-scroll-list">
            {allProjects.map((project) => (
              <Link
                key={project.id}
                href={project.href}
                className="project-scroll-item"
              >
                <video
                  src={project.videoUrl}
                  className="project-scroll-video"
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={project.thumbnailUrl}
                />
                <div className="project-scroll-vignette" />
                <div className="project-scroll-info">
                  <div className="project-scroll-client">{project.client}</div>
                  <h2 className="project-scroll-title">{project.title}</h2>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          LIST VIEW
      ══════════════════════════════ */}
      {isListView && (
        <div className="projects-list-view">
          <div className="projects-list-header">
            <h1 className="projects-list-heading">our sound for</h1>
          </div>

          <div className="projects-list">
            {allProjects.map((project, i) => (
              <Link
                key={project.id}
                href={project.href}
                className="project-list-row"
              >
                <div className="project-list-row-left">
                  <span className="project-list-index">0{i + 1}</span>
                  <h2 className="project-list-title">{project.title}</h2>
                </div>
                <div className="project-list-row-right">
                  <span className="project-list-client">{project.client}</span>
                  <div className="project-list-arrow">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M2 12L12 2M12 2H5M12 2V9" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}