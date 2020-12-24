import Rule from '../Rule';
import InvalidValueError from '../errors/InvalidValueError';
import Assert from '../../utils/Assert';

const expectValidArgumentType = (arg, msg) => {
  Assert.toNotBeNullOrUndefined(arg, msg);
  Assert.toBeOneOfType(arg, ['string', 'number'], msg);
};

const FILE_SIZE_REGEX = /^([0-9]+(?:\.[0-9]+)?)\s*([mMkKgG]?)$/;

export default class MaxFileSizeRule extends Rule {
  constructor(args) {
    super();
    const maxArg = Array.isArray(args) ? args[0] : args;

    expectValidArgumentType(maxArg, 'Expected string or number for rule argument');
    // allow strings, numbers,comparisonFunctions, or dates
    if (typeof maxArg === 'number') {
      this.limitArg = maxArg.getTime();
    } else {
      Assert.toMatchRegex(FILE_SIZE_REGEX, maxArg, 'Not a valid size string');
      this.limitArg = this.extractSize(maxArg);
    }
  }

  getDefaultMessage(value, ruleInstance = this) {
    return `Max size ${ruleInstance.limitArg} exceeded for file ${value.name}. File size: ${value.size}`;
  }

  static get ruleName() {
    return 'max-size';
  }

  valueExceedsLimit(value, limit) {
    return value > limit;
  }

  extractSize(arg) {
    const matches = arg.match(FILE_SIZE_REGEX);
    if (!matches) {
      throw new Error('not valid size expression');
    }
    let bytes = Number.parseFloat(matches[1]);
    const unit = matches[2];
    switch (unit.toLowerCase()) {
      case 'g':
        bytes *= 1024;
      case 'm':
        bytes *= 1024;
      case 'k':
        bytes *= 1024;
      default:
    }
    return bytes;
  }

  async validate(value) {
    if (!value) {
      return undefined;
    }
    if (!typeof value === 'object') {
      throw new InvalidValueError('Value is not a file');
    }

    if (typeof value.size !== 'number') {
      throw new InvalidValueError('Unknown file size to validate');
    }

    if (this.valueExceedsLimit(value.size, this.limitArg)) {
      throw new InvalidValueError('FileSize');
    }
    return undefined;
  }
}
