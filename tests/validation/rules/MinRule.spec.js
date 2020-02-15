import MinRule from '../../../src/validation/rules/MinRule';

describe('MinRule', () => {
    it('exported as a type', () => {
        expect(typeof MinRule).toEqual('function');
    });

    it('has a name', () => {
        expect(MinRule.ruleName).toEqual('min');
    });

    it('throws an error when trying to construct with no args', () => {
        const create = () => new MinRule();
        expect(create).toThrow('Expected string, function, number, or date for rule argument');
    });

    it('throws an error when trying to construct with null, boolean, or non', () => {
        let create = () => new MinRule(null);
        expect(create).toThrow('Expected string, function, number, or date for rule argument');
        create = () => new MinRule(true);
        expect(create).toThrow('Expected string, function, number, or date for rule argument');
        create = () => new MinRule({});
        expect(create).toThrow('Expected string, function, number, or date for rule argument');
    });

    it('successfully constructs rule with valid arguments', () => {
        let create = () => new MinRule(1);
        expect(create).not.toThrow();
        create = () => new MinRule([1]);
        expect(create).not.toThrow();
        create = () => new MinRule(() => true);
        expect(create).not.toThrow();
        create = () => new MinRule(new Date());
        expect(create).not.toThrow();
        create = () => new MinRule('');
        expect(create).not.toThrow();
    });

    describe('with valid instance', () => {
        let rule;
        beforeEach(() => {
            rule = new MinRule([2]);
        });

        it('has an implementation of validate', () => {
            expect(typeof rule.validate).toEqual('function');
        });

        it('does not validate null value', async () => {
            await expect(rule.validate(null)).resolves.toBeUndefined();
            await expect(rule.validate()).resolves.toBeUndefined();
            await expect(rule.validate(0)).rejects.toBeDefined();
        });
    });

    describe('with number as min value comparison', () => {
        let rule;
        beforeEach(() => {
            rule = new MinRule([5]);
        });
        it('returns a  resolved promise if value is less than or equal to argument', async () => {
            await expect(rule.validate(8)).resolves.toBeUndefined();
            await expect(rule.validate(5)).resolves.toBeUndefined();
        });

        it('returns a  rejected promise if value is not less than or equal to argument', async () => {
            await expect(rule.validate('-1')).rejects.toBeDefined();
            await expect(rule.validate(3)).rejects.toBeDefined();
        });
    });

    describe('with string as min value comparison', async () => {
        let rule;
        beforeEach(() => {
            rule = new MinRule(['cherry']);
        });
        it('returns a  resolved promise if value is less than or equal to argument', async () => {
            await expect(rule.validate('pear')).resolves.toBeUndefined();
            await expect(rule.validate('zebra')).resolves.toBeUndefined();
        });

        it('returns a  rejected promise if value is not less than or equal to argument', async () => {
            await expect(rule.validate('apple')).rejects.toBeDefined();
            await expect(rule.validate('c')).rejects.toBeDefined();
            await expect(rule.validate('ZEBRA')).rejects.toBeDefined();
        });
    });

    describe('with function as min value comparison', () => {
        let rule;
        beforeEach(() => {
            rule = new MinRule((value) => value.field > 1);
        });
        it('returns a  resolved promise if value is less than or equal to argument', async () => {
            await expect(rule.validate({ field: 2 })).resolves.toBeUndefined();
        });

        it('returns a  rejected promise if value is not less than or equal to argument', async () => {
            await expect(rule.validate({ field: 0 })).rejects.toBeDefined();
        });
    });

    describe('with function as min value comparison', () => {
        let rule;
        beforeEach(() => {
            rule = new MinRule(new Date());
        });
        it('returns a  resolved promise if value is less than or equal to argument', async () => {
            const currentTime = new Date().getTime();
            await expect(rule.validate(new Date(currentTime + 1000))).resolves.toBeUndefined();
            await expect(rule.validate(currentTime + 1000)).resolves.toBeUndefined();
        });

        it('returns a  rejected promise if value is not less than or equal to argument', async () => {
            const currentTime = new Date().getTime();
            await expect(rule.validate(new Date(currentTime - 1000))).rejects.toBeDefined();
            await expect(rule.validate(currentTime - 1000)).rejects.toBeDefined();
        });
    });
});
