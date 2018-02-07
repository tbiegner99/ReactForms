import Rule from '../Rule';
import InvalidValueError from '../errors/InvalidValueError';
import Assert from '../../utils/Assert';

export default class LengthMaxRule extends Rule {
    constructor(args) {
        super();
        const lengthArg = Array.isArray(args) ? args[0] : args;
        this.maxLength = Assert.toBeInteger(
            lengthArg,
            `Expected integer for max length but found ${lengthArg}`
        );
        Assert.that(
            this.maxLength > 0,
            `Invalid max length ${lengthArg}. Length must be greater than 0.`
        );
    }

    static get ruleName() {
        return 'max-length';
    }

    validate(value) {
        if (!value) return Promise.resolve();
        const { length } = value.toString();

        return length > this.maxLength
            ? Promise.reject(new InvalidValueError())
            : Promise.resolve();
    }
}
