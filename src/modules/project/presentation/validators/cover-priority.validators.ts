import { registerDecorator, ValidationOptions } from 'class-validator'

interface ImageWithCover {
  coverPriority?: number | null
}

// Priorities that are set (neither null nor undefined). Returns null when the
// value is not an array, so the array validators can report that instead.
function getCoverPriorities(value: unknown): number[] | null {
  if (!Array.isArray(value)) return null
  return value
    .map((image: ImageWithCover) => image?.coverPriority)
    .filter(
      (priority): priority is number =>
        priority !== undefined && priority !== null,
    )
}

// No two images may share the same coverPriority.
export function UniqueCoverPriorities(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      name: 'uniqueCoverPriorities',
      target: target.constructor,
      propertyName,
      options: {
        message: `${propertyName} must not contain two images with the same coverPriority`,
        ...validationOptions,
      },
      validator: {
        validate(value: unknown): boolean {
          const priorities = getCoverPriorities(value)
          if (priorities === null) return true
          return new Set(priorities).size === priorities.length
        },
      },
    })
  }
}

// At most `max` images may have a coverPriority.
export function MaxCoverImages(
  max: number,
  validationOptions?: ValidationOptions,
) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      name: 'maxCoverImages',
      target: target.constructor,
      propertyName,
      constraints: [max],
      options: {
        message: `${propertyName} must contain at most ${max} images with a coverPriority`,
        ...validationOptions,
      },
      validator: {
        validate(value: unknown): boolean {
          const priorities = getCoverPriorities(value)
          if (priorities === null) return true
          return priorities.length <= max
        },
      },
    })
  }
}
