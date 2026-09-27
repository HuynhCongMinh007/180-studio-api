import { HomeSlide } from './home-slide.entity';

// Port: implemented in infrastructure. An abstract class (not an interface) so Nest can use it as the DI token.
export abstract class HomeSlideRepository {
  /** All slides sorted by `position ASC, id ASC` (spec §6.2). */
  abstract findAllOrdered(): Promise<HomeSlide[]>;
}
