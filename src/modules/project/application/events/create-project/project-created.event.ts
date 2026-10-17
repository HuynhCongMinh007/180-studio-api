export class ProjectCreatedEvent {
  constructor(
    public readonly name: string,
    public readonly projectId: string,
  ) {}
}
