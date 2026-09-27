import type { HomeSlide as HomeSlideRecord } from '../../../generated/prisma/client';
import { HomeSlide } from '../domain/home-slide.entity';

export function toHomeSlide(record: HomeSlideRecord): HomeSlide {
  return HomeSlide.create({
    // `id` is BIGINT in the database; slide counts stay far below Number.MAX_SAFE_INTEGER.
    id: Number(record.id),
    imageUrl: record.imageUrl,
    imagePublicId: record.imagePublicId,
    altText: record.altText,
    position: record.position,
  });
}
