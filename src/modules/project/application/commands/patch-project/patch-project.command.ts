import { Command } from '@nestjs/cqrs'
export type PatchProjectProps = {
  name?: string 
  year?: number | null
  location?: string | null
  siteArea?: number | null
  floorArea?: number | null
  client?: string | null
  photographer?: string | null
  videoUrl?: string | null
  projectImages?: {
    imageUrl: string
    coverPriority?: number | null
  }[]
}

export class PatchProjectCommand extends Command<null> {
  constructor(
    public readonly id: string,
    public readonly props: PatchProjectProps,
  ) {
    super()
  }
}
