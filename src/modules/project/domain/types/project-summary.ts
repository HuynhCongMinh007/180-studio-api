export interface ProjectSummary {
  id: string
  name: string
  projectImages: {
    imageUrl: string
    coverPriority: number | null
  }[]
}

export interface ProjectDetail {
  id: string
  name: string
  year: number | null
  location: string | null
  siteArea: number | null
  floorArea: number | null
  client: string | null
  photographer: string | null
  videoUrl: string | null
  projectImages: {
    imageUrl: string
    coverPriority: number | null
  }[]
}
