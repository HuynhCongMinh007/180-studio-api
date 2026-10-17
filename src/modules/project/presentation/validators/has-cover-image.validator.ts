import { registerDecorator, ValidationOptions } from 'class-validator'

interface ImageWithCover {
  coverPriority?: number | null
}

export function HasCoverImage(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      name: 'hasCoverImage',
      target: target.constructor,
      propertyName,
      options: {
        message: `${propertyName} must contain at least one image with a coverPriority`,
        ...validationOptions,
      },
      validator: {
        validate(value: unknown): boolean {
          if (!Array.isArray(value)) return false
          return value.some(
            (image: ImageWithCover) =>
              image?.coverPriority !== undefined &&
              image?.coverPriority !== null,
          )
        },
      },
    })
  }
}
