import { ApplicationError } from "@/shared/application/application.error"

export class ProjectNotFoundError extends ApplicationError {
  readonly code = 'PROJECT_NOT_FOUND'
  readonly kind = 'not_found'

  constructor(projectId: string) {
    super(`Project ${projectId} not found`)
    this.name = 'ProjectNotFoundError'
  }
}