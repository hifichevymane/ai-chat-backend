export class HttpError extends Error {
  constructor(
    public status: number,
    public message: string,
    public errors?: string[]
  ) {
    super(message);
    this.status = status;
    this.errors = errors;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
