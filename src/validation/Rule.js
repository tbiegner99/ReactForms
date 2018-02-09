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

    // To avoid errors this must be overriden and must be static
    static get name() {
        return null;
    }

    // returns static definition
    get name() {
        return this.constructor.name;
    }

    getDefaultMessage(value) {
        return `Rule violated for value ${value} - ${this.name}`;
    }

    // eslint-disable-next-line no-unused-vars
    validate(value) {
        return Promise.reject(
            new Error(`Error in rule: ${this.name}. No rule definition supplied.`)
        );
    }
}
