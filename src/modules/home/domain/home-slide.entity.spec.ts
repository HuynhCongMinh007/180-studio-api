import { HomeSlide, HomeSlideProps } from './home-slide.entity';
import { InvalidHomeSlideError } from './home-slide.errors';

const validProps: HomeSlideProps = {
  id: 1,
  imageUrl: 'https://res.cloudinary.com/demo/image/upload/slide.jpg',
  imagePublicId: 'portfolio/home-slides/slide',
  altText: 'Living room',
  position: 0,
};

describe('HomeSlide', () => {
  it('creates a slide from valid props', () => {
    const slide = HomeSlide.create(validProps);

    expect(slide.id).toBe(1);
    expect(slide.position).toBe(0);
  });

  it.each(['', 'not-a-url', 'http://example.com/slide.jpg'])(
    'rejects a non-HTTPS image URL: %p',
    (imageUrl) => {
      expect(() => HomeSlide.create({ ...validProps, imageUrl })).toThrow(
        InvalidHomeSlideError,
      );
    },
  );

  it.each([-1, 1.5])('rejects an invalid position: %p', (position) => {
    expect(() => HomeSlide.create({ ...validProps, position })).toThrow(
      InvalidHomeSlideError,
    );
  });

  it('rejects alt text longer than 500 characters', () => {
    expect(() =>
      HomeSlide.create({ ...validProps, altText: 'a'.repeat(501) }),
    ).toThrow(InvalidHomeSlideError);
  });
});
