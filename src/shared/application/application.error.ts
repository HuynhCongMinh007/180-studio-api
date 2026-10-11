export type ApplicationErrorKind = 'unauthorized' | 'forbidden'

export abstract class ApplicationError extends Error {
  abstract readonly code: string
  abstract readonly kind: ApplicationErrorKind
}
