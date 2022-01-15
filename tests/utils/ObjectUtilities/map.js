import ObjectUtils from '../../../src/utils/ObjectUtilities';

export default () => {
  describe('map function similar to array', () => {
    let subject;
    beforeEach(() => {
      subject = {
        1: 'a',
        2: 'b',
        3: 789,
      };
    });

    it('exists in utilies', () => {
      expect(typeof ObjectUtils.map).toEqual('function');
    });
    it('throws an error if no object supplied', () => {
      expect(ObjectUtils.map.bind(this)).toThrowError(
        'Object to map must be supplied as first argument'
      );
    });
    it('throws an error if object is not an object', () => {
      expect(ObjectUtils.map.bind(this, 4)).toThrowError('First argument must be an object');
    });
    it('handles case when object is empty', () => {
      expect(ObjectUtils.map({})).toEqual({});
    });
    describe('when no functions are passed in', () => {
      it('returns shallow copy of object (uses identity function)', () => {
        expect(ObjectUtils.map(subject)).toEqual(subject);
        expect(ObjectUtils.map(subject)).not.toBe(subject);
      });
    });
    it('maps keys according to key function', () => {
      const expected = {
        2: 'a',
        3: 'b',
        4: 789,
      };
      expect(ObjectUtils.map(subject, (key) => parseInt(key, 10) + 1)).toEqual(expected);
      expect(ObjectUtils.map(subject)).not.toBe(subject);
    });
    it('skips keys that map to null or undefined according to key function', () => {
      const expected = {
        0: 789,
      };
      let nextExpectedIndex = 0;
      const keyFunc = (key, value, index, obj) => {
        // test pasedd args
        expect(value).toBe(subject[key]);
        expect(index).toBe(nextExpectedIndex++);
        expect(obj).toBe(subject);
        let numKey = parseInt(key, 10);
        numKey -= 2;
        if (numKey < 0) return undefined;
        if (numKey === 0) return null;
        return 0;
      };
      expect(ObjectUtils.map(subject, keyFunc)).toEqual(expected);
      expect(ObjectUtils.map(subject)).not.toBe(subject);
    });
    it('maps values according to value function', () => {
      const expected = {
        1: undefined,
        2: null,
        3: '789a',
      };
      let nextExpectedIndex = 0;
      const valueFunc = (value, key, index, obj) => {
        expect(value).toBe(subject[key]);
        expect(index).toBe(nextExpectedIndex++);
        expect(obj).toBe(subject);
        let numKey = parseInt(key, 10);
        numKey -= 2;
        if (numKey < 0) return undefined;
        if (numKey === 0) return null;
        return `${value}a`;
      };
      expect(ObjectUtils.map(subject, undefined, valueFunc)).toEqual(expected);
      expect(ObjectUtils.map(subject)).not.toBe(subject);
    });
  });
};
