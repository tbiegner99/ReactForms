import Rule from '../Rule';
import Assert from '../../utils/Assert';
import LengthMinRule from './LengthMinRule';
import LengthMaxRule from './LengthMaxRule';

export default class LengthRangeRule extends Rule {
    constructor(minValue = 0, maxValue = Number.MAX_VALUE) {
        super();
        const minLengthArg = Assert.toBeInteger(
            minValue || 0,
            `Expected integer arg for min length but found ${minValue}`
        );
        const maxLengthArg = Assert.toBeInteger(
            maxValue || 0,
            `Expected integer arg for max length but found ${maxValue}`
        );

        Assert.that(
            minLengthArg <= maxLengthArg,
            `Invalid length range passed to min length rule (${minLengthArg}, ${maxLengthArg}). Max length must be greater than min length`
        );
        this.minLength = new LengthMinRule(minLengthArg);
        this.maxLength = new LengthMaxRule(maxLengthArg);
    }

    static get ruleName() {
        return 'length-range';
    }

    validate(value) {
        return this.minLength.validate(value).then(() => this.maxLength.validate(value));
    }
}
