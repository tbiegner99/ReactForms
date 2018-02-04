import Assert from './Assert';

export default class ValueEnforcer {
  static toBeType(obj, type, defaultValue) {
    try {
      Assert.toBeType(obj, type);
      return obj;
    } catch (e) {
      return defaultValue;
    }
  }

  static toBeOneOfType(typeArr, obj, defaultValue) {
    for (let i = 0; i < typeArr.length; i++) {
      if (typeof obj === typeArr[i]) return obj;
    }
    return defaultValue;
  }

  static toBeObject(obj, defaultValue) {
    try {
      Assert.toBeObject(obj);
      return obj;
    } catch (e) {
      return defaultValue;
    }
  }

  static toBeNumber(obj, defaultValue) {
    try {
      Assert.toBeNumber(obj);
      return obj;
    } catch (e) {
      return defaultValue;
    }
  }

  static toBeString(obj, defaultValue) {
    try {
      Assert.toBeString(obj);
      return obj;
    } catch (e) {
      return defaultValue;
    }
  }

  static toBeFunction(obj, defaultValue) {
    try {
      Assert.toBeFunction(obj);
      return obj;
    } catch (e) {
      return defaultValue;
    }
  }

  static toNotBeNullOrUndefined(obj, defaultValue) {
    try {
      Assert.toNotBeNullOrUndefined(obj);
      return obj;
    } catch (e) {
      return defaultValue;
    }
  }

  static toBeTruthy(obj, defaultValue) {
    try {
      Assert.toBeTruthy(obj);
      return obj;
    } catch (e) {
      return defaultValue;
    }
  }
}
