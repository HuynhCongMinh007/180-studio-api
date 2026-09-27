import { InvalidHomeSlideError } from './home-slide.errors';

export const HOME_SLIDE_ALT_TEXT_MAX_LENGTH = 500;

export interface HomeSlideProps {
  id: number;
  imageUrl: string;
  imagePublicId: string | null;
  altText: string | null;
  position: number;
}

export class HomeSlide {
  private constructor(private readonly props: HomeSlideProps) {}

  static create(props: HomeSlideProps): HomeSlide {
    if (!isHttpsUrl(props.imageUrl)) {
      throw new InvalidHomeSlideError('imageUrl must be a valid HTTPS URL');
    }
    if (!Number.isInteger(props.position) || props.position < 0) {
      throw new InvalidHomeSlideError(
        'position must be a non-negative integer',
      );
    }
    if (
      props.altText !== null &&
      props.altText.length > HOME_SLIDE_ALT_TEXT_MAX_LENGTH
    ) {
      throw new InvalidHomeSlideError(
        `altText must be at most ${HOME_SLIDE_ALT_TEXT_MAX_LENGTH} characters`,
      );
    }
    return new HomeSlide({ ...props });
  }

  get id(): number {
    return this.props.id;
  }

  get imageUrl(): string {
    return this.props.imageUrl;
  }

  get imagePublicId(): string | null {
    return this.props.imagePublicId;
  }

  get altText(): string | null {
    return this.props.altText;
  }

  get position(): number {
    return this.props.position;
  }
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}
