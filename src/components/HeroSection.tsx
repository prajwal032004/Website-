'use client'

import { useEffect, useRef, useState } from 'react'
import { featuredProjects } from '@/data/projects'

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [scrollY, setScrollY] = useState(0)

  // Autoplay on mount
  useEffect(() => {
    videoRef.current?.play().catch(() => {})
  }, [])

  // Scroll-driven parallax / blur
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  const progress = Math.min(scrollY / (vh * 0.7), 1)
  const textBlur    = progress * 18
  const textOpacity = 1 - progress * 1.1
  const textY       = progress * -60
  const videoScale  = 1 + progress * 0.12

  return (
    <section className="hero-section">
      {/* Full-screen MP4 video */}
      <video
        ref={videoRef}
        src={featuredProjects[0].videoUrl}
        className="hero-video"
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        poster={featuredProjects[0].thumbnailUrl}
        style={{ transform: `scale(${videoScale})` }}
      />

      {/* Dark gradient overlay */}
      <div className="hero-overlay" />

      {/* Film-grain texture */}
      <div className="hero-grain" />

      {/* Thin scroll-progress line at bottom */}
      <div
        className="hero-scroll-line"
        style={{ transform: `scaleX(${progress})` }}
      />

      {/* Headline — blurs/fades on scroll */}
      <div
        className="hero-text-wrapper"
        style={{
          filter:    `blur(${textBlur}px)`,
          opacity:   Math.max(textOpacity, 0),
          transform: `translateY(${textY}px)`,
        }}
      >
        <h1 className="hero-text-heading animate-float" style={{ fontSize: 'clamp(3rem, 10vw, 8rem)', whiteSpace: 'nowrap' }}>
          international music agency
        </h1>
      </div>

      {/* Scroll cue (bottom-right) */}
      <div
        className="hero-scroll-cue"
        style={{ opacity: Math.max(1 - progress * 3, 0) }}
      >
        <div className="hero-scroll-cue-line" />
        <span>scroll</span>
      </div>
    </section>
  )
}
