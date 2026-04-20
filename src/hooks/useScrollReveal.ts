'use client'

import { useEffect, useRef } from 'react'

interface ScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const { threshold = 0.12, rootMargin = '0px 0px -50px 0px', once = true } = options
  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const elements = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-clip, .reveal-stagger, .svg-draw, .reveal-blur, .reveal-chars'
    )

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            entry.target.classList.remove('visible')
          }
        })
      },
      { threshold, rootMargin }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return containerRef
}

export function useParallax() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.parallax')
    if (!elements.length) return

    const handleScroll = () => {
      elements.forEach((el) => {
        const speed = parseFloat(el.dataset.speed || '0.3')
        const rect = el.getBoundingClientRect()
        const centerY = rect.top + rect.height / 2 - window.innerHeight / 2
        el.style.setProperty('--parallax-y', `${centerY * speed}px`)
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
}

/** Splits text into word spans for blur-stagger reveal */
export function useBlurTextSplit() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-blur-words]')
    els.forEach((el) => {
      if (el.dataset.split === 'done') return
      el.dataset.split = 'done'
      const words = el.innerText.trim().split(/\s+/)
      el.innerHTML = words
        .map((w, i) => `<span class="bw" style="--i:${i}">${w} </span>`)
        .join('')
    })
  }, [])
}