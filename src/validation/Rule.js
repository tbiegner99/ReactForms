/* Note the eslint exceptions in this file are because the definitions are more for illustrative documentation
  as to how the functions will be used as oposed to an actual implementation. This is designed
  to be an abstract class
*/
export default class Rule {
  // a rule may have a single argument. It may be an array, but its up to the rule to enforce.
  // They will be passed in on rule creation
  // eslint-disable-next-line no-useless-constructor, no-unused-vars, no-empty-function
  constructor(args) {}

  get defaultPriority() {
    return 1;
  }

  // Recommended to be overriden. It should be static
  static get ruleName() {
    return this.name;
  }

  get ruleName() {
    return this.constructor.ruleName;
  }

  getDefaultMessage(value, ruleInstance = this) {
    return `Rule violated for value ${value} - ${ruleInstance.ruleName}`;
  }

  // eslint-disable-next-line no-unused-vars
  async validate(value, formValues) {
    throw new Error(`Error in rule: ${this.name}. No rule definition supplied.`);
  }
}
