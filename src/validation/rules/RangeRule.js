import Rule from '../Rule';
import InvalidValueError from '../errors/InvalidValueError';
import Assert from '../../utils/Assert';
import MaxRule from './MaxRule';
import MinRule from './MinRule';

export default class RangeRule extends Rule {
  constructor(...args) {
    super();
    console.log(args);
    Assert.toBeArray(args, `Expected arguments to be an array of length 2`);
    Assert.that(args.length === 2, 'Expected exactly 2 arguments, min and max');
    this.min = new MinRule([args[0]]);
    this.max = new MaxRule([args[1]]);
  }

  static get ruleName() {
    return 'range';
  }

  async validate(value) {
    await Promise.all([this.min.validate(value), this.max.validate(value)]);
  }
}
