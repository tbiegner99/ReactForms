import ArrayUtils from '../../../src/utils/ArrayUtilities';

export default () => {
  describe('map object to an array', () => {
    it('exists in utilies', () => {
      expect(typeof ArrayUtils.mapToObject).toEqual('function');
    });
    it('returns null if no object supplied', () => {
      expect(ArrayUtils.mapToObject()).toBe(null);
    });
    it('throws an error if object is not an array', () => {
      expect(ArrayUtils.mapToObject.bind(this, 4)).toThrowError('Expected array as first argument');
    });
    it('handles case when array is empty', () => {
      expect(ArrayUtils.mapToObject([])).toEqual({});
    });
    describe('when no functions are passed in', () => {
      it('returns object where keys are array indicies)', () => {
        expect(ArrayUtils.mapToObject(['a', true, 1, {}])).toEqual({
          0: 'a',
          1: true,
          2: 1,
          3: {},
        });
      });
    });
    describe('when no no value mapping function is passed in', () => {
      it('returns object where keys are array indicies)', () => {
        expect(ArrayUtils.mapToObject(['a', true, 1, {}])).toEqual({
          0: 'a',
          1: true,
          2: 1,
          3: {},
        });
      });
    });
    it('returns subset according to key function, no value mapping function', () => {
      const subject = [3, 6, 9];
      const keyFunc = (item, index) => String.fromCharCode('a'.charCodeAt(0) + index);
      const valueFunc = item => item * 3;
      const result = ArrayUtils.mapToObject(subject, keyFunc, valueFunc);
      expect(result).toEqual({ a: 9, b: 18, c: 27 });
    });
  });
};
