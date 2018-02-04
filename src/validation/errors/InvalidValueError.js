export default class InvalidValueError extends Error {
  constructor() {
    super();
    this.constructor = InvalidValueError;
    this.__proto__ = InvalidValueError.prototype;
  }
}
