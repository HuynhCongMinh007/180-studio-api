export interface ProjectImageResponse {
  imageUrl: string
  coverPriority: number | null
}

export interface ProjectResponse {
  id: string
  name: string
  year: number | null
  location: string | null
  siteArea: number | null
  floorArea: number | null
  client: string | null
  photographer: string | null
  videoUrl: string | null
  projectImages: ProjectImageResponse[]
}
