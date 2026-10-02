import { isHttpsUrl } from '../../../../lib/utils';
import { InvalidHomeSlideError } from '../errors/home-slide.errors';

export const HOME_SLIDE_ALT_TEXT_MAX_LENGTH = 500;

export interface HomeSlideProps {
  id: number;
  imageUrl: string;
  position: number;
}

export class HomeSlide {
  private readonly _id: number
  private readonly _imageUrl: string
  private readonly _position: number

  private constructor(props: HomeSlideProps) {
    this._id = props.id;
    this._imageUrl = props.imageUrl;
    this._position = props.position;
  }

  static create(props: HomeSlideProps): HomeSlide {
    if (!isHttpsUrl(props.imageUrl)) {
      throw new InvalidHomeSlideError('imageUrl must be a valid HTTPS URL');
    }
    if (!Number.isInteger(props.position) || props.position < 0) {
      throw new InvalidHomeSlideError(
        'position must be a non-negative integer',
      );
    }
    return new HomeSlide({ ...props });
  }

  get id(): number {
    return this._id;
  }

  get imageUrl(): string {
    return this._imageUrl;
  }

  get position(): number {
    return this._position;
  }
}