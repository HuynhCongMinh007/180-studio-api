export interface ProjectDetailImageView {
  imageUrl: string
  coverPriority: number | null
}

export interface ProjectDetailView {
  id: string
  name: string
  year: number | null
  location: string | null
  siteArea: number | null
  floorArea: number | null
  client: string | null
  photographer: string | null
  videoUrl: string | null
  projectImages: ProjectDetailImageView[]
}
