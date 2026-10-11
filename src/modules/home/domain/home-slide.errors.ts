export class InvalidHomeSlideError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidHomeSlideError';
  }
}
