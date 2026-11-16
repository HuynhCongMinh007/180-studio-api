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
  ValidateIf,
  ValidateNested,
} from 'class-validator'
import { HasCoverImage } from '../validators/has-cover-image.validator'
import {
  MaxCoverImages,
  UniqueCoverPriorities,
} from '../validators/cover-priority.validators'
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
} from '../../domain/entities/project.entity'
import { ProjectImageRequest } from '@/modules/project/presentation/dtos/create-project.request.dto'

export class PatchProjectRequest {
  @IsOptional()
  @IsString()
  @MaxLength(PROJECT_NAME_MAX_LENGTH)
  name?: string

  @IsOptional()
  @IsNumber()
  year?: number | null

  @IsOptional()
  @IsString()
  @MaxLength(PROJECT_LOCATION_MAX_LENGTH)
  location?: string | null

  @IsOptional()
  @IsNumber()
  @Max(PROJECT_AREA_MAX)
  siteArea?: number | null

  @IsOptional()
  @IsNumber()
  @Max(PROJECT_AREA_MAX)
  floorArea?: number | null

  @IsOptional()
  @IsString()
  @MaxLength(PROJECT_CLIENT_MAX_LENGTH)
  client?: string | null

  @IsOptional()
  @IsString()
  @MaxLength(PROJECT_PHOTOGRAPHER_MAX_LENGTH)
  photographer?: string | null

  @IsOptional()
  @IsString()
  @MaxLength(PROJECT_VIDEO_URL_MAX_LENGTH)
  videoUrl?: string | null

  @ValidateIf((_, value) => value !== undefined)
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(PROJECT_MAX_IMAGES)
  @HasCoverImage()
  @MaxCoverImages(PROJECT_MAX_COVER_IMAGES)
  @UniqueCoverPriorities()
  @ValidateNested({ each: true })
  @Type(() => ProjectImageRequest)
  projectImages?: ProjectImageRequest[]
}
