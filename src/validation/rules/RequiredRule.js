import Rule from '../Rule';
import InvalidValueError from '../errors/InvalidValueError';

export default class RequiredRule extends Rule {
    static get ruleName() {
        return 'required';
    }

    // this should be first in rule list be default
    get defaultPriority() {
        return 0;
    }

    validate(value) {
        return !value ? Promise.reject(new InvalidValueError()) : Promise.resolve();
    }
}
