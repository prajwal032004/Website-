'use client'

import Link from 'next/link'

const awardsData = [
  { nomination: 'Nominated "Best Imaging"', year: '2026', giver: 'MIMA', project: 'Eurojackpot', href: '/projects/eurojackpot-knvb-beker' },
  { nomination: 'Nominated "Best Original Composition Experience"', year: '2025', giver: 'MIMA', project: 'Overwatch Champions Series', href: '/projects/champions-series' },
  { nomination: 'Nominated "Best Original Composition In a Cinematic"', year: '2025', giver: 'Music+Sound Awards', project: 'The Hunt Begins', href: '/projects/the-hunt-begins' },
  { nomination: 'Nominated "Best Original Music in a Trailer"', year: '2024', giver: 'MIMA', project: 'De Vuurlinie', href: '/projects/de-vuurlinie' },
  { nomination: 'Nominated "Best Original Composition In Advertising"', year: '2024', giver: 'Music+Sound Awards', project: "Women's EURO 2024", href: '/projects/uefa-womens-euro-2024-euronics' },
  { nomination: 'Nominated "Best Score in Short Film"', year: '2023', giver: 'MIMA', project: 'Kiriko', href: '/projects/kiriko' },
  { nomination: 'Won "Best Radio- and Podcast Imaging"', year: '2021', giver: 'Buma/Stemra', project: 'One To Watch', href: '/projects/one-to-watch' },
]

export default function AwardsSection() {
  return (
    <div data-awards="wrap" className="awards_section">
      <div data-awards="title" className="awards_title">recognition</div>
      
      <div className="awards_list_wrapper">
        <div role="list" className="awards_list">
          {awardsData.map((award, i) => (
            <div key={i} className="awards_item_wrapper">
              <div className="award1_item_wrapper">
                <div className="awards_item_info_wrapper">
                  <div data-awards="info" className="awards-item-name-award u-textstyle-awards u-textstyle-caps">
                    {award.nomination}
                  </div>
                  <div data-awards="info" className="awards_item_year u-textstyle-awards">
                    {award.year}
                  </div>
                  <div data-awards="project" className="awards-giver-text u-textstyle-awards">
                    {award.giver}
                  </div>
                  <Link href={award.href} className="awards_item_name_project u-textstyle-body-main">
                    {award.project}
                  </Link>
                </div>
              </div>
            </div>
          ))}
          
          {/* Static historic awards */}
          <div className="static_awards_wrapper">
            <div className="award1_item_wrapper">
              <div className="awards_item_info_wrapper">
                <div data-awards="info" className="awards-item-name-award u-textstyle-awards u-textstyle-caps">nominated "best original music in advertising"</div>
                <div data-awards="info" className="awards_item_year u-textstyle-awards">2019</div>
                <div data-awards="project" className="awards-giver-text u-textstyle-awards">Buma/Stemra</div>
                <div className="awards_item_name_project u-textstyle-body-main">YoungCapital</div>
              </div>
            </div>
            <div className="award1_item_wrapper">
              <div className="awards_item_info_wrapper">
                <div data-awards="info" className="awards-item-name-award u-textstyle-awards u-textstyle-caps">nominated "best original music in a trailer"</div>
                <div data-awards="info" className="awards_item_year u-textstyle-awards">2018</div>
                <div data-awards="project" className="awards-giver-text u-textstyle-awards">Buma/Stemra</div>
                <div className="awards_item_name_project u-textstyle-body-main">Rebirth Festival</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}