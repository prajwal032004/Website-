'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'
import { featuredProjects } from '@/data/projects'

/* ─── Single Project Item Panel ─── */
function ProjectItem({
  project,
  index,
  isActive,
  onActive,
}: {
  project: (typeof featuredProjects)[0]
  index: number
  isActive: boolean
  onActive: (i: number) => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Observe intersection to trigger "active" state for the sticky counter
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onActive(index)
        }
      },
      { threshold: 0.4 } // Center of mass check
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [index, onActive])

  // Optional: Auto-play/pause when in view if needed, 
  // but for "one after other" they are usually auto-playing loop
  useEffect(() => {
    if (isActive) {
      videoRef.current?.play().catch(() => {})
    }
  }, [isActive])

  return (
    <div 
      ref={cardRef}
      id={`project-${index + 1}`}
      className="home_project_item"
    >
      <Link href={project.href} className="home_project_item_link">
        <div className="featured_project_wrapper">
          {/* Video Box */}
          <div className="featured_project_video_wrapper">
            <video 
              ref={videoRef}
              src={project.videoUrl}
              className="project-video"
              autoPlay
              muted
              loop
              playsInline
              poster={project.thumbnailUrl}
            />
          </div>
          
          {/* Info Overlay */}
          <div className="featured_project_info_wrapper">
             <div className="featured_project_titles_wrapper">
               <div className="featured_project_info_name">{project.title}</div>
               <div className="featured_project_info_client u-textstyle-body-main">
                 {project.client}
               </div>
             </div>
             <div className="featured_project_description_wrapper">
               <p className="featured_project_info_description">
                 {project.description}
               </p>
             </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

/* ─── Main Projects Section ─── */
export default function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const handleActive = useCallback((i: number) => setActiveIndex(i), [])

  return (
    <section className="projects_section">
      {/* Sticky Progress Counter (Left) */}
      <div className="progress_wrapper is--home">
        <div className="progress_list_wrapper">
          {featuredProjects.map((_, i) => (
            <a 
              key={i}
              href={`#project-${i + 1}`}
              className={`progress_counter${activeIndex === i ? ' active' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Vertical list of projects */}
      <div className="home_cms_wrapper">
        <div role="list" className="home_cms_list">
          {featuredProjects.map((project, i) => (
            <ProjectItem 
              key={project.id}
              project={project}
              index={i}
              isActive={activeIndex === i}
              onActive={handleActive}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
