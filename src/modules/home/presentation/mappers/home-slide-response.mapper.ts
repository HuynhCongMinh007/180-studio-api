import { HomeSlideView } from '../../application/queries/list-home-slides/home-slide.view'
import {
  AssetRefResponse,
  HomeSlideResponse,
} from '../dtos/home-slide.response.dto'

export function toHomeSlideResponse(view: HomeSlideView): HomeSlideResponse {
  const image: AssetRefResponse = { url: view.imageUrl }
  return { id: view.id, image, position: view.position }
}
