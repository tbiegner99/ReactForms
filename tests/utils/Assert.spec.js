import Assert from '../../src/utils/Assert';

describe('Assertion utility', () => {
    it('asserts something is string', () => {
        const assertString = (item) => Assert.toBeString(item);
        const invalidValues = [null, undefined, true, 3, () => {}, {}];
        invalidValues.forEach((obj) => {
            expect(assertString.bind(null, obj)).toThrow(
                `Expected object of type ${typeof obj} to be of type string`
            );
        });
    });

    it('asserts something is instance of type', () => {
        const assertError = () => Assert.toBeInstanceOf({}, Error);
        expect(assertError).toThrow(`Expected object to be instance of Error`);
    });

    it('asserts something can be parsed to integer', () => {
        const assertInteger = () => Assert.toBeInteger('ABC');
        expect(() => Assert.toBeInteger('45')).not.toThrow();
        expect(assertInteger).toThrow('Expected ABC to be an integer');
    });

    it('asserts something is not null and not undefined', () => {
        const assertDefined = (item) => Assert.toNotBeNullOrUndefined(item);
        const invalidValues = [null, undefined];
        invalidValues.forEach((obj) => {
            expect(assertDefined.bind(null, obj)).toThrow('Object must be defined');
        });
    });

    it('asserts something is truthy', () => {
        const assertTruthy = (item) => Assert.toBeTruthy(item);
        const invalidValues = [null, undefined, 0, '', false];
        invalidValues.forEach((obj) => {
            expect(assertTruthy.bind(null, obj)).toThrow(`Expected ${obj} to be truthy`);
        });
    });

    it('asserts something is an Array', () => {
        const assertTruthy = (item) => Assert.toBeArray(item);
        const invalidValues = [null, undefined, 0, '', false, () => {}];
        invalidValues.forEach((obj) => {
            expect(assertTruthy.bind(null, obj)).toThrow(`Expected ${obj} to be an array`);
        });
        expect(assertTruthy.bind(null, [])).not.toThrow();
    });

    it('asserts condition is true', () => {
        const assertThat = (cond) => Assert.that(cond);
        const invalidValues = [false, true && false, !!''];
        invalidValues.forEach((obj) => {
            expect(assertThat.bind(null, obj)).toThrow(`Expected condition to be true`);
        });
    });

    it('asserts condition is false', () => {
        const assertThatNot = (cond) => Assert.thatNot(cond);
        const invalidValues = [true, true || false, !''];
        invalidValues.forEach((obj) => {
            expect(assertThatNot.bind(null, obj)).toThrow(`Expected condition to be false`);
        });
    });
});
