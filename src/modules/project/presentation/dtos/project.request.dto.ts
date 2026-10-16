import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

export class ProjectImageRequest {
  @IsString()
  imageUrl: string

  @IsOptional()
  @IsNumber()
  coverPriority?: number
}

export class CreateProjectRequest {
  @IsString()
  name: string

  @IsOptional()
  @IsNumber()
  year?: number

  @IsOptional()
  @IsString()
  location?: string

  @IsOptional()
  @IsNumber()
  siteArea?: number

  @IsOptional()
  @IsNumber()
  floorArea?: number

  @IsOptional()
  @IsString()
  client?: string

  @IsOptional()
  @IsString()
  photographer?: string

  @IsOptional()
  @IsString()
  videoUrl?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectImageRequest)
  projectImages: ProjectImageRequest[]
}
