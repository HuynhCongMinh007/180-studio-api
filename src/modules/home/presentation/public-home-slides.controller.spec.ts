import { Test } from '@nestjs/testing';
import { ListHomeSlidesUseCase } from '../application/list-home-slides.use-case';
import { HomeSlide } from '../domain/entities/home-slide.entity';
import { HomeSlideRepository } from '../domain/repositories/home-slide.repository';
import { PublicHomeSlidesController } from './public-home-slides.controller';

class InMemoryHomeSlideRepository extends HomeSlideRepository {
  constructor(private readonly slides: HomeSlide[]) {
    super();
  }

  findAllOrdered(): Promise<HomeSlide[]> {
    return Promise.resolve(this.slides);
  }
}

async function createController(slides: HomeSlide[]) {
  const moduleRef = await Test.createTestingModule({
    controllers: [PublicHomeSlidesController],
    providers: [
      ListHomeSlidesUseCase,
      {
        provide: HomeSlideRepository,
        useValue: new InMemoryHomeSlideRepository(slides),
      },
    ],
  }).compile();

  return moduleRef.get(PublicHomeSlidesController);
}

describe('PublicHomeSlidesController', () => {
  it('returns an empty array when there are no slides', async () => {
    const controller = await createController([]);

    await expect(controller.list()).resolves.toEqual([]);
  });

  it('maps slides to the AssetRef contract and omits missing optional fields', async () => {
    const controller = await createController([
      HomeSlide.create({
        id: 8,
        imageUrl: 'https://example.com/a.jpg',
        imagePublicId: 'portfolio/home-slides/a',
        altText: 'Facade',
        position: 0,
      }),
      HomeSlide.create({
        id: 3,
        imageUrl: 'https://example.com/b.jpg',
        imagePublicId: null,
        altText: null,
        position: 1,
      }),
    ]);

    await expect(controller.list()).resolves.toEqual([
      {
        id: 8,
        image: {
          url: 'https://example.com/a.jpg',
          publicId: 'portfolio/home-slides/a',
          alt: 'Facade',
        },
        position: 0,
      },
      { id: 3, image: { url: 'https://example.com/b.jpg' }, position: 1 },
    ]);
  });
});
