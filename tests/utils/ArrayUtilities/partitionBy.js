import ArrayUtils from '../../../src/utils/ArrayUtilities';

const mapper = (item, index) => {
  if (index === 0) {
    return '';
  } else if (item % 2 === 0) {
    return 2;
  } else if (item % 3 === 0) {
    return 3;
  } else if (item % 5 === 0) {
    return null;
  }
  return undefined;
};

export default () => {
  describe('map object to an array', () => {
    let subject;

    beforeEach(() => {
      subject = [-1, 2, 3, 4, 5, 6, 7, 8, 9];
    });
    it('exists in utilies', () => {
      expect(typeof ArrayUtils.partitionBy).toEqual('function');
    });
    it('returns null if no object supplied', () => {
      expect(ArrayUtils.partitionBy()).toBe(null);
    });
    it('throws an error if object is not an array', () => {
      expect(ArrayUtils.partitionBy.bind(this, 4)).toThrowError('Expected array as first argument');
    });
    it('handles case when array is empty', () => {
      expect(ArrayUtils.partitionBy([])).toEqual({});
    });
    describe('when no mapping function is passed in', () => {
      it('returns object where one key true contains all elements in array', () => {
        expect(ArrayUtils.partitionBy(subject)).toEqual({
          true: subject,
        });
      });
    });
    it('creates object where each key returned by mapping function has an array containing element for which that value was returned', () => {
      // shoud skip values returning undefined or null -> 5,7
      expect(ArrayUtils.partitionBy(subject, mapper)).toEqual({
        '': [-1],
        2: [2, 4, 6, 8],
        3: [3, 9],
      });
    });

    it('allowsNull Keys using optional 3rd argument', () => {
      expect(ArrayUtils.partitionBy(subject, mapper, true)).toEqual({
        '': [-1],
        2: [2, 4, 6, 8],
        3: [3, 9],
        null: [5],
        undefined: [7],
      });
    });
  });
};
