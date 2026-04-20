'use client'

import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import SoundSection from '@/components/SoundSection'
import ProjectsSection from '@/components/ProjectsSection'
import MoreProjectsMarquee from '@/components/MoreProjectsMarquee'
import ServicesSection from '@/components/ServicesSection'
import AwardsSection from '@/components/AwardsSection'
import Footer from '@/components/Footer'
import { useScrollReveal, useParallax } from '@/hooks/useScrollReveal'

export default function HomePage() {
  useScrollReveal()
  useParallax()

  return (
    <main className="body">
      {/* 1. Hero: International Music Agency (Full-screen) */}
      <HeroSection />

      {/* 2. About: "by RAVEN is an international..." */}
      <AboutSection />

      {/* 3. Sound: "Our sound isn't subtle..." (Scroll triggered) */}
      <SoundSection />

      {/* 4. Projects: Sticky nav + vertical list of featured videos */}
      <ProjectsSection />

      {/* 5. More Projects Marquee (Auto-scrolling ticker) */}
      <MoreProjectsMarquee />

      {/* 6. Services: Accordion list (Original Music, etc.) */}
      <ServicesSection />

      {/* 7. Awards: "recognition" list */}
      <AwardsSection />

      {/* 8. Premium Image-Sequence Footer */}
      <Footer />
    </main>
  )
}