import { isBlank, isHttpsUrl, isPresent } from '@/lib/utils'
import { InvalidProjectError } from '@/modules/project/domain/errors/project.errors'
import { ProjectImage } from '@/modules/project/domain/value-objects/project-image.vo'

export const PROJECT_MIN_YEAR = 1900

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
    if (isPresent(props.location) && isBlank(props.location)) {
      throw new InvalidProjectError('location must not be empty')
    }
    if (isPresent(props.siteArea) && !(props.siteArea > 0)) {
      throw new InvalidProjectError('siteArea must be greater than 0')
    }
    if (isPresent(props.floorArea) && !(props.floorArea > 0)) {
      throw new InvalidProjectError('floorArea must be greater than 0')
    }
    if (isPresent(props.client) && isBlank(props.client)) {
      throw new InvalidProjectError('client must not be empty')
    }
    if (isPresent(props.photographer) && isBlank(props.photographer)) {
      throw new InvalidProjectError('photographer must not be empty')
    }
    if (isPresent(props.videoUrl) && !isHttpsUrl(props.videoUrl)) {
      throw new InvalidProjectError('videoUrl must be a valid HTTPS URL')
    }

    return new Project(props)
  }
}
