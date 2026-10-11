
import type { HomeSlide as HomeSlideRecord } from '../../../../generated/prisma/client';
import { DomainError } from '../../../../shared/domain/domain.error';
import { HomeSlide } from '../../domain/entities/home-slide.entity';

export function toHomeSlide(record: HomeSlideRecord): HomeSlide {
  try {
    return HomeSlide.create({
      id: Number(record.id),
      imageUrl: record.imageUrl,
      position: record.position,
    });
  } catch (error) {
    if (error instanceof DomainError) {
      throw new Error(
        `Corrupt home slide record (id=${record.id}): ${error.message}`,
        { cause: error },
      );
    }
    throw error;
  }
}
