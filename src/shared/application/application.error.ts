export type ApplicationErrorKind = 'unauthorized' | 'forbidden' | 'not_found'

export abstract class ApplicationError extends Error {
  abstract readonly code: string
  abstract readonly kind: ApplicationErrorKind
}
