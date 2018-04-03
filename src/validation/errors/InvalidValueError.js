export default class InvalidValueError extends Error {
  constructor() {
    super();
    this.constructor = InvalidValueError;
    // eslint-disable-next-line no-proto
    this.__proto__ = InvalidValueError.prototype;
  }
}
