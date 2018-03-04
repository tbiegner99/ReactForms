export default class Assert {
  static toBeOneOfType(obj, typeArr, msg) {
    for (let i = 0; i < typeArr.length; i++) {
      // eslint-disable-next-line valid-typeof
      if (typeof obj === typeArr[i]) return;
    }
    throw new Error(msg || `Expected object of type ${typeof obj} to be one of type ${typeArr}`);
  }

  static toBeType(obj, type, msg) {
    // eslint-disable-next-line valid-typeof
    if (typeof obj !== type) {
      throw new Error(msg || `Expected object of type ${typeof obj} to be of type ${type}`);
    }
  }

  static toBeInstanceOf(obj, clazz, msg) {
    if (!(obj instanceof clazz)) {
      throw new Error(msg || `Expected object to be instance of ${clazz.name}`);
    }
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
    if (Number.isNaN(parsed)) {
      throw new Error(msg || `Expected ${obj} to be an integer`);
    }

    return parsed;
  }

  static toNotBeNullOrUndefined(obj, msg) {
    if (obj === null || typeof obj === 'undefined') {
      throw new Error(msg || 'Object must be defined');
    }

    return obj;
  }

  static toBeTruthy(obj, msg) {
    if (!obj) {
      throw new Error(msg || `Expected ${obj} to be truthy`);
    }

    return obj;
  }

  static toBeArray(obj, msg) {
    if (!Array.isArray(obj)) {
      throw new Error(msg || `Expected ${obj} to be an array`);
    }

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
