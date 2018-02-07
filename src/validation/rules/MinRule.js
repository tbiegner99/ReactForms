import MaxRule from './MaxRule';

export default class MinRule extends MaxRule {
    static get ruleName() {
        return 'min';
    }

    valueExceedsLimit(value, limit) {
        return value < limit;
    }
}
