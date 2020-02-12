import { formatYearRange } from './utility';

describe('formatYearRange', () => {
    it('should work', () => {
        expect(formatYearRange(123, 456)).toBe(' (entre 123 et 456)');
        expect(formatYearRange(null, 456)).toBe(' (456)');
        expect(formatYearRange(123, null)).toBe(' (123)');
        expect(formatYearRange(null, null)).toBe('');
    });
});
