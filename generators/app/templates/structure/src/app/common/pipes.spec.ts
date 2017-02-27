import { OrderByPipe, ObjFormatPipe, FallbackPipe } from './pipes';
describe('Helpers', () => {
  describe('Pipes', () => {
    describe('orderBy', () => {
      let orderBy = new OrderByPipe();

      it('should sort an array of objects by field', () => {
        expect(orderBy.transform([{a: 2}, {a: 1}, {a: 3}], 'a')).toEqual([{a: 1}, {a: 2}, {a: 3}]);
      });

      it('should sort an array of objects by field descending', () => {
        expect(orderBy.transform([{a: 2}, {a: 1}, {a: 3}], '-a')).toEqual([{a: 3}, {a: 2}, {a: 1}]);
      });
    });

    describe('objFormat', () => {
      let objFormat = new ObjFormatPipe();

      it('should format an object', () => {
        expect(objFormat.transform({a: 10, b: 20}, '{a} < {b}')).toEqual('10 < 20');
      });
    });

    describe('fallback', () => {
      let fallback = new FallbackPipe();

      it('should return an empty string if fallback is not provided and value is null or undefined', () => {
        expect(fallback.transform(null)).toEqual('');
        expect(fallback.transform(undefined)).toEqual('');
      });

      it('should return a value if it`s falsy, but not null or undefined', () => {
        expect(fallback.transform(0)).toEqual(0);
        expect(fallback.transform('')).toEqual('');
        expect(fallback.transform(false)).toEqual(false);
      });

      it('should return a fallback if value is null or undefined', () => {
        expect(fallback.transform(null, 'test')).toEqual('test');
        expect(fallback.transform(null, true)).toEqual(true);
        expect(fallback.transform(null, 123)).toEqual(123);
      });
    });
  });
});
