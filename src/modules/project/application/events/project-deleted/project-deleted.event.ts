export class ProjectDeletedEvent {
  constructor(
    public readonly projectId: string,
    public readonly name: string,
  ) {}
}
