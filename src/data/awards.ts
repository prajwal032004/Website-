export interface Award {
  id: string
  nomination: string
  year: string
  giver: string
  project: string
  projectHref?: string
}

export const awards: Award[] = [
  {
    id: '1',
    nomination: 'Nominated "Best Imaging"',
    year: '2026',
    giver: 'MIMA',
    project: 'Eurojackpot',
    projectHref: '/projects/eurojackpot-knvb-beker',
  },
  {
    id: '2',
    nomination: 'Nominated "Best Original Composition Experience"',
    year: '2025',
    giver: 'MIMA',
    project: 'Overwatch Champions Series',
    projectHref: '/projects/champions-series',
  },
  {
    id: '3',
    nomination: 'Nominated "Best Original Composition In a Cinematic"',
    year: '2025',
    giver: 'Music+Sound Awards',
    project: 'The Hunt Begins',
    projectHref: '/projects/the-hunt-begins',
  },
  {
    id: '4',
    nomination: 'Nominated "Best Original Music in a Trailer"',
    year: '2024',
    giver: 'MIMA',
    project: 'De Vuurlinie',
    projectHref: '/projects/de-vuurlinie',
  },
  {
    id: '5',
    nomination: 'Nominated "Best Original Composition In Advertising"',
    year: '2024',
    giver: 'Music+Sound Awards',
    project: "Women's EURO 2024",
    projectHref: '/projects/uefa-womens-euro-2024-euronics',
  },
  {
    id: '6',
    nomination: 'Nominated "Best Score in Short Film"',
    year: '2023',
    giver: 'MIMA',
    project: 'Kiriko',
    projectHref: '/projects/kiriko',
  },
  {
    id: '7',
    nomination: 'Nominated "Best Score in Animated Short Film"',
    year: '2023',
    giver: 'Hollywood Music In Media Awards',
    project: 'Kiriko',
    projectHref: '/projects/kiriko',
  },
  {
    id: '8',
    nomination: 'Won "Best Radio- and Podcast Imaging"',
    year: '2021',
    giver: 'Buma/Stemra',
    project: 'One To Watch',
    projectHref: '/projects/one-to-watch',
  },
  {
    id: '9',
    nomination: 'Nominated "Best Original Music in Advertising"',
    year: '2019',
    giver: 'Buma/Stemra',
    project: 'YoungCapital',
  },
  {
    id: '10',
    nomination: 'Nominated "Best Original Music in a Trailer"',
    year: '2018',
    giver: 'Buma/Stemra',
    project: 'Rebirth Festival',
  },
  {
    id: '11',
    nomination: 'Won "Best Original Music in Advertising"',
    year: '2018',
    giver: 'Buma/Stemra',
    project: 'Oergebied De Maashorst',
  },
]