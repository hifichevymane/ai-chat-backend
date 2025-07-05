export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly message: string
  ) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
