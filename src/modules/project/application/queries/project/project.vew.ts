export interface DetailProjectImageView {
  imageUrl: string
  coverPriority: number | null
}
export interface DetailProjectView {
  id: string
  name: string
  year: number | null | undefined
  location: string | null | undefined
  siteArea: number | null | undefined
  floorArea: number | null | undefined
  client: string | null | undefined
  photographer: string | null | undefined
  videoUrl: string | null | undefined
  projectImages: DetailProjectImageView[]
}
