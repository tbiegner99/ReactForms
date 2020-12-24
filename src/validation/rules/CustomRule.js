import Rule from '../Rule';
import Assert from '../../utils/Assert';

export default class CustomRule extends Rule {
  constructor(args) {
    super();
    const functionArg = Array.isArray(args) ? args[0] : args;

    Assert.toBeFunction(functionArg, 'Expected  function for custom rule argument');
  
      this.validateFunction = functionArg;
  }

  static get ruleName() {
    return 'custom';
  }

  getDefaultMessage(value) {
    return `Custom rule has failed validation on ${value}.`;
  }

  async validate(value) {
    const valid=await this.validateFunction(value);
    Assert.toBeTruthy(valid, "Custom rule failed");
  }
}
