const objectIsUndefined = (obj) => typeof obj === 'undefined';

export default class Assert {
  static toMatchRegex(regex, value, msg) {
    Assert.toBeType(value, 'string');
    Assert.toBeInstanceOf(regex, RegExp);
    const defaultMessage = `Expected '${value}' to match regular expression`;
    Assert.that(regex.test(value), msg || defaultMessage);
  }

  static toBeOneOfType(obj, typeArr, msg) {
    for (let i = 0; i < typeArr.length; i++) {
      // eslint-disable-next-line valid-typeof
      if (typeof obj === typeArr[i]) return;
    }
    throw new Error(msg || `Expected object of type ${typeof obj} to be one of type ${typeArr}`);
  }

  static toBeType(obj, type, msg) {
    const message = msg || `Expected object of type ${typeof obj} to be of type ${type}`;
    // eslint-disable-next-line valid-typeof
    Assert.that(typeof obj === type, message);
  }

  static toBeInstanceOf(obj, clazz, msg) {
    const message = msg || `Expected object to be instance of ${clazz.name}`;
    Assert.that(obj instanceof clazz, message);
  }

  static toBe(obj, expected, msg) {
    Assert.that(obj === expected, msg);
  }

  static toBeObject(obj, msg) {
    return Assert.toBeType(obj, 'object', msg);
  }

  static toBeString(obj, msg) {
    return Assert.toBeType(obj, 'string', msg);
  }

  static toBeNumber(obj, msg) {
    return Assert.toBeType(obj, 'number', msg);
  }

  static toBeFunction(obj, msg) {
    return Assert.toBeType(obj, 'function', msg);
  }

  static toBeInteger(obj, msg) {
    const parsed = parseInt(obj, 10);
    const message = msg || `Expected ${obj} to be an integer`;
    Assert.thatNot(Number.isNaN(parsed), message);

    return parsed;
  }

  static toNotBeNullOrUndefined(obj, msg) {
    const objectIsNull = obj === null;
    const message = msg || 'Object must be defined';
    Assert.thatNot(objectIsNull || objectIsUndefined(obj), message);

    return obj;
  }

  static toBeTruthy(obj, msg) {
    const message = msg || `Expected ${obj} to be truthy`;
    Assert.that(Boolean(obj), message);

    return obj;
  }

  static toBeDefined(obj, msg) {
    const message = msg || 'Expected item to be defined';
    Assert.thatNot(objectIsUndefined(obj), message);
  }

  static toBeArray(obj, msg) {
    const message = msg || `Expected ${obj} to be an array`;
    Assert.that(Array.isArray(obj), message);
    return obj;
  }

  static that(condition, msg) {
    if (!condition) {
      throw new Error(msg || 'Expected condition to be true');
    }

    return condition;
  }

  static thatNot(condition, msg) {
    Assert.that(!condition, msg || 'Expected condition to be false');

    return condition;
  }
}
