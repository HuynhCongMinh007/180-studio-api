import { isHttpsUrl } from '../../../../lib/utils'
import { InvalidProjectImageError } from '../errors/project-image.errors'

// Limits that mirror the column types in prisma/schema.prisma.
export const PROJECT_IMAGE_URL_MAX_LENGTH = 1024
export const PROJECT_IMAGE_MAX_COVER_PRIORITY = 32767

export interface ProjectImageProps {
  imageUrl: string
  coverPriority: number | null
}
export class ProjectImage {
  private readonly _imageUrl: string
  private readonly _coverPriority: number | null

  private constructor(props: ProjectImageProps) {
    this._imageUrl = props.imageUrl
    this._coverPriority = props.coverPriority
  }
  get imageUrl(): string {
    return this._imageUrl
  }

  get coverPriority(): number | null {
    return this._coverPriority
  }

  static create(props: ProjectImageProps): ProjectImage {
    if (!isHttpsUrl(props.imageUrl)) {
      throw new InvalidProjectImageError('imageUrl must be a valid HTTPS URL')
    }
    if (props.imageUrl.length > PROJECT_IMAGE_URL_MAX_LENGTH) {
      throw new InvalidProjectImageError(
        `imageUrl must be at most ${PROJECT_IMAGE_URL_MAX_LENGTH} characters`,
      )
    }
    if (props.coverPriority !== null) {
      if (
        !Number.isInteger(props.coverPriority) ||
        props.coverPriority < 0 ||
        props.coverPriority > PROJECT_IMAGE_MAX_COVER_PRIORITY
      ) {
        throw new InvalidProjectImageError(
          `coverPriority must be null or an integer from 0 to ${PROJECT_IMAGE_MAX_COVER_PRIORITY}`,
        )
      }
    }
    return new ProjectImage(props)
  }
}
