import Rule from '../Rule';
import Assert from '../../utils/Assert';
import MaxRule from './MaxRule';
import MinRule from './MinRule';

export default class RangeRule extends Rule {
  constructor(...args) {
    super();
    Assert.toBeArray(args, `Expected arguments to be an array of length 2`);
    let range = args;
    if (args.length === 1) {
      Assert.toBeArray(args[0], `Expected arguments to be an array of length 2`);
      [range] = args;
    }
    Assert.that(range.length === 2, 'Expected exactly 2 arguments, min and max');
    const [min, max] = range;
    this.min = new MinRule(min);
    this.max = new MaxRule(max);
  }

  static get ruleName() {
    return 'range';
  }

  async validate(value) {
    await Promise.all([this.min.validate(value), this.max.validate(value)]);
  }
}
