import { Command } from '@nestjs/cqrs'

export class CreateProjectCommand extends Command<string> {
  constructor(
    public readonly name: string,
    public readonly year: number | null | undefined,
    public readonly location: string | null | undefined,
    public readonly siteArea: number | null | undefined,
    public readonly floorArea: number | null | undefined,
    public readonly client: string | null | undefined,
    public readonly photographer: string | null | undefined,
    public readonly videoUrl: string | null | undefined,
    public readonly projectImages: {
      imageUrl: string
      coverPriority: number | null
    }[],
  ) {
    super()
  }
}
