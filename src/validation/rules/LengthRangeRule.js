import Rule from '../Rule';
import InvalidValueError from '../errors/InvalidValueError';
import Assert from '../../utils/Assert';
import LengthMinRule from './LengthMinRule';
import LengthMaxRule from './LengthMaxRule';

export default class LengthRangeRule extends Rule {
  constructor(args = [0, Number.MAX_VALUE]) {
    super();
    Assert.toBeArray(args, 'Expected args for LengthRangeRule to be array');
    const minLengthArg = Assert.toBeInteger(args[0] || 0, `Expected integer arg for min length but found ${args[0]}`);
    const maxLengthArg = Assert.toBeInteger(args[1] || 0, `Expected integer arg for min length but found ${Number.MAX_VALUE}`);
    Assert.that(minLengthArg <= maxLengthArg, `Invalid length range passed to min length rule (${minLengthArg}, ${maxLengthArg}). Max length must be greater than min length`);
    this.minLength = new LengthMinRule(minLengthArg);
    this.maxLength = new LengthMaxRule(maxLengthArg);
  }
  get name() {
    return 'length-range';
  }
  validate(value) {
    return this.minLength.validate(value)
      .then(() => this.maxLength.validate(value));
  }
}
