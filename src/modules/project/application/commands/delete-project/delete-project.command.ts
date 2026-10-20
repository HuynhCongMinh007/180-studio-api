import { Command } from '@nestjs/cqrs'

export class DeleteProjectCommand extends Command<{ projectId: string }> {
  constructor(public readonly projectId: string) {
    super()
  }
}
