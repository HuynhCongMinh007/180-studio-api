import { Logger } from '@nestjs/common'
import { ICommand, ICommandPublisher } from '@nestjs/cqrs'

// Replaces the default in-memory command publisher (`commandPublisher` option of
// `CqrsModule.forRoot()`). CommandBus calls publish() right before it runs the
// handler. Only the command name is logged, never its data.
export class LoggingCommandPublisher implements ICommandPublisher {
  private readonly logger = new Logger('CommandBus')

  publish<T extends ICommand = ICommand>(command: T): void {
    this.logger.log(`Dispatch ${command.constructor.name}`)
  }
}