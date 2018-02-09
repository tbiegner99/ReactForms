import {
    IdentityFunction,
    NoOperation,
    TrueFunction,
    FalseFunction
} from '../../src/utils/CommonFunctions';

describe('common functions', () => {
    it('returns nothing for no-op', () => {
        expect(NoOperation()).toBeUndefined();
    });
    it('returns item for identity function ', () => {
        expect(IdentityFunction('a')).toBe('a');
        expect(IdentityFunction(4)).toBe(4);
    });
    it('returns true for true function ', () => {
        expect(TrueFunction()).toBe(true);
    });
    it('returns false for false function ', () => {
        expect(FalseFunction()).toBe(false);
    });
});
