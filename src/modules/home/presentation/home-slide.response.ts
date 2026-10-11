import { HomeSlide } from '../domain/entities/home-slide.entity';

// Matches the `HomeSlide` / `AssetRef` contract in FE_NEXTJS_REBUILD_SPEC.md; optional fields are omitted, not null.
export interface AssetRefResponse {
  url: string;
  publicId?: string;
  alt?: string;
}

export interface HomeSlideResponse {
  id: number;
  image: AssetRefResponse;
  position: number;
}

export function toHomeSlideResponse(slide: HomeSlide): HomeSlideResponse {
  const image: AssetRefResponse = { url: slide.imageUrl };
  if (slide.imagePublicId !== null) image.publicId = slide.imagePublicId;
  if (slide.altText !== null) image.alt = slide.altText;

  return { id: slide.id, image, position: slide.position };
}
