import { decimalToNumber } from '@/lib/utils/decimal.util'
import { Project } from '@/modules/project/domain/entities/project.entity'
import { ProjectImage } from '@/modules/project/domain/value-objects/project-image.vo'
import { ProjectWithImagesRecord } from '@/modules/project/infrastructure/records/project.record'
import { DomainError } from '@/shared/domain/domain.error'

export function toProject(record: ProjectWithImagesRecord): Project {
  try {
    const projectImages: ProjectImage[] = []
    for (const imageRecord of record.projectImages) {
      const projectImage: ProjectImage = ProjectImage.create({
        imageUrl: imageRecord.imageUrl,
        coverPriority: imageRecord.coverPriority,
      })
      projectImages.push(projectImage)
    }

    return Project.create({
      id: record.id,
      name: record.name,
      year: record.year,
      location: record.location,
      siteArea: decimalToNumber(record.siteArea),
      floorArea: decimalToNumber(record.floorArea),
      client: record.client,
      photographer: record.photographer,
      videoUrl: record.videoUrl,
      projectImages: projectImages,
    })
  } catch (error) {
    if (error instanceof DomainError) {
      throw new Error(
        `Corrupt project record (id=${record.id}): ${error.message}`,
        { cause: error },
      )
    }
    throw error
  }
}
