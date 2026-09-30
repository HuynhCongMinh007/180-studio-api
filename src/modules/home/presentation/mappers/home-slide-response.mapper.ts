import { HomeSlide } from '../../domain/entities/home-slide.entity';
import { AssetRefResponse, HomeSlideResponse } from '../dtos/home-slide.response.dto';

export function toHomeSlideResponse(slide: HomeSlide): HomeSlideResponse {
  const image: AssetRefResponse = { url: slide.imageUrl };
  if (slide.imagePublicId !== null) image.publicId = slide.imagePublicId;
  if (slide.altText !== null) image.alt = slide.altText;

  return { id: slide.id, image, position: slide.position };
}
