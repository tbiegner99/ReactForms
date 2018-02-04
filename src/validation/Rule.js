
export default class Rule {
  // a rule may have a single argument. It may be an array, but its up to the rule to enforce.
  // They will be passed in on rule creation
  constructor(args) {}

  get defaultPriority() {
    return 1;
  }
  // To avoid errors this must be overriden
  get name() {
    return null;
  }

  getDefaultMessage(value) {
    return `Rule violated for value ${value} - ${this.name}`;
  }

  validate(value) {
    return Promise.reject(new Error(`Error in rule: ${this.name}. No rule definition supplied.`));
  }
}
