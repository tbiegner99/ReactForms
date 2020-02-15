import {
  IdentityFunction,
  NoOperation,
  TrueFunction,
  FalseFunction,
  RejectFunction,
  ResolveFunction
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
  it('returns rejected promise for reject function ', async () => {
    const message = 'some rejection message';
    try {
      await RejectFunction(message);
    } catch (err) {
      expect(err.message).toEqual(message);
      return;
    }
    throw new Error('expected an error');
  });

  it('returns resolved promise for resolve function ', async () => {
    const value = 'some-value';
    expect(await ResolveFunction(value)).toEqual(value);
  });
});
