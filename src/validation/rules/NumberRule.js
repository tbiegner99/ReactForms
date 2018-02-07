import Rule from '../Rule';
import InvalidValueError from '../errors/InvalidValueError';

export default class NumberRule extends Rule {
    static get ruleName() {
        return 'number';
    }

    validate(value) {
        const parsed = parseFloat(value);

        return Number.isNaN(parsed)
            ? Promise.reject(new InvalidValueError())
            : Promise.resolve(parsed);
    }
}
