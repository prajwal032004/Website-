'use client'

import { allProjects } from '@/data/projects'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useRef, useState } from 'react'

export default function BattlefieldPage() {
  const project = allProjects.find(p => p.id === 'battlefield-6')!
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)

  return (
    <main className="project-detail-page">
      {/* ── Hero Video Section ── */}
      <section className="project-hero">
        <video
          ref={videoRef}
          src={project.videoUrl}
          className="project-hero-video"
          autoPlay muted loop playsInline
          poster={project.thumbnailUrl}
        />
        <div className="absolute inset-0 bg-black/40" />

        {/* Perfect Floating Card */}
        <div className="project-floating-card glass-dark">
          <h1 className="project-headline">
            {project.title}
          </h1>
          <div className="project-meta">
            {project.client}
          </div>

          <div className="project-tags-flex">
            <span className="project-tag-pill">Original Music</span>
            <span className="project-tag-pill">Sound Design</span>
            <span className="project-tag-pill">Cinematic Mix</span>
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

        {/* Animated Scroll Cue */}
        <div className="absolute bottom-10 right-10 flex flex-col items-center gap-4 opacity-50">
          <div className="w-[1px] h-20 bg-white/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-white animate-scroll-down"></div>
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] rotate-180 [writing-mode:vertical-lr]">Scroll</span>
        </div>
      </section>

      {/* ── Credits Grid ── */}
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
            <div className="credit-label">Post Production</div>
            <div className="credit-value">Source Sound Inc.</div>
          </div>
        </div>
      </section>

      {/* ── More Work ── */}
      <section className="py-20">
        <div className="px-[5%] mb-12 flex items-center justify-between">
          <h2 className="text-4xl font-light uppercase tracking-tighter">More Work</h2>
          <Link href="/projects" className="text-xs uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">View All</Link>
        </div>

        <div className="more-work-grid">
          {allProjects.filter(p => p.id !== 'battlefield-6').slice(0, 2).map(p => (
            <Link key={p.id} href={`/projects/${p.id}`} className="work-item-card">
              <div className="work-item-thumb-box">
                <img src={p.thumbnailUrl} className="work-item-img" alt="" />
                <div className="absolute inset-0 bg-black/20" />
              </div>
              <div className="credit-label" style={{ marginBottom: '0.5rem' }}>{p.client}</div>
              <div className="text-xl uppercase tracking-tight font-light">{p.title}</div>
            </Link>
          ))}
        </div>
      </section>

    </main>
  )
}
