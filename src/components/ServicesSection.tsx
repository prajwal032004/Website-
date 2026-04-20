'use client'

import { useState } from 'react'

const services = [
  {
    title: 'original music',
    description: "It's our thing. Blending genres, mixing eras, and syncing it all perfectly to picture. Every note matters, and we make sure it hits just right. From the first cue to the final frame, we craft sound that tells your story.",
  },
  {
    title: 'music production',
    description: "Cinema-ready music isn’t just about volume, it’s about impact. We design sound that moves with the picture, hits the emotional cues, and delivers that larger-than-life feel.",
  },
  {
    title: 'sonic branding',
    description: "Stand out from the noise with a tailor made sound for your brand. We dive into your brand’s identity and translate it into a unique sonic language. Something that feels like you, but sounds unforgettable.",
  },
  {
    title: 'sound design',
    description: "We use sound design to inject energy, emotion, and realism into every frame, so the visuals don’t just look good, they feel powerful. Every sound is crafted to hit hard and pull you right through the screen.",
  },
  {
    title: 'post production',
    description: "Whether it’s set noise, a voiceover, or a brand sound, we shape it to perfection. Our mix process ensures everything sounds polished, balanced, and broadcast-ready.",
  },
]

export default function ServicesSection() {
  const [openId, setOpenId] = useState<number | null>(null)

  return (
    <section className="services_section">
        {/* Main large heading */}
        <div className="services_title_wrapper">
           <h2 className="dynamic-heading u-textstyle-caps u-textalign-center">services</h2>
        </div>

        <div className="services_accordion_wrapper">
          <ul role="list" className="list w-list-unstyled">
            {services.map((service, index) => {
              const isOpen = openId === index
              return (
                <li key={index} className="accordion-list-item" data-accordion-status={isOpen ? "active" : "not-active"}>
                  <div 
                    className="accordion_item_header" 
                    onClick={() => setOpenId(isOpen ? null : index)}
                    role="button"
                  >
                    <div className="text-body-medium u-textstyle-caps">{service.title}</div>
                    
                    {/* Toggle Button Wrapper */}
                    <div className="button_main_wrapper">
                        <div className="button_main_toggle"></div>
                        <div className="button_text u-textalign-center">more info</div>
                        <div className="button_text is--left">less info</div>
                    </div>
                  </div>

                  <div className="accordion_item_info" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                    <div className="accordion_item_info_wrapper">
                      <div className="accordion-item_content">
                        <p className="accordion_item_info-text u-textstyle-body-small" style={{ opacity: isOpen ? 1 : 0 }}>
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
    </section>
  )
}