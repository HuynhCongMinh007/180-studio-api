export type PresentationErrorKind = 'unauthorized' | 'forbidden'

export abstract class PresentationError extends Error {
  abstract readonly code: string
  abstract readonly kind: PresentationErrorKind
}
