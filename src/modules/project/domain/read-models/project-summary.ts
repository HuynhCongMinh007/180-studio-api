export interface ProjectSummary {
  id: string
  name: string
  projectImages: {
    imageUrl: string
    coverPriority: number | null
  }[]
}
