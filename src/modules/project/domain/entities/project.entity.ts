import { isBlank, isHttpsUrl, isPresent } from '@/lib/utils'
import { InvalidProjectError } from '@/modules/project/domain/errors/project.errors'
import { ProjectImage } from '@/modules/project/domain/value-objects/project-image.vo'

export const PROJECT_MIN_YEAR = 1900
export const PROJECT_MAX_COVER_IMAGES = 10
export const PROJECT_MAX_IMAGES = 20
export const PROJECT_NAME_MAX_LENGTH = 255
export const PROJECT_LOCATION_MAX_LENGTH = 255
export const PROJECT_CLIENT_MAX_LENGTH = 255
export const PROJECT_PHOTOGRAPHER_MAX_LENGTH = 255
export const PROJECT_VIDEO_URL_MAX_LENGTH = 2048
export const PROJECT_AREA_MAX = 2_147_483_647

export interface ProjectProps {
  id: string
  name: string
  year: number | null | undefined
  location: string | null | undefined
  siteArea: number | null | undefined
  floorArea: number | null | undefined
  client: string | null | undefined
  photographer: string | null | undefined
  videoUrl: string | null | undefined
  projectImages: ProjectImage[]
}

export class Project {
  private readonly _id: string
  private readonly _name: string
  private readonly _year: number | null
  private readonly _location: string | null
  private readonly _siteArea: number | null
  private readonly _floorArea: number | null
  private readonly _client: string | null
  private readonly _photographer: string | null
  private readonly _videoUrl: string | null
  private readonly _projectImages: ProjectImage[]

  private constructor(props: ProjectProps) {
    this._id = props.id
    this._name = props.name
    this._year = props.year ?? null
    this._location = props.location ?? null
    this._siteArea = props.siteArea ?? null
    this._floorArea = props.floorArea ?? null
    this._client = props.client ?? null
    this._photographer = props.photographer ?? null
    this._videoUrl = props.videoUrl ?? null
    this._projectImages = props.projectImages
  }

  get id(): string {
    return this._id
  }

  get name(): string {
    return this._name
  }

  get year(): number | null {
    return this._year
  }

  get location(): string | null {
    return this._location
  }

  get siteArea(): number | null {
    return this._siteArea
  }

  get floorArea(): number | null {
    return this._floorArea
  }

  get client(): string | null {
    return this._client
  }

  get photographer(): string | null {
    return this._photographer
  }

  get videoUrl(): string | null {
    return this._videoUrl
  }

  get projectImages(): ProjectImage[] {
    return this._projectImages
  }

  static create(props: ProjectProps): Project {
    if (isBlank(props.name)) {
      throw new InvalidProjectError('name must not be empty')
    }
    if (props.name.length > PROJECT_NAME_MAX_LENGTH) {
      throw new InvalidProjectError(
        `name must be at most ${PROJECT_NAME_MAX_LENGTH} characters`,
      )
    }
    if (props.projectImages.length === 0) {
      throw new InvalidProjectError('project must have at least one image')
    }
    if (props.projectImages.length > PROJECT_MAX_IMAGES) {
      throw new InvalidProjectError(
        `project must have at most ${PROJECT_MAX_IMAGES} images`,
      )
    }
    const coverPriorities = props.projectImages
      .map((image) => image.coverPriority)
      .filter(isPresent)
    if (coverPriorities.length === 0) {
      throw new InvalidProjectError(
        'project must have at least one cover image (coverPriority is not null)',
      )
    }
    if (coverPriorities.length > PROJECT_MAX_COVER_IMAGES) {
      throw new InvalidProjectError(
        `project must have at most ${PROJECT_MAX_COVER_IMAGES} cover images`,
      )
    }
    if (new Set(coverPriorities).size !== coverPriorities.length) {
      throw new InvalidProjectError(
        'coverPriority must be unique within a project',
      )
    }
    const currentYear = new Date().getFullYear()
    if (
      isPresent(props.year) &&
      (!Number.isInteger(props.year) ||
        props.year < PROJECT_MIN_YEAR ||
        props.year > currentYear)
    ) {
      throw new InvalidProjectError(
        `year must be an integer between ${PROJECT_MIN_YEAR} and ${currentYear}`,
      )
    }
    if (isPresent(props.location)) {
      if (isBlank(props.location)) {
        throw new InvalidProjectError('location must not be empty')
      }
      if (props.location.length > PROJECT_LOCATION_MAX_LENGTH) {
        throw new InvalidProjectError(
          `location must be at most ${PROJECT_LOCATION_MAX_LENGTH} characters`,
        )
      }
    }
    if (
      isPresent(props.siteArea) &&
      (!Number.isInteger(props.siteArea) ||
        props.siteArea <= 0 ||
        props.siteArea > PROJECT_AREA_MAX)
    ) {
      throw new InvalidProjectError(
        `siteArea must be a positive integer up to ${PROJECT_AREA_MAX}`,
      )
    }
    if (
      isPresent(props.floorArea) &&
      (!Number.isInteger(props.floorArea) ||
        props.floorArea <= 0 ||
        props.floorArea > PROJECT_AREA_MAX)
    ) {
      throw new InvalidProjectError(
        `floorArea must be a positive integer up to ${PROJECT_AREA_MAX}`,
      )
    }
    if (isPresent(props.client)) {
      if (isBlank(props.client)) {
        throw new InvalidProjectError('client must not be empty')
      }
      if (props.client.length > PROJECT_CLIENT_MAX_LENGTH) {
        throw new InvalidProjectError(
          `client must be at most ${PROJECT_CLIENT_MAX_LENGTH} characters`,
        )
      }
    }
    if (isPresent(props.photographer)) {
      if (isBlank(props.photographer)) {
        throw new InvalidProjectError('photographer must not be empty')
      }
      if (props.photographer.length > PROJECT_PHOTOGRAPHER_MAX_LENGTH) {
        throw new InvalidProjectError(
          `photographer must be at most ${PROJECT_PHOTOGRAPHER_MAX_LENGTH} characters`,
        )
      }
    }
    if (isPresent(props.videoUrl)) {
      if (!isHttpsUrl(props.videoUrl)) {
        throw new InvalidProjectError('videoUrl must be a valid HTTPS URL')
      }
      if (props.videoUrl.length > PROJECT_VIDEO_URL_MAX_LENGTH) {
        throw new InvalidProjectError(
          `videoUrl must be at most ${PROJECT_VIDEO_URL_MAX_LENGTH} characters`,
        )
      }
    }

    return new Project(props)
  }
}
