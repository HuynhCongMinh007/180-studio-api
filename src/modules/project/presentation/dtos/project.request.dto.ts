import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import {
  PROJECT_AREA_MAX,
  PROJECT_CLIENT_MAX_LENGTH,
  PROJECT_LOCATION_MAX_LENGTH,
  PROJECT_MAX_COVER_IMAGES,
  PROJECT_MAX_IMAGES,
  PROJECT_NAME_MAX_LENGTH,
  PROJECT_PHOTOGRAPHER_MAX_LENGTH,
  PROJECT_VIDEO_URL_MAX_LENGTH,
} from '@/modules/project/domain/entities/project.entity'
import {
  PROJECT_IMAGE_MAX_COVER_PRIORITY,
  PROJECT_IMAGE_URL_MAX_LENGTH,
} from '@/modules/project/domain/value-objects/project-image.vo'
import { HasCoverImage } from '../validators/has-cover-image.validator'
import {
  MaxCoverImages,
  UniqueCoverPriorities,
} from '../validators/cover-priority.validators'

export class ProjectImageRequest {
  @IsString()
  @MaxLength(PROJECT_IMAGE_URL_MAX_LENGTH)
  imageUrl: string

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(PROJECT_IMAGE_MAX_COVER_PRIORITY)
  coverPriority?: number
}

export class CreateProjectRequest {
  @IsString()
  @MaxLength(PROJECT_NAME_MAX_LENGTH)
  name: string

  @IsOptional()
  @IsNumber()
  year?: number

  @IsOptional()
  @IsString()
  @MaxLength(PROJECT_LOCATION_MAX_LENGTH)
  location?: string

  @IsOptional()
  @IsNumber()
  @Max(PROJECT_AREA_MAX)
  siteArea?: number

  @IsOptional()
  @IsNumber()
  @Max(PROJECT_AREA_MAX)
  floorArea?: number

  @IsOptional()
  @IsString()
  @MaxLength(PROJECT_CLIENT_MAX_LENGTH)
  client?: string

  @IsOptional()
  @IsString()
  @MaxLength(PROJECT_PHOTOGRAPHER_MAX_LENGTH)
  photographer?: string

  @IsOptional()
  @IsString()
  @MaxLength(PROJECT_VIDEO_URL_MAX_LENGTH)
  videoUrl?: string

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(PROJECT_MAX_IMAGES)
  @HasCoverImage()
  @MaxCoverImages(PROJECT_MAX_COVER_IMAGES)
  @UniqueCoverPriorities()
  @ValidateNested({ each: true })
  @Type(() => ProjectImageRequest)
  projectImages: ProjectImageRequest[]
}
