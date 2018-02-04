import ObjectUtils from '../../../src/utils/ObjectUtilities';

export default () => {
  describe('map function similar to array', () => {
    let subject;
    beforeEach(() => {
      subject = {
        1: 'a',
        2: 'b',
        3: 789,
        4: 90,
        5: 'KEEP',
        6: 'KEEP2',
        7: 72,
      };
    });

    it('exists in utilies', () => {
      expect(typeof ObjectUtils.filter).toEqual('function');
    });
    it('throws an error if no object supplied', () => {
      expect(ObjectUtils.filter.bind(this)).toThrowError('Object to map must be supplied as first argument');
    });
    it('throws an error if object is not an object', () => {
      expect(ObjectUtils.filter.bind(this, 4)).toThrowError('First argument must be an object');
    });
    it('handles case when object is empty', () => {
      expect(ObjectUtils.filter({})).toEqual({});
    });
    describe('when no functions are passed in', () => {
      it('returns shallow copy of object (uses identity function)', () => {
        expect(ObjectUtils.filter(subject)).toEqual(subject);
        expect(ObjectUtils.filter(subject)).not.toBe(subject);
      });
    });
    it('returns subset according to filter function', () => {
      const expected = {
        2: 'b',
        4: 90,
        5: 'KEEP',
        6: 'KEEP2',
        7: 72,
      };
      const filterFunc = (key, value, obj) => {
        const numKey = parseInt(key, 10);
        return numKey % 2 === 0 || value === 'KEEP' || Object.keys(obj).length === numKey;
      };
      const result = ObjectUtils.filter(subject, filterFunc);
      expect(result).toEqual(expected);
    });
  });
};
