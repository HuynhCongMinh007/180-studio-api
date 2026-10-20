export interface ProjectView {
  id: string
  name: string
  imageUrl: string | null
}

export interface ListProjectsView {
  items: ProjectView[]
  total: number
}
