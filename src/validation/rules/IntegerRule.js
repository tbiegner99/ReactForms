import Rule from '../Rule';
import InvalidValueError from '../errors/InvalidValueError';
import ValueEnforcer from '../../utils/ValueEnforcer';

export default class IntegerRule extends Rule {
    constructor(args) {
        super();
        const radix = Array.isArray(args) ? args[0] : args;
        this.radix = ValueEnforcer.toBeNumber(radix, 10);
    }

    static get ruleName() {
        return 'integer';
    }

    validate(value) {
        const parsed = parseInt(value, this.radix);

        return Number.isNaN(parsed)
            ? Promise.reject(new InvalidValueError())
            : Promise.resolve(parsed);
    }
}
