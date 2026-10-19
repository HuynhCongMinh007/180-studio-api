import { Command } from '@nestjs/cqrs'

export class DeleteProjectCommand extends Command<any> {
  constructor(public readonly projectId: string) {
    super()
  }
}
