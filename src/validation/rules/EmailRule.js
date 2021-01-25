import Rule from '../Rule';
import Assert from '../../utils/Assert';

export default class EmailRule extends Rule {
  static get ruleName() {
    return 'email';
  }

  getDefaultMessage(value) {
    return `${value} is not a valid email.`;
  }

  async validate(value) {
    const emailRegex = /[a-zA-Z0-9.!#$%^&*_`~+=/?{|}]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+/;
    Assert.toMatchRegex(emailRegex, value);
  }
}