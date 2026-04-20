'use client'

import { useEffect, useRef, useState } from 'react'

export default function SoundSection() {
  const scrollRef = useRef<HTMLElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      if (!scrollRef.current) return
      const rect = scrollRef.current.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = Math.min(Math.max((vh - rect.top) / (vh + rect.height), 0), 1)
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section ref={scrollRef} className="sound_section">
      <div className="sound_bg">
        <div 
          className="oursound-text"
          style={{ transform: `translateX(${(0.5 - scrollProgress) * 40}%)` }}
        >
          our sound isn't subtle,
        </div>
        <div 
          className="oursound-text"
          style={{ transform: `translateX(${(scrollProgress - 0.5) * 40}%)` }}
        >
          it cuts through the noise.
        </div>
      </div>
    </section>
  )
}
