export interface Project {
  id: string
  title: string
  client: string
  description: string
  href: string
  videoUrl: string
  audioUrl: string
  thumbnailUrl: string
}

export const featuredProjects: Project[] = [
  {
    id: 'battlefield-6',
    title: 'Battlefield 6',
    client: 'Electronic Arts',
    description:
      'We cranked up the percussion for the Battlefield 6 Single Player Campaign trailer. Bringing the thunder to the battlefield.',
    href: '/projects/battlefield-6',
    videoUrl: 'https://byraven.b-cdn.net/Videos/Shorts/Battlefield_6_short.mp4',
    audioUrl: 'https://byraven.b-cdn.net/Audio/Battlefield%206%20Official%20Campaign%20Trailer.mp3',
    thumbnailUrl: 'https://vz-03ab8796-bb5.b-cdn.net/4ed45170-4162-4c8a-a3e4-9d5d33d888c3/thumbnail.jpg',
  },
  {
    id: 'eclipse-cross',
    title: 'Eclipse Cross',
    client: 'Mitsubishi',
    description:
      'We composed the soundtrack for the European launch of the all-electric Mitsubishi Eclipse Cross, merging organic and electronic elements to create a futuristic soundscape.',
    href: '/projects/eclipse-cross',
    videoUrl: 'https://byraven.b-cdn.net/Videos/Shorts/Mitsubishi_Eclipse_short.mp4',
    audioUrl: 'https://byraven.b-cdn.net/Audio/MME_AJS_ECLIPSE%20CROSS_RED%20DESIGN_GRADED%20-%20Audio%20v9.00.mp3',
    thumbnailUrl: 'https://vz-03ab8796-bb5.b-cdn.net/14b5239f-d63c-4ec1-aa2c-75b917f9b14e/thumbnail.jpg',
  },
  {
    id: 'carrera-911-t',
    title: '911 CARRERA T',
    client: 'Porsche',
    description:
      'We composed a soundtrack that captures the spirit of the latest Porsche Carrera 911 T. Ethereal sounds add a dreamy and otherworldly feel to the commercial. Sportmade.',
    href: '/projects/carrera-911-t',
    videoUrl: 'https://byraven.b-cdn.net/Videos/Shorts/Porsche_short_optimized_cut.mp4',
    audioUrl: 'https://byraven.b-cdn.net/Audio/PORSCHE%20Music%20Only%20v2.mp3',
    thumbnailUrl: 'https://vz-03ab8796-bb5.b-cdn.net/38feab4c-0830-46f8-977c-e95425ac411a/thumbnail.jpg',
  },
  {
    id: 'uefa-women-s-euro-euronics',
    title: "Women's EURO 2025",
    client: 'UEFA & Euronics',
    description:
      'We composed a pumped-up soundtrack with custom vocals from Julisa and handled all the audio post for this hype-filled UEFA x Euronics film.',
    href: '/projects/uefa-women-s-euro-euronics',
    videoUrl: 'https://byraven.b-cdn.net/Videos/Shorts/EJP%20KNVB%20short_1.mp4',
    audioUrl: 'https://byraven.b-cdn.net/Videos/Music%20Only/UEFA%20Womens%20Euro%202025%20-%20Music%20Only.mp3',
    thumbnailUrl: 'https://vz-03ab8796-bb5.b-cdn.net/8a42d2fc-8fd6-4b70-88af-40d88d08d8f6/thumbnail_c9adbb4f.jpg',
  },
]

export const allProjects: Project[] = [
  ...featuredProjects,
  {
    id: 'ioniq-5n',
    title: 'Ioniq 5 N',
    client: 'Hyundai',
    description: 'Electrifying sound for the Hyundai Ioniq 5 N.',
    href: '/projects/ioniq-5n',
    videoUrl: 'https://byraven.b-cdn.net/Videos/Shorts/Hyundai_Ioniq_5N_short.mp4',
    audioUrl: 'https://byraven.b-cdn.net/Audio/Hyundaio%20IONIQ%205N_H.264_MP3_320.mp3',
    thumbnailUrl: 'https://vz-03ab8796-bb5.b-cdn.net/518488cb-0b4b-4751-b526-d8a8e6d2a2d7/thumbnail_45d8c27f.jpg',
  },
  {
    id: 'lollipop-racing',
    title: 'Lollipop Racing',
    client: 'Feature',
    description: 'High-octane music for Lollipop Racing.',
    href: '/projects/lollipop-racing',
    videoUrl: 'https://byraven.b-cdn.net/Videos/Shorts/Lollipop_Racing_short.mp4',
    audioUrl: 'https://byraven.b-cdn.net/Audio/Lollipop%20Racing_H.264_MP3_320.mp3',
    thumbnailUrl: 'https://vz-03ab8796-bb5.b-cdn.net/c58c0fe2-2814-4425-a4a0-c9075b6779ac/thumbnail_9ccbbd67.jpg',
  },
  {
    id: 'vendetta-cinematic',
    title: 'Vendetta',
    client: 'Overwatch 2',
    description: 'Cinematic score for the Overwatch 2 Vendetta hero trailer.',
    href: '/projects/vendetta-cinematic',
    videoUrl: 'https://byraven.b-cdn.net/Videos/Shorts/Vendetta_short.mp4',
    audioUrl: 'https://byraven.b-cdn.net/Audio/Overwatch%202%20Vendetta%20Hero%20(music%20only).mp3',
    thumbnailUrl: 'https://vz-03ab8796-bb5.b-cdn.net/2d122870-2d86-4011-87f4-bd4bb6d10514/thumbnail_de8268db.jpg',
  },
  {
    id: 'black-ops-7',
    title: 'Black Ops 7',
    client: 'Call of Duty',
    description: 'Intense score for Call of Duty Black Ops 7.',
    href: '/projects/black-ops-7',
    videoUrl: 'https://byraven.b-cdn.net/Videos/Shorts/Black_Ops_short.mp4',
    audioUrl: 'https://byraven.b-cdn.net/Audio/Call%20of%20Duty%20Black%20Ops%207_H.264_MP3_320.mp3',
    thumbnailUrl: 'https://vz-03ab8796-bb5.b-cdn.net/409c3d6a-299b-4afb-9457-04e410bd7b2a/thumbnail.jpg',
  },
]